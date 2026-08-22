import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

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
      const sanitizedTitle = (body.title || "").replace(/'/g, "''");
      const sanitizedContent = (body.content || "").replace(/'/g, "''");
      const sanitizedCategory = (body.category || "lld").replace(/'/g, "''");
      const tagsJson = (typeof body.tags === "string" ? body.tags : JSON.stringify(body.tags || [])).replace(/'/g, "''");
      const sql = `INSERT INTO articles (slug, title, content, category, reading_time, difficulty, tags) VALUES ('${slug}', '${sanitizedTitle}', '${sanitizedContent}', '${sanitizedCategory}', ${Number(body.readingTime) || 5}, '${body.difficulty || "Medium"}', '${tagsJson}');`;
      
      await execAsync(`npx wrangler d1 execute notes-db --remote --command "${sql.replace(/"/g, '\\"')}"`).catch(() => {});
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
