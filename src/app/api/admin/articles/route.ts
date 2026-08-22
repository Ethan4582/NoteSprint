import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    return NextResponse.json({
      id: Date.now(),
      slug: body.slug,
      title: body.title,
      content: body.content,
      category: body.category || "lld",
      readingTime: body.readingTime || 5,
      difficulty: body.difficulty || "Medium",
      tags: body.tags || "[]",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
