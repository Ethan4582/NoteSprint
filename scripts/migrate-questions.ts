import fs from "fs";
import path from "path";
import { DATA } from "../src/lib/data";

interface RawQuestion {
  id?: number;
  question?: string;
  answer?: string;
  image?: string;
  image2?: string;
  code?: string;
  [key: string]: unknown;
}

const TOPIC_METADATA: Record<string, { name: string; category: string }> = {
  nodejs: { name: "Node.js", category: "backend" },
  express: { name: "Express.js", category: "backend" },
  mongodb: { name: "MongoDB", category: "backend" },
  postgresql: { name: "PostgreSQL", category: "backend" },
  aws_: { name: "AWS", category: "backend" },
  azure_: { name: "Azure", category: "backend" },
  drizzle_: { name: "Drizzle ORM", category: "backend" },
  fastapi_: { name: "FastAPI", category: "backend" },
  graphql_: { name: "GraphQL", category: "backend" },
  grpc_: { name: "gRPC", category: "backend" },
  hono_: { name: "Hono", category: "backend" },
  langchain_: { name: "LangChain", category: "backend" },
  langgraph_: { name: "LangGraph", category: "backend" },
  prisma: { name: "Prisma", category: "backend" },
  python: { name: "Python", category: "backend" },
  redis: { name: "Redis", category: "backend" },
  socketio_: { name: "Socket.io", category: "backend" },
  websocket_: { name: "WebSocket", category: "backend" },
  docker: { name: "Docker", category: "backend" },
  typescript: { name: "TypeScript", category: "frontend" },
  redux: { name: "Redux", category: "frontend" },
  javascript: { name: "JavaScript", category: "frontend" },
  playwright_: { name: "Playwright", category: "frontend" },
  testing: { name: "Testing", category: "frontend" },
  nextjs: { name: "Next.js", category: "frontend" },
  react: { name: "React", category: "frontend" },
  operating_systeam: { name: "Operating System", category: "cs_fundamentals" },
  computer_network: { name: "Computer Network", category: "cs_fundamentals" },
  "c++": { name: "C++", category: "cs_fundamentals" },
  database_management: { name: "Database Management", category: "cs_fundamentals" },
  oops: { name: "OOPs", category: "cs_fundamentals" },
  sql: { name: "SQL", category: "cs_fundamentals" },
  lld: { name: "Low Level Design", category: "system_design" },
  hld: { name: "High Level Design", category: "system_design" },
  interview_ai: { name: "AI Interview", category: "interview" },
  interview_backend: { name: "Backend Interview", category: "interview" },
  interview_frontend: { name: "Frontend Interview", category: "interview" },
  interview_hr: { name: "HR Interview", category: "interview" },
};

function escapeSql(str: string): string {
  return str.replace(/'/g, "''");
}

function extractQuestions(data: unknown): RawQuestion[] {
  if (Array.isArray(data)) {
    return data as RawQuestion[];
  }
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    const list: RawQuestion[] = [];
    for (const key of Object.keys(obj)) {
      const val = obj[key];
      if (Array.isArray(val)) {
        list.push(...(val as RawQuestion[]));
      }
    }
    return list;
  }
  return [];
}

async function migrateQuestions() {
  const statements: string[] = [];
  let totalTopics = 0;
  let totalQuestions = 0;

  for (const slug of Object.keys(DATA)) {
    const meta = TOPIC_METADATA[slug] || {
      name: slug.replace(/_/g, " ").toUpperCase(),
      category: "backend",
    };
    totalTopics++;

    statements.push(
      `INSERT OR IGNORE INTO topics (slug, name, category) VALUES ('${escapeSql(slug)}', '${escapeSql(meta.name)}', '${escapeSql(meta.category)}');`
    );

    const questionsList = extractQuestions(DATA[slug]);

    for (const q of questionsList) {
      if (!q || !q.question) continue;
      totalQuestions++;
      const questionText = q.question;
      let answerText = q.answer || "";
      if (q.code) {
        answerText += `\n\`\`\`\n${q.code}\n\`\`\``;
      }
      const image = q.image || q.image2 || null;
      const imageUrlSql = image ? `'${escapeSql(image)}'` : "NULL";

      statements.push(
        `INSERT INTO questions (topic_id, question, answer, image_url, source_file) SELECT id, '${escapeSql(questionText)}', '${escapeSql(answerText)}', ${imageUrlSql}, '${escapeSql(slug)}' FROM topics WHERE slug = '${escapeSql(slug)}';`
      );
    }
  }

  const outDir = path.join(process.cwd(), "drizzle");
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const sqlContent = statements.join("\n");
  const sqlFile = path.join(outDir, "seed-questions.sql");
  fs.writeFileSync(sqlFile, sqlContent, "utf-8");

  console.log(`Generated SQL for ${totalTopics} topics and ${totalQuestions} questions at: ${sqlFile}`);
}

migrateQuestions();
