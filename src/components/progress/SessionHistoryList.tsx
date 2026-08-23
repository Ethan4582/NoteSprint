"use client";

import { SessionRecord } from "@/src/lib/progress";
import { useRouter } from "next/navigation";
import { Clock, Sparkles, Layers, RotateCcw, Trash2 } from "lucide-react";

interface SessionHistoryListProps {
  history: SessionRecord[];
  searchQuery: string;
  onClearHistory: () => void;
}

export default function SessionHistoryList({
  history,
  searchQuery,
  onClearHistory,
}: SessionHistoryListProps) {
  const router = useRouter();

  const filtered = history.filter((item) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.mode.toLowerCase().includes(q) ||
      item.topics.some((t) => t.toLowerCase().includes(q))
    );
  });

  if (history.length === 0) {
    return (
      <div className="py-16 text-center bg-white rounded-[12px] border border-[var(--border)] p-6 space-y-3">
        <div className="w-10 h-10 rounded-[10px] bg-[var(--bg-subtle)] border border-[var(--border)] flex items-center justify-center mx-auto text-[var(--text-muted)]">
          <Clock size={18} />
        </div>
        <h3 className="text-sm font-bold text-[var(--text-primary)]">No Session History Yet</h3>
        <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
          Start a flashcard or interview drill from your Library to automatically track your score and accuracy.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
          Session History ({filtered.length})
        </span>
        {history.length > 0 && (
          <button
            type="button"
            onClick={onClearHistory}
            className="flex items-center gap-1 text-xs font-semibold text-[var(--text-muted)] hover:text-rose-600 transition-colors cursor-pointer"
            title="Clear all saved history"
          >
            <Trash2 size={13} />
            <span>Clear History</span>
          </button>
        )}
      </div>

      <div className="space-y-2">
        {filtered.map((sess) => {
          const dateStr = new Date(sess.timestamp).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });

          const accuracyColor =
            sess.accuracy >= 80
              ? "text-emerald-600 bg-emerald-50 border-emerald-200"
              : sess.accuracy >= 60
              ? "text-amber-600 bg-amber-50 border-amber-200"
              : "text-rose-600 bg-rose-50 border-rose-200";

          const formattedTopics = sess.topics
            .map((t) => t.replace(/^interview_/, "").replace(/_/g, " "))
            .join(", ");

          return (
            <div
              key={sess.id}
              className="p-3.5 sm:p-4 rounded-[12px] bg-white border border-[var(--border)] hover:border-[var(--border-strong)] transition-all shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 rounded-[8px] bg-[var(--bg-subtle)] text-[var(--text-secondary)] shrink-0">
                  {sess.mode === "interview" ? <Sparkles size={16} /> : <Layers size={16} />}
                </div>
                <div className="min-w-0 space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-[var(--text-primary)] truncate capitalize">
                      {formattedTopics || "General Drill"}
                    </h4>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[var(--bg-subtle)] text-[var(--text-secondary)] border border-[var(--border)] uppercase">
                      {sess.mode}
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)] font-mono">
                    {dateStr} · {sess.totalQuestions} cards
                  </p>
                </div>
              </div>

              {/* Right side stats & repeat action */}
              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                <div className="text-right">
                  <span
                    className={`inline-block text-[11px] font-mono font-bold px-2 py-0.5 rounded-[6px] border ${accuracyColor}`}
                  >
                    {sess.accuracy}% ({sess.correct}/{sess.totalQuestions})
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const topicParam = sess.topics.join(",");
                    if (sess.mode === "interview") {
                      router.push(`/interview?topic=${sess.topics[0]}`);
                    } else {
                      router.push(`/session?topic=${topicParam}&count=10&time=5&mode=flashcard`);
                    }
                  }}
                  className="p-2 rounded-[8px] bg-[var(--bg-subtle)] hover:bg-[var(--accent)] hover:text-white border border-[var(--border)] hover:border-transparent text-[var(--text-secondary)] transition-all cursor-pointer"
                  title="Retry this session drill"
                >
                  <RotateCcw size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
