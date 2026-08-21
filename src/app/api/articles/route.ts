import { NextResponse } from "next/server";
import { getMarkdownFiles } from "@/src/lib/markdown";

export const dynamic = "force-static";

export async function GET() {
  const lldFiles = await getMarkdownFiles("lld");
  const hldFiles = await getMarkdownFiles("hld");

  const all = [
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

  return NextResponse.json(all);
}
