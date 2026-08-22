import { NextResponse } from "next/server";
import { getAllTopics } from "@/src/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const d1Topics = await getAllTopics();
    return NextResponse.json(d1Topics || []);
  } catch (e) {
    console.error("D1 topics query error:", e);
    return NextResponse.json([], { status: 500 });
  }
}
