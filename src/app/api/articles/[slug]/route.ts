import { NextResponse } from "next/server";
import { getArticleBySlug } from "@/src/db";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const article = await getArticleBySlug(slug);
    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }
    return NextResponse.json(article);
  } catch (err) {
    console.error("Failed to fetch article by slug:", err);
    return NextResponse.json({ error: "Failed to fetch article" }, { status: 500 });
  }
}
