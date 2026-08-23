import { NextResponse } from "next/server";
import { getQuestionsByIds } from "@/src/db";

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

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const idsParam = searchParams.get("ids");
    if (!idsParam) {
      return NextResponse.json([], {
        headers: {
          "Cache-Control": "public, max-age=300, s-maxage=86400, stale-while-revalidate=604800",
        },
      });
    }

    const ids = idsParam
      .split(",")
      .map((id) => parseInt(id.trim(), 10))
      .filter((id) => !isNaN(id) && id > 0);

    if (ids.length === 0) {
      return NextResponse.json([], {
        headers: {
          "Cache-Control": "public, max-age=300, s-maxage=86400, stale-while-revalidate=604800",
        },
      });
    }

    const cappedIds = ids.slice(0, 100);
    const rows = await getQuestionsByIds(cappedIds);

    const questions = (rows || []).map((found) => {
      const imgUrl = resolveImageUrl(found.imageUrl);
      const answer = normalizeContent(found.answer || "", imgUrl);
      return {
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
      };
    });

    return NextResponse.json(questions, {
      headers: {
        "Cache-Control": "public, max-age=300, s-maxage=86400, stale-while-revalidate=604800",
      },
    });
  } catch (err) {
    console.error("D1 query error for /api/questions batch:", err);
    return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 });
  }
}
