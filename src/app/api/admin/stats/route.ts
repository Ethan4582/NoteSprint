import { NextResponse } from "next/server";
import { getMarkdownFiles } from "@/src/lib/markdown";
import { getDbStats } from "@/src/db";

export const dynamic = "force-dynamic";

export async function GET() {
  let totalTopics = 0;
  let totalQuestions = 0;
  let totalArticles = 0;

  try {
    const stats = await getDbStats();
    totalTopics = stats.totalTopics;
    totalQuestions = stats.totalQuestions;
    totalArticles = stats.totalArticles;
  } catch (err) {
    console.warn("D1 stats fallback:", err);
  }

  if (totalArticles === 0) {
    try {
      const lld = await getMarkdownFiles("lld");
      const hld = await getMarkdownFiles("hld");
      totalArticles = lld.length + hld.length;
    } catch {
      // ignore
    }
  }

  return NextResponse.json({
    totalTopics,
    totalQuestions,
    totalArticles,
  });
}
