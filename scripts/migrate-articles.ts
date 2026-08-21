import fs from "fs";
import path from "path";

interface ArticleMeta {
  difficulty?: "Easy" | "Medium" | "Hard" | "High";
  readingTime?: number;
  tags?: string[];
}

function escapeSql(str: string): string {
  return str.replace(/'/g, "''");
}

function generateDifficulty(content: string): "Easy" | "Medium" | "Hard" {
  const length = content.length;
  if (length < 2000) return "Easy";
  if (length > 8000) return "Hard";
  return "Medium";
}

async function migrateArticles() {
  const mockDir = path.join(process.cwd(), "src/data/mock");
  const categories = ["lld", "hld"] as const;
  const statements: string[] = [];
  let totalArticles = 0;

  for (const category of categories) {
    const dirPath = path.join(mockDir, category);
    if (!fs.existsSync(dirPath)) continue;

    let metadataMap: Record<string, ArticleMeta> = {};
    const metaPath = path.join(mockDir, `${category}_metadata.json`);
    if (fs.existsSync(metaPath)) {
      try {
        metadataMap = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
      } catch (err) {
        console.error(`Failed to parse ${category}_metadata.json:`, err);
      }
    }

    const files = fs.readdirSync(dirPath).filter((f) => f.endsWith(".md"));

    for (const file of files) {
      const rawSlug = file.replace(/\.md$/, "");
      const slug = rawSlug.toLowerCase().replace(/_/g, "-");
      const filePath = path.join(dirPath, file);
      const content = fs.readFileSync(filePath, "utf-8");

      const titleMatch = content.match(/^#\s+(.+)$/m);
      const title = titleMatch ? titleMatch[1].trim() : rawSlug.replace(/_/g, " ");

      const meta = metadataMap[rawSlug] || {};
      const wordCount = content.split(/\s+/).length;
      const readingTime = meta.readingTime || Math.max(1, Math.ceil(wordCount / 200));
      const difficulty = meta.difficulty === "High" ? "Hard" : (meta.difficulty || generateDifficulty(content));
      const tags = meta.tags ? JSON.stringify(meta.tags) : JSON.stringify([]);

      statements.push(
        `INSERT OR REPLACE INTO articles (slug, title, content, category, reading_time, difficulty, tags) VALUES ('${escapeSql(slug)}', '${escapeSql(title)}', '${escapeSql(content)}', '${escapeSql(category)}', ${readingTime}, '${escapeSql(difficulty)}', '${escapeSql(tags)}');`
      );
      totalArticles++;
    }
  }

  const outDir = path.join(process.cwd(), "drizzle");
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const sqlFile = path.join(outDir, "seed-articles.sql");
  fs.writeFileSync(sqlFile, statements.join("\n"), "utf-8");
  console.log(`Generated SQL for ${totalArticles} articles at: ${sqlFile}`);
}

migrateArticles();
