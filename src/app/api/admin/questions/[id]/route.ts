import { NextResponse } from "next/server";
import { saveQuestionToSource } from "@/src/lib/question-persister";

export const dynamic = "force-static";

export function generateStaticParams() {
  const ids: { id: string }[] = [];
  for (let i = 1; i <= 250; i++) {
    ids.push({ id: String(i) });
  }
  return ids;
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const topicId = Number(body.topicId) || 1;
    const topicSlug = body.topicSlug || "interview_ai";
    const numId = parseInt(id, 10);

    await saveQuestionToSource(
      topicSlug,
      numId,
      body.question || "",
      body.answer || "",
      body.imageUrl
    );

    return NextResponse.json({
      id: numId,
      topicId,
      topicSlug,
      question: body.question,
      answer: body.answer,
      imageUrl: body.imageUrl || null,
      updatedAt: new Date(),
    });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const numId = parseInt(id, 10);
    return NextResponse.json({ success: true, id: numId });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
