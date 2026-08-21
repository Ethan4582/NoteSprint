import fs from "fs";
import path from "path";

export interface MarkdownMeta {
  slug: string;
  title: string;
  description: string;
  readingTime: number;
  difficulty: "Easy" | "Medium" | "Hard";
  tags?: string[];
  type?: "lld" | "hld";
}

const mockDir = path.join(process.cwd(), "src/data/mock");

function generateDifficulty(content: string): "Easy" | "Medium" | "Hard" {
  const length = content.length;
  if (length < 2000) return "Easy";
  if (length > 8000) return "Hard";
  return "Medium";
}

function extractDescription(content: string): string {
  const paragraphs = content.split(/\n\s*\n/).filter((p) => {
    const trimmed = p.trim();
    return (
      trimmed &&
      !trimmed.startsWith("#") &&
      !trimmed.startsWith("|") &&
      !trimmed.startsWith("-") &&
      !trimmed.startsWith(">")
    );
  });
  let desc = paragraphs.length > 0 ? paragraphs[0].trim() : "No description available.";
  if (desc.length > 150) {
    desc = desc.substring(0, 147) + "...";
  }
  return desc;
}

export async function getMarkdownFiles(type: "lld" | "hld"): Promise<MarkdownMeta[]> {
  const dirPath = path.join(mockDir, type);
  if (!fs.existsSync(dirPath)) return [];

  const files = fs.readdirSync(dirPath);
  const mds = files.filter((f) => f.endsWith(".md"));

  let metadata: Record<string, Partial<MarkdownMeta>> = {};
  const metaPath = path.join(mockDir, `${type}_metadata.json`);
  if (fs.existsSync(metaPath)) {
    try {
      metadata = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
    } catch {
      // ignore
    }
  }

  return mds.map((file) => {
    const slug = file.replace(/\.md$/, "");
    const filePath = path.join(dirPath, file);
    const content = fs.readFileSync(filePath, "utf-8");

    const titleMatch = content.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1].trim() : slug.replace(/_/g, " ");
    const description = extractDescription(content);
    const wordCount = content.split(/\s+/).length;
    const fallbackReadingTime = Math.max(1, Math.ceil(wordCount / 200));
    const fallbackDifficulty = generateDifficulty(content);
    const fileMeta = metadata[slug] || {};

    return {
      slug,
      title,
      description,
      readingTime: fileMeta.readingTime || fallbackReadingTime,
      difficulty: fileMeta.difficulty || fallbackDifficulty,
      tags: fileMeta.tags || [],
      type,
    };
  });
}

export async function getMarkdownContent(type: "lld" | "hld", slug: string): Promise<string | null> {
  const filePath = path.join(mockDir, type, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  return fs.readFileSync(filePath, "utf-8");
}
