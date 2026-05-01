"use client";

import { Monitor, Database, Cpu, FolderOpen, Network, Layers, FileCode, Server, Terminal, Zap } from "lucide-react";

export function getTechIcon(topic: string, subject: string) {
  const t = topic.toLowerCase();
  const s = subject.toLowerCase();

  // High-Quality Local Icons
  if (t.includes("react")) return <img src="/icon/react_dark.svg" className="w-8 h-8" alt="React" />;
  if (t.includes("next")) return <img src="/icon/nextjs_icon_dark.svg" className="w-8 h-8 invert dark:invert-0" alt="Next.js" />;
  if (t.includes("typescript")) return <img src="/icon/typescript.webp" className="w-7 h-7 rounded-[4px]" alt="TypeScript" />;

  // Lucide Fallbacks with better styling
  if (t.includes("node")) return <Server className="w-6 h-6 text-green-500" />;
  if (t.includes("mongo")) return <Database className="w-6 h-6 text-green-600" />;
  if (t.includes("postgres")) return <Database className="w-6 h-6 text-blue-400" />;
  if (t.includes("express")) return <Terminal className="w-6 h-6 text-orange-400" />;
  if (t.includes("operating systems")) return <Monitor className="w-6 h-6 text-blue-500" />;
  if (t.includes("computer networks")) return <Network className="w-6 h-6 text-cyan-500" />;
  if (t.includes("system design")) return <Layers className="w-6 h-6 text-indigo-500" />;

  // Subject Fallbacks
  if (s.includes("frontend")) return <Monitor className="w-6 h-6 text-blue-400" />;
  if (s.includes("backend")) return <Server className="w-6 h-6 text-indigo-400" />;
  
  return <FileCode className="w-6 h-6 text-[var(--accent)]" />;
}
