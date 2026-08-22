import fs from "fs";
import path from "path";
import { DATA } from "./data";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

const TOPIC_FILE_MAP: Record<string, string> = {
  interview_ai: "src/data/interview/ai/ai.js",
  interview_backend: "src/data/interview/backend/backend.js",
  interview_frontend: "src/data/interview/frontend/frontend.js",
  interview_hr: "src/data/interview/hr-manger/hr-manger.js",
  operating_systeam: "src/data/cs_fundamentals/operating_systeam.js",
  computer_network: "src/data/cs_fundamentals/computer_network.js",
  "c++": "src/data/cs_fundamentals/c++.js",
  cpp: "src/data/cs_fundamentals/c++.js",
  database_management: "src/data/cs_fundamentals/database_management.js",
  oops: "src/data/cs_fundamentals/oops.js",
  sql: "src/data/cs_fundamentals/sql.js",
  react: "src/data/frontend/react.js",
  nextjs: "src/data/frontend/nextjs.js",
  typescript: "src/data/frontend/typescript.js",
  redux: "src/data/frontend/redux.js",
  javascript: "src/data/frontend/javascript.js",
  playwright_: "src/data/frontend/playwright_.js",
  testing: "src/data/frontend/testing.js",
  lld: "src/data/system_design/lld.js",
  hld: "src/data/system_design/hld.js",
};

export function getTopicFilePath(topicSlug: string): string {
  if (TOPIC_FILE_MAP[topicSlug]) {
    return path.join(process.cwd(), TOPIC_FILE_MAP[topicSlug]);
  }
  // Default to backend folder
  return path.join(process.cwd(), "src/data/backend", `${topicSlug}.js`);
}

interface QuestionItem {
  id: number;
  question: string;
  answer?: string;
  image?: string;
  image2?: string;
  code?: string;
  [key: string]: unknown;
}

export async function saveQuestionToSource(
  topicSlug: string,
  id: number,
  newQuestion: string,
  newAnswer: string,
  imageUrl?: string | null
): Promise<boolean> {
  // 1. Update in-memory DATA cache immediately for real-time reflection in active server
  if (DATA[topicSlug]) {
    const raw = DATA[topicSlug];
    if (Array.isArray(raw)) {
      const target = raw.find((q: QuestionItem, idx: number) => q.id === id || idx + 1 === id);
      if (target) {
        target.question = newQuestion;
        target.answer = newAnswer;
        if (imageUrl) target.image = imageUrl;
      }
    } else if (raw && typeof raw === "object") {
      for (const list of Object.values(raw as Record<string, QuestionItem[]>)) {
        if (Array.isArray(list)) {
          const target = list.find((q: QuestionItem, idx: number) => q.id === id || idx + 1 === id);
          if (target) {
            target.question = newQuestion;
            target.answer = newAnswer;
            if (imageUrl) target.image = imageUrl;
          }
        }
      }
    }
  }

  // 2. Persist to source JS file
  const filePath = getTopicFilePath(topicSlug);
  if (fs.existsSync(filePath)) {
    try {
      const fileContent = fs.readFileSync(filePath, "utf-8");

      // Extract array/export name
      const exportMatch = fileContent.match(/export\s+default\s+([a-zA-Z0-9_]+);?/);
      const varName = exportMatch ? exportMatch[1] : topicSlug.replace(/[^a-zA-Z0-9_]/g, "_");

      const raw = DATA[topicSlug];
      if (raw) {
        const jsonFormatted = JSON.stringify(raw, null, 2);
        const newFileContent = `const ${varName} = ${jsonFormatted};\n\nexport default ${varName};\n`;
        fs.writeFileSync(filePath, newFileContent, "utf-8");
      }
    } catch (err) {
      console.error(`Failed to write to file ${filePath}:`, err);
    }
  }

  // 3. Sync to Cloudflare D1 Remote
  try {
    const sanitizedQuestion = newQuestion.replace(/'/g, "''");
    const sanitizedAnswer = newAnswer.replace(/'/g, "''");
    const sql = `UPDATE questions SET question = '${sanitizedQuestion}', answer = '${sanitizedAnswer}', updated_at = CURRENT_TIMESTAMP WHERE (id = ${id} AND topic_id = (SELECT id FROM topics WHERE slug = '${topicSlug}')) OR (id = ${id});`;
    await execAsync(`npx wrangler d1 execute notes-db --remote --command "${sql.replace(/"/g, '\\"')}"`).catch(() => {});
  } catch {
    // ignore
  }

  return true;
}
