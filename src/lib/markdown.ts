"use server";

import fs from "fs";
import path from "path";

export interface MarkdownMeta {
  slug: string;
  title: string;
  description: string;
  readingTime: number;
  difficulty: "Easy" | "Medium" | "Hard";
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
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));
    
    const difficulty = generateDifficulty(content);

    return {
      slug,
      title,
      description,
      readingTime,
      difficulty,
    };
  });

  return results;
}

export async function getMarkdownContent(type: "lld" | "hld", slug: string): Promise<string | null> {
  const filePath = path.join(mockDir, type, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  return fs.readFileSync(filePath, "utf-8");
}
