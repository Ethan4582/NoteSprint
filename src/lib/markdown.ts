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

export async function getMarkdownFiles(type: "lld" | "hld"): Promise<MarkdownMeta[]> {
  const dirPath = path.join(mockDir, type);
  if (!fs.existsSync(dirPath)) return [];

  const files = fs.readdirSync(dirPath);
  const mds = files.filter(f => f.endsWith('.md'));

  // Load manual metadata
  let metadata: Record<string, Partial<MarkdownMeta>> = {};
  const metaPath = path.join(mockDir, `${type}_metadata.json`);
  if (fs.existsSync(metaPath)) {
    try {
      metadata = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
    } catch (e) {
      console.error(`Failed to parse ${type}_metadata.json`, e);
    }
  }

  const results: MarkdownMeta[] = mds.map(file => {
    const slug = file.replace(/\.md$/, "");
    const filePath = path.join(dirPath, file);
    const content = fs.readFileSync(filePath, "utf-8");

    // Extract title (first line starting with # )
    const titleMatch = content.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1].trim() : slug.replace(/_/g, " ");

    // Extract description (first paragraph after the title)
    // We'll split by double newline, filter out empty/heading/table/list lines
    const paragraphs = content.split(/\n\s*\n/).filter(p => {
      const trimmed = p.trim();
      return trimmed && !trimmed.startsWith("#") && !trimmed.startsWith("|") && !trimmed.startsWith("-") && !trimmed.startsWith(">");
    });
    
    // First paragraph (might contain markdown formatting, we'll just return raw string, optionally trim it)
    let description = paragraphs.length > 0 ? paragraphs[0].trim() : "No description available.";
    
    // Fallback if description is too long
    if (description.length > 150) {
      description = description.substring(0, 147) + "...";
    }

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

  return results;
}

export async function getMarkdownContent(type: "lld" | "hld", slug: string): Promise<string | null> {
  const filePath = path.join(mockDir, type, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  return fs.readFileSync(filePath, "utf-8");
}
