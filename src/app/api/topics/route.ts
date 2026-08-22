import { NextResponse } from "next/server";
import { DATA } from "@/src/lib/data";

export const dynamic = "force-static";

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

function countQuestions(topicData: unknown): number {
  if (Array.isArray(topicData)) return topicData.length;
  if (topicData && typeof topicData === "object") {
    const obj = topicData as Record<string, unknown[]>;
    return Object.values(obj).reduce((acc, arr) => acc + (Array.isArray(arr) ? arr.length : 0), 0);
  }
  return 0;
}

export async function GET() {
  let idCounter = 1;
  const topicsList = Object.keys(DATA).map((slug) => {
    const meta = TOPIC_METADATA[slug] || {
      name: slug.replace(/_/g, " ").toUpperCase(),
      category: "backend",
    };
    const count = countQuestions(DATA[slug]);
    return {
      id: idCounter++,
      slug,
      name: meta.name,
      category: meta.category,
      createdAt: new Date(),
      questionCount: count,
    };
  });

  topicsList.sort((a, b) => a.name.localeCompare(b.name));
  return NextResponse.json(topicsList);
}
