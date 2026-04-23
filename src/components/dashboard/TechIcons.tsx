"use client";

import { Monitor, Database, Cpu, FolderOpen, Network, Layers } from "lucide-react";

export function getTechIcon(topic: string, subject: string) {
  const t = topic.toLowerCase();
  const s = subject.toLowerCase();

  // Specific Tech Icons (SVGs)
  if (t.includes("react")) {
    return (
      <svg viewBox="-11.5 -10.23174 23 20.46348" className="w-6 h-6 fill-[#61dafb]">
        <circle cx="0" cy="0" r="2.05" fill="#61dafb" />
        <g stroke="#61dafb" strokeWidth="1" fill="none">
          <ellipse rx="11" ry="4.2" />
          <ellipse rx="11" ry="4.2" transform="rotate(60)" />
          <ellipse rx="11" ry="4.2" transform="rotate(120)" />
        </g>
      </svg>
    );
  }

  if (t.includes("next.js") || t.includes("nextjs")) {
    return (
      <svg viewBox="0 0 128 128" className="w-6 h-6 fill-[var(--text-primary)]">
        <path d="M64 0C28.7 0 0 28.7 0 64s28.7 64 64 64c11.2 0 21.7-2.9 30.8-7.9L48.4 55.4v33.3h-9.3V40.2h9.3l45.2 59c6.8-8.3 10.9-19 10.9-30.7C104.5 31.2 86.4 13.1 64 0z" />
        <path d="M99.6 40.2v19.9l-19.9-26.1c0-.1 0-.1.1-.1h19.8z" />
      </svg>
    );
  }

  if (t.includes("typescript")) {
    return (
      <svg viewBox="0 0 128 128" className="w-6 h-6 fill-[#3178c6]">
        <path d="M1.5 1.5h125v125H1.5z" />
        <path fill="#fff" d="M102.3 84.6l-5.6 3.1c-1.8-3.1-3.6-5.2-6.6-5.2-3.2 0-5.3 2.1-5.3 5.1 0 3.6 2.8 5.1 7.6 9.2 6.8 5.8 10.1 10.3 10.1 17.5 0 10.1-7.5 16.7-18.4 16.7-10 0-16.7-4.8-21.2-13.6l5.9-3.4c3.4 5.9 7.4 8.7 14.1 8.7 6.4 0 9.8-3.1 9.8-7.3 0-4.6-3.3-5.9-9.1-10.8-6.1-5.1-10.8-10.1-10.8-16.8 0-9.2 6.7-15.6 16.8-15.6 9.4 0 14.9 4.1 18.7 11.4zM53.5 119H29.1V40.4H11V20.2h60.6v20.2H53.5V119z" />
      </svg>
    );
  }

  if (t.includes("nodejs") || t.includes("node.js")) {
    return (
      <svg viewBox="0 0 128 128" className="w-6 h-6 fill-[#339933]">
        <path d="M117.4 33.6l-50-28.9c-2.1-1.2-4.7-1.2-6.8 0l-50 28.9c-2.1 1.2-3.4 3.4-3.4 5.8v57.7c0 2.4 1.3 4.6 3.4 5.8l50 28.9c2.1 1.2 4.7 1.2 6.8 0l50-28.9c2.1-1.2 3.4-3.4 3.4-5.8V39.4c0-2.4-1.3-4.6-3.4-5.8zM64 116.1l-43.3-25V41.1l43.3-25 43.3 25v50l-43.3 25z" />
      </svg>
    );
  }

  if (t.includes("mongodb")) {
    return (
      <svg viewBox="0 0 128 128" className="w-6 h-6 fill-[#47A248]">
        <path d="M85.8 59.3c-2.2-22.1-18.5-38.3-18.5-38.3s-1.1-1.1-3.3-1.1c-2.2 0-3.3 1.1-3.3 1.1s-16.3 16.2-18.5 38.3c-2.1 20.3 3.4 35.7 18.5 48.6 1.1.9 2.2 1.1 3.3 1.1 1.1 0 2.2-.2 3.3-1.1 15.1-12.9 20.6-28.3 18.5-48.6z" />
      </svg>
    );
  }

  if (t.includes("postgres") || t.includes("postgresql")) {
    return (
      <svg viewBox="0 0 128 128" className="w-6 h-6 fill-[#336791]">
        <path d="M125.4 61.6c-1.4-2.8-4.2-4.5-7.3-4.5h-5.2c-1.4-9.3-5.2-17.7-10.9-24.6 4.7-2.9 7.8-8.1 7.8-14 0-9.1-7.4-16.5-16.5-16.5-5.9 0-11.1 3.1-14 7.8-6.9-5.7-15.3-9.5-24.6-10.9v-5.2c0-3.1-1.7-5.9-4.5-7.3-2.8-1.4-6.1-1.1-8.6.8L12.5 14.5c-1.9 1.5-3 3.8-3 6.3V44c0 3.3 2 6.2 5.1 7.4l11.1 4.2c.4.1.8.2 1.2.2 1.1 0 2.2-.4 3.1-1.1l9.1-7.6c3.9 1.1 7.6 2.7 11.1 4.8-1.1 3.1-1.7 6.4-1.7 9.8 0 16 13 29 29 29s29-13 29-29c0-3.4-.6-6.7-1.7-9.8 4.2-2.5 8.7-4.4 13.5-5.5l1.6 1.3c.9.7 2 1.1 3.1 1.1.4 0 .8-.1 1.2-.2 3.1-1.2 5.1-4.1 5.1-7.4V20.8c0-2.5-1.1-4.8-3-6.3L125.4 1.5c1.1-.9 2.5-1.3 3.9-1.3s2.8.4 3.9 1.3l28.1 23c1.9 1.5 3 3.8 3 6.3v23.2c0 3.3-2 6.2-5.1 7.4-3.1 1.1-6.4-.1-8.5-2.6z" />
      </svg>
    );
  }

  // Fallbacks for Subjects
  if (s.includes("frontend")) return <Monitor className="w-6 h-6 text-blue-500" />;
  if (s.includes("backend")) return <Database className="w-6 h-6 text-orange-500" />;
  if (s.includes("cs fundamentals")) return <Cpu className="w-6 h-6 text-purple-500" />;
  if (s.includes("system design")) return <Layers className="w-6 h-6 text-indigo-500" />;
  if (t.includes("network")) return <Network className="w-6 h-6 text-cyan-500" />;
  
  return <FolderOpen className="w-6 h-6 text-green-500" />;
}
