import { NextResponse } from "next/server";
import { getAllArticles } from "@/src/db";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || undefined;
    const articles = await getAllArticles(category);
    return NextResponse.json(articles || []);
  } catch (err) {
    console.error("Failed to fetch articles:", err);
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 });
  }
}
