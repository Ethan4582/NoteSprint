import { NextResponse } from "next/server";
import { DATA } from "@/src/lib/data";

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
  const clean = img.replace(/^\/?(assets\/)?/, "");
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
