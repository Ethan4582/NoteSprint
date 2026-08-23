import { NextResponse } from "next/server";
import { getAllTopics } from "@/src/db";

export const runtime = "edge";
export const revalidate = 3600;

export async function GET() {
  try {
    const d1Topics = await getAllTopics();
    return NextResponse.json(d1Topics || [], {
      headers: {
        "Cache-Control": "public, max-age=60, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (e) {
    console.error("D1 topics query error:", e);
    return NextResponse.json([], { status: 500 });
  }
}
