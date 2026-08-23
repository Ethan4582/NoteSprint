"use client";

import { Clock, BookOpen } from "lucide-react";
import { MarkdownMeta } from "@/src/lib/markdown";
import { useRouter } from "next/navigation";
import { useRecentDecks } from "@/src/hooks/useRecentDecks";

interface SystemDesignDocCardProps {
  doc: MarkdownMeta;
  index?: number;
  type?: "lld" | "hld";
  activeTab?: string;
}

export default function SystemDesignDocCard({ doc, type, activeTab = "ALL" }: SystemDesignDocCardProps) {
  const router = useRouter();
  const { push } = useRecentDecks();
  const docType = (type || doc.type || "hld").toLowerCase();

  const handleArticleClick = () => {
    push(doc.slug);
    router.push(`/system-design/${docType}/${doc.slug}`);
  };

  // Show HLD tag only when in ALL tab and docType is HLD.
  // Never show LLD tag (in LLD section or ALL section) as requested.
  const showTypeTag = activeTab === "ALL" && docType === "hld";

  return (
    <button
      onClick={handleArticleClick}
      className="group relative flex flex-col justify-between p-4 sm:p-5 bg-white rounded-[12px] border border-[var(--border)] hover:border-[var(--border-strong)] hover:shadow-xs text-left w-full transition-all space-y-3"
    >
      <div className="space-y-2 w-full">
        {/* Type / Reading Time / Difficulty Badges */}
        <div className="flex flex-wrap items-center gap-1.5">
          {showTypeTag && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wide px-2 py-0.5 rounded-[6px] bg-[var(--bg-subtle)] border border-[var(--border)] text-[var(--text-secondary)] uppercase">
              <BookOpen size={11} /> HLD
            </span>
          )}
          <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wide px-2 py-0.5 rounded-[6px] bg-white border border-[var(--border)] text-[var(--text-muted)]">
            <Clock size={11} /> {doc.readingTime} min
          </span>
          <span
            className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wide px-2 py-0.5 rounded-[6px] border"
            style={{
              background: doc.difficulty === "Easy" ? "var(--success-subtle)" : doc.difficulty === "Hard" ? "var(--error-subtle)" : "var(--warning-subtle)",
              borderColor: doc.difficulty === "Easy" ? "var(--success-border)" : doc.difficulty === "Hard" ? "#FFC9C9" : "#FDE68A",
              color: doc.difficulty === "Easy" ? "var(--success)" : doc.difficulty === "Hard" ? "var(--error)" : "#B45309",
            }}
          >
            {doc.difficulty}
          </span>
        </div>

        {/* Title & Description */}
        <h3 className="text-[15px] font-bold leading-snug tracking-tight text-[var(--text-primary)] line-clamp-2 group-hover:text-[var(--accent)] transition-colors">
          {doc.title}
        </h3>
        {doc.description && (
          <p className="text-xs leading-relaxed text-[var(--text-secondary)] line-clamp-2">
            {doc.description}
          </p>
        )}
      </div>
    </button>
  );
}
