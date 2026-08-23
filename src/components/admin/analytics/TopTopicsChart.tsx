"use client";

import { FolderGit2, Trophy, Flame } from "lucide-react";
import type { TopTopic } from "./types";
import { cn } from "@/src/lib/utils";

export default function TopTopicsChart({
  topics,
}: {
  topics: TopTopic[];
}) {
  const totalQuestions = topics.reduce((acc, t) => acc + t.visitors, 0);

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-5 shadow-sm flex flex-col space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-sm">
            <FolderGit2 className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-black tracking-tight text-[var(--text-primary)]">
              Content Library by Topic
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              Question distribution across modules
            </p>
          </div>
        </div>

        <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg bg-[var(--bg-subtle)] text-[var(--text-secondary)] border border-[var(--border)]">
          {totalQuestions} Total Qs
        </span>
      </div>

      {/* Topics Leaderboard Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {topics.map((topic, idx) => {
          const rank = idx + 1;
          const isTop = rank === 1;
          const share = totalQuestions > 0 ? Math.round((topic.visitors / totalQuestions) * 100) : topic.percentage;

          return (
            <div
              key={topic.slug}
              className={cn(
                "relative flex items-center justify-between p-3 rounded-xl border transition-all duration-200 group",
                isTop
                  ? "sm:col-span-2 bg-gradient-to-r from-amber-500/10 via-[var(--bg-surface)] to-[var(--bg-surface)] border-amber-500/30 shadow-sm"
                  : "bg-[var(--bg-surface)]/60 hover:bg-[var(--bg-surface)] border-[var(--border)] hover:border-[var(--border-strong)]"
              )}
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Rank indicator */}
                <div
                  className={cn(
                    "w-6 h-6 rounded-lg flex items-center justify-center font-mono text-xs font-black shrink-0 border",
                    rank === 1
                      ? "bg-amber-500/20 border-amber-500/40 text-amber-400"
                      : rank === 2
                      ? "bg-slate-500/20 border-slate-400/40 text-slate-300"
                      : rank === 3
                      ? "bg-amber-700/20 border-amber-600/40 text-amber-600"
                      : "bg-[var(--bg-subtle)] border-[var(--border)] text-[var(--text-muted)]"
                  )}
                >
                  {rank === 1 ? <Trophy className="h-3.5 w-3.5 text-amber-400" /> : rank}
                </div>

                {/* Topic icon */}
                <div className="h-7 w-7 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border)] flex items-center justify-center p-1 shrink-0 overflow-hidden shadow-xs">
                  <img
                    src={topic.iconPath}
                    alt={topic.name}
                    className="h-full w-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                </div>

                {/* Topic Title */}
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-[var(--text-primary)] truncate group-hover:text-[var(--accent)] transition-colors">
                      {topic.name}
                    </span>
                    {isTop && (
                      <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-0.5">
                        <Flame className="h-2.5 w-2.5" /> Top
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Stat badges */}
              <div className="flex items-center gap-1.5 shrink-0 font-mono pl-2">
                <span className="text-xs font-black text-[var(--text-primary)]">
                  {topic.visitors.toLocaleString()} <span className="text-[10px] font-medium text-[var(--text-muted)]">Qs</span>
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[var(--bg-subtle)] text-[var(--text-secondary)] border border-[var(--border)]">
                  {share}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
