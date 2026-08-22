import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { insertArticle } from "@/src/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const category = body.category || "lld";
    const slug = (body.slug || "new-article")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const dir = path.join(process.cwd(), "src/data/mock", category);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const filePath = path.join(dir, `${slug}.md`);
    fs.writeFileSync(filePath, body.content, "utf-8");

    const metaPath = path.join(process.cwd(), "src/data/mock", `${category}_metadata.json`);
    let metaRecord: Record<string, unknown> = {};
    if (fs.existsSync(metaPath)) {
      try {
        metaRecord = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
      } catch {
        metaRecord = {};
      }
    }

    metaRecord[slug] = {
      title: body.title,
      readingTime: body.readingTime || 5,
      difficulty: body.difficulty || "Medium",
      tags: typeof body.tags === "string" ? JSON.parse(body.tags || "[]") : body.tags || [],
    };
    fs.writeFileSync(metaPath, JSON.stringify(metaRecord, null, 2), "utf-8");

    try {
      const tagsJson = typeof body.tags === "string" ? body.tags : JSON.stringify(body.tags || []);
      await insertArticle({
        slug,
        title: body.title || slug,
        content: body.content || "",
        category,
        readingTime: Number(body.readingTime) || 5,
        difficulty: body.difficulty || "Medium",
        tags: tagsJson,
      });
    } catch {
      // ignore
    }

    return NextResponse.json({
      id: Date.now(),
      slug,
      title: body.title,
      content: body.content,
      category,
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
