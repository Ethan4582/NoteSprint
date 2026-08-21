import { NextResponse } from "next/server";
import { getMarkdownFiles } from "@/src/lib/markdown";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");

  let lldFiles = await getMarkdownFiles("lld");
  let hldFiles = await getMarkdownFiles("hld");

  let all = [
    ...lldFiles.map((f, i) => ({
      id: i + 1,
      slug: f.slug,
      title: f.title,
      content: f.description,
      category: "lld",
      readingTime: f.readingTime,
      difficulty: f.difficulty,
      tags: JSON.stringify(f.tags || []),
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
    ...hldFiles.map((f, i) => ({
      id: lldFiles.length + i + 1,
      slug: f.slug,
      title: f.title,
      content: f.description,
      category: "hld",
      readingTime: f.readingTime,
      difficulty: f.difficulty,
      tags: JSON.stringify(f.tags || []),
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
  ];

  if (category && category !== "all") {
    all = all.filter((a) => a.category === category);
  }

  return NextResponse.json(all);
}
