import { NextResponse } from "next/server";
import { updateQuestion, deleteQuestion } from "@/src/db";

export const dynamic = "force-dynamic";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const numId = parseInt(id, 10);
    if (isNaN(numId)) {
      return NextResponse.json({ error: "Invalid question id" }, { status: 400 });
    }

    const updated = await updateQuestion(numId, {
      topicId: body.topicId ? Number(body.topicId) : undefined,
      question: body.question,
      answer: body.answer,
      imageUrl: body.imageUrl !== undefined ? body.imageUrl : undefined,
    });

    if (!updated || updated.length === 0) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    return NextResponse.json(updated[0]);
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
    if (isNaN(numId)) {
      return NextResponse.json({ error: "Invalid question id" }, { status: 400 });
    }

    const deleted = await deleteQuestion(numId);
    if (!deleted || deleted.length === 0) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, deleted: deleted[0] });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
