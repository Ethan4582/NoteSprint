"use client";

import { TopicStats } from "@/src/lib/progress";
import { useRouter } from "next/navigation";
import { Play, Sparkles, Layers } from "lucide-react";

interface TopicPerformanceGridProps {
  topics: TopicStats[];
  searchQuery: string;
}

export default function TopicPerformanceGrid({ topics, searchQuery }: TopicPerformanceGridProps) {
  const router = useRouter();

  const filtered = topics.filter((t) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return t.name.toLowerCase().includes(q) || t.topic.toLowerCase().includes(q);
  });

  if (filtered.length === 0) {
    return (
      <div className="py-12 text-center bg-white rounded-[12px] border border-[var(--border)] p-6">
        <p className="text-xs text-[var(--text-muted)] font-medium">
          {searchQuery ? `No topics matching "${searchQuery}"` : "No topic data available yet."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {filtered.map((topic) => {
        const accuracyColor =
          topic.accuracy >= 80
            ? "text-emerald-600 bg-emerald-50 border-emerald-200"
            : topic.accuracy >= 60
            ? "text-amber-600 bg-amber-50 border-amber-200"
            : "text-rose-600 bg-rose-50 border-rose-200";

        return (
          <div
            key={topic.topic}
            className="p-4 rounded-[12px] bg-white border border-[var(--border)] hover:border-[var(--border-strong)] transition-all shadow-2xs space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="p-1.5 rounded-[8px] bg-[var(--bg-subtle)] border border-[var(--border)] text-[var(--text-secondary)] shrink-0">
                  {topic.isInterview ? <Sparkles size={14} /> : <Layers size={14} />}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-[var(--text-primary)] truncate">
                    {topic.name}
                  </h4>
                  <span className="text-[10px] font-mono text-[var(--text-muted)]">
                    {topic.isInterview ? "Interview Drill" : "Flashcard Deck"}
                  </span>
                </div>
              </div>
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-[6px] border ${accuracyColor} shrink-0`}
              >
                {topic.accuracy}%
              </span>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-1 py-1.5 border-y border-[var(--border)]/60 text-center">
              <div>
                <span className="text-[10px] text-[var(--text-muted)] block">Cards</span>
                <span className="text-xs font-bold text-[var(--text-primary)]">
                  {topic.cardsReviewed}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[var(--text-muted)] block">Correct</span>
                <span className="text-xs font-bold text-emerald-600">{topic.correct}</span>
              </div>
              <div>
                <span className="text-[10px] text-[var(--text-muted)] block">Sessions</span>
                <span className="text-xs font-bold text-[var(--text-primary)]">
                  {topic.sessionsCount}
                </span>
              </div>
            </div>

            {/* Launch Practice Drill */}
            <button
              onClick={() => {
                if (topic.isInterview) {
                  router.push(`/interview?topic=${topic.topic}`);
                } else {
                  router.push(`/session?topic=${topic.topic}&count=10&time=5&mode=flashcard`);
                }
              }}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-[8px] bg-[var(--bg-subtle)] hover:bg-[var(--accent)] hover:text-white border border-[var(--border)] hover:border-transparent text-xs font-bold text-[var(--text-secondary)] transition-all cursor-pointer"
            >
              <Play size={12} fill="currentColor" />
              <span>Practice Topic</span>
            </button>
          </div>
        );
      })}
    </div>
  );
}
