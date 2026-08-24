import DashboardClient from "@/src/components/dashboard/DashboardClient";
import { getAllArticles, type Article } from "@/src/db";
import type { MarkdownMeta } from "@/src/lib/markdown";

export const revalidate = 3600;

export default async function LibraryPage() {
  let articles: Article[] = [];
  try {
    articles = (await getAllArticles()) || [];
  } catch (err) {
    console.warn("Error fetching articles for LibraryPage:", err);
  }

  const systemDocs: MarkdownMeta[] = articles.map((a) => {
    let tags: string[] = [];
    try {
      if (a.tags) {
        tags = Array.isArray(a.tags) ? a.tags : JSON.parse(a.tags);
      }
    } catch {
      tags = a.tags ? a.tags.split(",").map((t) => t.trim()) : [];
    }

    const firstPara = a.content
      ? a.content
          .split(/\n\s*\n/)
          .find((p) => p.trim() && !p.trim().startsWith("#"))
          ?.trim() || ""
      : "";

    return {
      slug: a.slug,
      title: a.title,
      description: firstPara.length > 150 ? firstPara.slice(0, 147) + "..." : firstPara || a.title,
      readingTime: a.readingTime || 5,
      difficulty: (a.difficulty as "Easy" | "Medium" | "Hard") || "Medium",
      tags,
      type: (a.category === "hld" ? "hld" : "lld") as "lld" | "hld",
    };
  });

  return <DashboardClient systemDocs={systemDocs} />;
}
