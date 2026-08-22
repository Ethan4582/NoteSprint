import { NextResponse } from "next/server";
import { DATA } from "@/src/lib/data";

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

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const numId = parseInt(id, 10);

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

  let answer = found.answer || "";
  if (found.code) answer += `\n\`\`\`\n${found.code}\n\`\`\``;

  return NextResponse.json({
    id: found.id || numId,
    topicId,
    topicSlug,
    topicName: topicSlug.replace(/_/g, " "),
    category: "tech",
    question: found.question || "",
    answer,
    imageUrl: found.image || found.image2 || null,
    sourceFile: topicSlug,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}
