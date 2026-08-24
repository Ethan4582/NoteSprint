import { NextResponse } from "next/server";
import { updateArticle, deleteArticle } from "@/src/db";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = (await req.json()) as any;
    const tagsJson = typeof body.tags === "string" ? body.tags : JSON.stringify(body.tags || []);

    const updated = await updateArticle(slug, {
      title: body.title,
      content: body.content,
      category: body.category || "lld",
      readingTime: body.readingTime ? Number(body.readingTime) : undefined,
      difficulty: body.difficulty,
      tags: tagsJson,
    });

    if (!updated || updated.length === 0) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json(updated[0]);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const deleted = await deleteArticle(slug);

    if (!deleted || deleted.length === 0) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, deleted: deleted[0] });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
