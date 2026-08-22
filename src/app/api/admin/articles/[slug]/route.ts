import { NextResponse } from "next/server";
import { getMarkdownFiles } from "@/src/lib/markdown";
import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export const dynamic = "force-static";

export async function generateStaticParams() {
  const lld = await getMarkdownFiles("lld");
  const hld = await getMarkdownFiles("hld");
  const all = [...lld, ...hld].map((a) => ({ slug: a.slug }));
  return all.length > 0 ? all : [{ slug: "music-leaderboard-system-design" }];
}

function findArticleFile(category: string, targetSlug: string): string | null {
  const dir = path.join(process.cwd(), "src/data/mock", category);
  if (!fs.existsSync(dir)) return null;

  const files = fs.readdirSync(dir);
  const normalizedTarget = targetSlug.toLowerCase().replace(/[-_]/g, "");

  for (const f of files) {
    if (!f.endsWith(".md")) continue;
    const base = f.replace(/\.md$/, "");
    if (base === targetSlug || base.toLowerCase().replace(/[-_]/g, "") === normalizedTarget) {
      return path.join(dir, f);
    }
  }

  // Also check the other category as fallback
  const altCategory = category === "lld" ? "hld" : "lld";
  const altDir = path.join(process.cwd(), "src/data/mock", altCategory);
  if (fs.existsSync(altDir)) {
    const altFiles = fs.readdirSync(altDir);
    for (const f of altFiles) {
      if (!f.endsWith(".md")) continue;
      const base = f.replace(/\.md$/, "");
      if (base === targetSlug || base.toLowerCase().replace(/[-_]/g, "") === normalizedTarget) {
        return path.join(altDir, f);
      }
    }
  }

  return null;
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await req.json();
    const category = body.category || "lld";

    let targetFile = findArticleFile(category, slug);
    if (!targetFile) {
      targetFile = path.join(process.cwd(), "src/data/mock", category, `${slug}.md`);
    }

    // 1. Write to local Markdown file
    fs.writeFileSync(targetFile, body.content, "utf-8");

    // 2. Update local metadata json
    const metaPath = path.join(process.cwd(), "src/data/mock", `${category}_metadata.json`);
    let metaRecord: Record<string, unknown> = {};
    if (fs.existsSync(metaPath)) {
      try {
        metaRecord = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
      } catch {
        metaRecord = {};
      }
    }

    const fileKey = path.basename(targetFile, ".md");
    metaRecord[fileKey] = {
      title: body.title,
      readingTime: body.readingTime || 5,
      difficulty: body.difficulty || "Medium",
      tags: typeof body.tags === "string" ? JSON.parse(body.tags || "[]") : body.tags || [],
    };
    fs.writeFileSync(metaPath, JSON.stringify(metaRecord, null, 2), "utf-8");

    // 3. Sync to remote D1 asynchronously
    try {
      const sanitizedTitle = (body.title || "").replace(/'/g, "''");
      const sanitizedContent = (body.content || "").replace(/'/g, "''");
      const sanitizedCategory = (body.category || "lld").replace(/'/g, "''");
      const tagsJson = (typeof body.tags === "string" ? body.tags : JSON.stringify(body.tags || [])).replace(/'/g, "''");
      const sql = `UPDATE articles SET title = '${sanitizedTitle}', content = '${sanitizedContent}', category = '${sanitizedCategory}', reading_time = ${Number(body.readingTime) || 5}, difficulty = '${body.difficulty || "Medium"}', tags = '${tagsJson}', updated_at = CURRENT_TIMESTAMP WHERE slug = '${slug}' OR slug = '${fileKey}';`;
      
      await execAsync(`npx wrangler d1 execute notes-db --remote --command "${sql.replace(/"/g, '\\"')}"`).catch(() => {});
    } catch {
      // ignore d1 sync failure during offline
    }

    return NextResponse.json({
      slug: fileKey,
      title: body.title,
      content: body.content,
      category,
      readingTime: body.readingTime || 5,
      difficulty: body.difficulty || "Medium",
      tags: body.tags || "[]",
      updatedAt: new Date(),
    });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const lldFile = findArticleFile("lld", slug);
    const hldFile = findArticleFile("hld", slug);
    const targetFile = lldFile || hldFile;

    if (targetFile && fs.existsSync(targetFile)) {
      fs.unlinkSync(targetFile);
    }

    try {
      await execAsync(`npx wrangler d1 execute notes-db --remote --command "DELETE FROM articles WHERE slug = '${slug}';"`);
    } catch {
      // ignore
    }

    return NextResponse.json({ success: true, slug });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
