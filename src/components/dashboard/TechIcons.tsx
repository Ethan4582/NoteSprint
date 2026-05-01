"use client";

import { FileCode } from "lucide-react";

const ICON_EXTENSIONS: Record<string, string> = {
  "react": "svg",
  "nextjs": "svg",
  "typescript": "webp",
  "aws_": "png",
  "azure_": "png",
  "c++": "png",
  "computer_network": "png",
  "database_management": "png",
  "drizzle_": "png",
  "express": "png",
  "fastapi_": "png",
  "graphql_": "png",
  "grpc_": "png",
  "hono_": "png",
  "javascript": "png",
  "langchain_": "png",
  "langgraph_": "png",
  "mongodb": "png",
  "nodejs": "png",
  "oops": "png",
  "operating_systeam": "png",
  "playwright_": "png",
  "postgresql": "png",
  "prisma": "png",
  "python": "png",
  "redis": "png",
  "redux": "png",
  "socketio_": "png",
  "sql": "png",
  "testing": "png",
  "websocket_": "png",
  "lld": "png",
  "hld": "png"
};

export function getTechIcon(topic: string, subject?: string) {
  const ext = ICON_EXTENSIONS[topic];

  if (ext) {
    const lightInvertList = ["langchain_", "prisma", "langgraph_", "drizzle_", "socketio_", "sql", "nextjs", "websocket_", "redux", "lld", "hld"];
    const invertClass = lightInvertList.includes(topic) ? "invert dark:invert-0" : "";

    // Handle underscore override for specific files like react_.svg
    const fileName = topic === "react" ? "react_" : topic;

    return (
      <img
        src={`/icon/${fileName}.${ext}`}
        className={`w-8 h-8 object-contain ${invertClass}`}
        alt={topic}
      />
    );
  }

  return <FileCode className="w-6 h-6 text-[var(--accent)]" />;
}
