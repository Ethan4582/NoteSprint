"use client";

import { FileCode } from "lucide-react";

const ICON_EXTENSIONS: Record<string, string> = {
  "react_dark": "svg",
  "nextjs_icon_dark": "svg",
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
  "websocket_": "png"
};

export function getTechIcon(topic: string, subject?: string) {
  const ext = ICON_EXTENSIONS[topic];
  
  if (ext) {
    const isSvg = ext === "svg";
    const invertClass = topic === "nextjs_icon_dark" ? "invert dark:invert-0" : "";
    
    return (
      <img 
        src={`/icon/${topic}.${ext}`} 
        className={`w-8 h-8 object-contain ${invertClass}`} 
        alt={topic} 
      />
    );
  }

  return <FileCode className="w-6 h-6 text-[var(--accent)]" />;
}
