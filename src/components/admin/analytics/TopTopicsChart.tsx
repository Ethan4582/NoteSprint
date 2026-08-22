"use client";

import Image from "next/image";
import { FolderGit2 } from "lucide-react";
import type { TopTopic } from "./types";

export default function TopTopicsChart({
  topics,
}: {
  topics: TopTopic[];
}) {
  return (
    <div className="rounded-2xl border border-[var(--border-strong)] bg-raised p-5 shadow-raised-crisp space-y-4 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500 border border-purple-500/20">
            <FolderGit2 className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-black tracking-tight text-[var(--text-primary)]">
              Top Studied Topics
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              Most visited study categories & roadmaps
            </p>
          </div>
        </div>
      </div>

      {/* Topics List with Local Logos and Progress Bars */}
      <div className="space-y-3.5 py-1">
        {topics.map((topic) => (
          <div key={topic.slug} className="space-y-1.5 group">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="h-6 w-6 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border)] flex items-center justify-center p-1 shrink-0 overflow-hidden">
                  <img
                    src={topic.iconPath}
                    alt={topic.name}
                    className="h-full w-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                </div>
                <span className="font-bold text-[var(--text-primary)] truncate">
                  {topic.name}
                </span>
              </div>
              <span className="font-mono font-bold text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors">
                {topic.visitors.toLocaleString()}
              </span>
            </div>

            {/* Custom rounded progress bar */}
            <div className="h-2 w-full rounded-full bg-[var(--bg-subtle)] overflow-hidden border border-[var(--border)]">
              <div
                className="h-full rounded-full bg-[var(--accent)] transition-all duration-500 group-hover:brightness-110"
                style={{ width: `${topic.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
