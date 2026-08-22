import { NextResponse } from "next/server";
import { DATA } from "@/src/lib/data";
import { queryD1 } from "@/src/lib/d1-remote";

export const dynamic = "force-static";

export function generateStaticParams() {
  return Object.keys(DATA).map((slug) => ({ slug }));
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
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  // 1. Try querying remote Cloudflare D1 database directly
  try {
    const topicRows = await queryD1<{
      id: number;
      slug: string;
      name: string;
      category: string;
    }>("SELECT id, slug, name, category FROM topics WHERE slug = ? LIMIT 1", [slug]);

    if (topicRows && topicRows.length > 0) {
      const topic = topicRows[0];
      const qRows = await queryD1<{
        id: number;
        topic_id: number;
        question: string;
        answer: string;
        image_url: string | null;
        source_file: string | null;
      }>("SELECT id, topic_id, question, answer, image_url, source_file FROM questions WHERE topic_id = ? ORDER BY id ASC", [topic.id]);

      const questions = qRows.map((q) => {
        const imgUrl = resolveImageUrl(q.image_url);
        const answer = normalizeContent(q.answer || "", imgUrl);
        return {
          id: q.id,
          topicId: q.topic_id,
          question: q.question || "",
          answer,
          imageUrl: imgUrl,
          sourceFile: q.source_file,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      });

      return NextResponse.json({ topic, questions });
    }
  } catch (err) {
    console.warn("D1 query fallback for topic questions:", err);
  }

  // 2. Fallback to local memory / static data
  const rawData = DATA[slug];
  if (!rawData) {
    return NextResponse.json({ error: "Topic not found" }, { status: 404 });
  }

  const topic = {
    id: 1,
    slug,
    name: slug.replace(/_/g, " "),
    category: "tech",
    createdAt: new Date(),
  };

  let rawList: RawQ[] = [];
  if (Array.isArray(rawData)) {
    rawList = rawData as RawQ[];
  } else if (rawData && typeof rawData === "object") {
    const obj = rawData as Record<string, RawQ[]>;
    for (const val of Object.values(obj)) {
      if (Array.isArray(val)) rawList.push(...val);
    }
  }

  let counter = 1;
  const questions = rawList.map((q) => {
    const imgUrl = resolveImageUrl(q.image || q.image2 || null);
    const answer = normalizeContent(q.answer || "", imgUrl, q.code);

    return {
      id: q.id || counter++,
      topicId: 1,
      question: q.question || "",
      answer,
      imageUrl: imgUrl,
      sourceFile: slug,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });

  return NextResponse.json({ topic, questions });
}
