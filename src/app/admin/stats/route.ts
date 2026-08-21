import { NextResponse } from "next/server";
import { DATA } from "@/src/lib/data";
import { getMarkdownFiles } from "@/src/lib/markdown";

export async function GET() {
  const totalTopics = Object.keys(DATA).length;

  let totalQuestions = 0;
  for (const val of Object.values(DATA)) {
    if (Array.isArray(val)) {
      totalQuestions += val.length;
    } else if (val && typeof val === "object") {
      for (const sub of Object.values(val as Record<string, unknown[]>)) {
        if (Array.isArray(sub)) totalQuestions += sub.length;
      }
    }
  }

  const lld = await getMarkdownFiles("lld");
  const hld = await getMarkdownFiles("hld");
  const totalArticles = lld.length + hld.length;

  return NextResponse.json({
    totalTopics,
    totalQuestions,
    totalArticles,
  });
}
