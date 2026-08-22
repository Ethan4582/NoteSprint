import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await req.json();
    return NextResponse.json({
      slug,
      title: body.title,
      content: body.content,
      category: body.category || "lld",
      readingTime: body.readingTime || 5,
      difficulty: body.difficulty || "Medium",
      tags: body.tags || "[]",
      updatedAt: new Date(),
    });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  return NextResponse.json({ success: true, slug });
}
