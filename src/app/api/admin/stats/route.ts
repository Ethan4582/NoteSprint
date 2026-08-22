import { NextResponse } from "next/server";
import { DATA } from "@/src/lib/data";
import { getMarkdownFiles } from "@/src/lib/markdown";
import { queryD1 } from "@/src/lib/d1-remote";

export const dynamic = "force-static";

export async function GET() {
  try {
    const topicRes = await queryD1<{ count: number }>("SELECT COUNT(*) as count FROM topics");
    const questionRes = await queryD1<{ count: number }>("SELECT COUNT(*) as count FROM questions");
    const articleRes = await queryD1<{ count: number }>("SELECT COUNT(*) as count FROM articles");

    if (topicRes.length > 0 && questionRes.length > 0) {
      return NextResponse.json({
        totalTopics: topicRes[0].count,
        totalQuestions: questionRes[0].count,
        totalArticles: articleRes[0]?.count || 0,
      });
    }
  } catch (err) {
    console.warn("D1 stats fallback:", err);
  }

  // Fallback to local files
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
