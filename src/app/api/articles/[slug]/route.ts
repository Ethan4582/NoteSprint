import { NextResponse } from "next/server";
import { getMarkdownContent, getMarkdownFiles } from "@/src/lib/markdown";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  let content = await getMarkdownContent("lld", slug);
  let category = "lld";

  if (!content) {
    content = await getMarkdownContent("hld", slug);
    category = "hld";
  }

  if (!content) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }

  const files = await getMarkdownFiles(category as "lld" | "hld");
  const meta = files.find((f) => f.slug === slug);

  return NextResponse.json({
    id: 1,
    slug,
    title: meta?.title || slug.replace(/_/g, " "),
    content,
    category,
    readingTime: meta?.readingTime || 5,
    difficulty: meta?.difficulty || "Medium",
    tags: JSON.stringify(meta?.tags || []),
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}
