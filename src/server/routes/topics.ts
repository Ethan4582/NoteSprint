import { Hono } from "hono";
import { getAllTopics, getTopicBySlug, getQuestionsByTopicId } from "@/src/db";

const topicsRoute = new Hono();

function resolveImageUrl(img?: string | null): string | null {
  if (!img) return null;
  if (img.startsWith("http://") || img.startsWith("https://")) return img;
  const clean = img.replace(/^(\.\.\/)+/, "").replace(/^\/?(assets\/)?/, "").replace(/^\/?public\//, "");
  return `https://pub-b534e22f723c443c85a87484a6c795cc.r2.dev/assets/${clean.replace(/\.(png|jpg|jpeg)$/i, ".webp")}`;
}

function normalizeContent(answer: string, imgUrl: string | null, code?: string): string {
  let text = (answer || "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/?strong>/gi, "**")
    .replace(/<\/?b>/gi, "**")
    .replace(/<\/?em>/gi, "*")
    .replace(/<\/?i>/gi, "*");

  if (code) text += `\n\n\`\`\`\n${code}\n\`\`\``;
  if (imgUrl && !text.includes(imgUrl) && !text.includes("![")) {
    text += `\n\n![diagram](${imgUrl})\n`;
  }
  return text;
}

topicsRoute.get("/", async (c) => {
  try {
    const d1Topics = await getAllTopics();
    return c.json(d1Topics || [], 200, {
      "Cache-Control": "public, max-age=60, s-maxage=3600, stale-while-revalidate=86400",
    });
  } catch (e) {
    console.error("D1 topics query error:", e);
    return c.json([], 500);
  }
});

topicsRoute.get("/:slug/questions", async (c) => {
  const slug = c.req.param("slug");
  try {
    const topic = await getTopicBySlug(slug);
    if (!topic) return c.json({ error: "Topic not found" }, 404);

    const qRows = await getQuestionsByTopicId(topic.id);
    const questions = (qRows || []).map((q) => {
      const imgUrl = resolveImageUrl(q.imageUrl);
      const answer = normalizeContent(q.answer || "", imgUrl);
      return {
        id: q.id,
        topicId: q.topicId,
        question: q.question || "",
        answer,
        imageUrl: imgUrl,
        sourceFile: q.sourceFile,
        createdAt: q.createdAt || new Date(),
        updatedAt: q.updatedAt || new Date(),
      };
    });

    return c.json({ topic, questions }, 200, {
      "Cache-Control": "public, max-age=300, s-maxage=86400, stale-while-revalidate=604800",
    });
  } catch (err) {
    console.error("D1 query error for topic questions:", err);
    return c.json({ error: "Failed to fetch topic questions" }, 500);
  }
});

export default topicsRoute;
