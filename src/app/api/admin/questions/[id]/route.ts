import { NextResponse } from "next/server";

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
    return NextResponse.json({
      id: parseInt(id, 10),
      topicId: body.topicId || 1,
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
  const { id } = await params;
  return NextResponse.json({ success: true, id });
}
