import { NextResponse } from "next/server";
import { DATA } from "@/src/lib/data";

interface RawQ {
  id?: number;
  question?: string;
  answer?: string;
  image?: string;
  image2?: string;
  code?: string;
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
    name: slug,
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
    let answer = q.answer || "";
    if (q.code) answer += `\n\`\`\`\n${q.code}\n\`\`\``;
    return {
      id: q.id || counter++,
      topicId: 1,
      question: q.question || "",
      answer,
      imageUrl: q.image || q.image2 || null,
      sourceFile: slug,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });

  return NextResponse.json({ topic, questions });
}
