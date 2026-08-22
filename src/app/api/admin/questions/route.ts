import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    return NextResponse.json({
      id: Date.now(),
      topicId: body.topicId || 1,
      question: body.question,
      answer: body.answer,
      imageUrl: body.imageUrl || null,
      sourceFile: body.sourceFile || "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
