import { NextResponse } from "next/server";
import { insertArticle } from "@/src/db";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as any;
    const category = body.category || "lld";
    const slug = (body.slug || "new-article")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const tagsJson = typeof body.tags === "string" ? body.tags : JSON.stringify(body.tags || []);
    const result = await insertArticle({
      slug,
      title: body.title || slug,
      content: body.content || "",
      category,
      readingTime: Number(body.readingTime) || 5,
      difficulty: body.difficulty || "Medium",
      tags: tagsJson,
    });

    return NextResponse.json(result[0] || {
      slug,
      title: body.title,
      content: body.content,
      category,
      readingTime: body.readingTime || 5,
      difficulty: body.difficulty || "Medium",
      tags: tagsJson,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
