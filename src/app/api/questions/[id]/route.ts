import { NextResponse } from "next/server";
import { DATA } from "@/src/lib/data";
import { queryD1 } from "@/src/lib/d1-remote";

export const dynamic = "force-static";

export function generateStaticParams() {
  const ids: { id: string }[] = [];
  for (let i = 1; i <= 250; i++) {
    ids.push({ id: String(i) });
  }
  return ids;
}

interface RawQ {
  id?: number;
  question?: string;
  answer?: string;
  image?: string;
  image2?: string;
  code?: string;
}

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
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const numId = parseInt(id, 10);

  // 1. Query remote D1 database
  try {
    const qRows = await queryD1<{
      id: number;
      topic_id: number;
      question: string;
      answer: string;
      image_url: string | null;
      source_file: string | null;
      slug: string;
      name: string;
      category: string;
    }>(`
      SELECT q.id, q.topic_id, q.question, q.answer, q.image_url, q.source_file,
             t.slug, t.name, t.category
      FROM questions q
      JOIN topics t ON t.id = q.topic_id
      WHERE q.id = ?
      LIMIT 1
    `, [numId]);

    if (qRows && qRows.length > 0) {
      const found = qRows[0];
      const imgUrl = resolveImageUrl(found.image_url);
      const answer = normalizeContent(found.answer || "", imgUrl);
      return NextResponse.json({
        id: found.id,
        topicId: found.topic_id,
        topicSlug: found.slug,
        topicName: found.name,
        category: found.category,
        question: found.question || "",
        answer,
        imageUrl: imgUrl,
        sourceFile: found.source_file,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  } catch (err) {
    console.warn("D1 query fallback for /api/questions/[id]:", err);
  }

  // 2. Fallback to local memory / static data
  let found: RawQ | null = null;
  let topicSlug = "";
  let topicId = 1;

  let topicCounter = 1;
  for (const [slug, val] of Object.entries(DATA)) {
    const currentTopicId = topicCounter++;
    let list: RawQ[] = [];
    if (Array.isArray(val)) {
      list = val as RawQ[];
    } else if (val && typeof val === "object") {
      for (const sub of Object.values(val as Record<string, RawQ[]>)) {
        if (Array.isArray(sub)) list.push(...sub);
      }
    }

    const match = list.find((q) => q && q.id === numId);
    if (match) {
      found = match;
      topicSlug = slug;
      topicId = currentTopicId;
      break;
    }
  }

  if (!found) {
    return NextResponse.json({ error: "Question not found" }, { status: 404 });
  }

  const imgUrl = resolveImageUrl(found.image || found.image2 || null);
  const answer = normalizeContent(found.answer || "", imgUrl, found.code);

  return NextResponse.json({
    id: found.id || numId,
    topicId,
    topicSlug,
    topicName: topicSlug.replace(/_/g, " "),
    category: "tech",
    question: found.question || "",
    answer,
    imageUrl: imgUrl,
    sourceFile: topicSlug,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}
