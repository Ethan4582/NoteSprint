import { NextResponse } from "next/server";
import { getQuestionById } from "@/src/db";

export const dynamic = "force-dynamic";

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

  try {
    const found = await getQuestionById(numId);

    if (!found) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    const imgUrl = resolveImageUrl(found.imageUrl);
    const answer = normalizeContent(found.answer || "", imgUrl);
    return NextResponse.json({
      id: found.id,
      topicId: found.topicId,
      topicSlug: found.topicSlug,
      topicName: found.topicName,
      category: found.category,
      question: found.question || "",
      answer,
      imageUrl: imgUrl,
      sourceFile: found.sourceFile,
      createdAt: found.createdAt || new Date(),
      updatedAt: found.updatedAt || new Date(),
    });
  } catch (err) {
    console.error("D1 query error for /api/questions/[id]:", err);
    return NextResponse.json({ error: "Failed to fetch question" }, { status: 500 });
  }
}
