import { NextResponse } from "next/server";
import { getTopicBySlug, getQuestionsByTopicId } from "@/src/db";

export const runtime = "edge";
export const revalidate = 3600;

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

  if (code) {
    text += `\n\n\`\`\`\n${code}\n\`\`\``;
  }

  if (imgUrl && !text.includes(imgUrl) && !text.includes("![")) {
    text += `\n\n![diagram](${imgUrl})\n`;
  }

  return text;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const topic = await getTopicBySlug(slug);

    if (!topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

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

    return NextResponse.json(
      { topic, questions },
      {
        headers: {
          "Cache-Control": "public, max-age=300, s-maxage=86400, stale-while-revalidate=604800",
        },
      }
    );
  } catch (err) {
    console.error("D1 query error for topic questions:", err);
    return NextResponse.json({ error: "Failed to fetch topic questions" }, { status: 500 });
  }
}
