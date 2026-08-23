import { ChevronRight, Clock, BookOpen } from "lucide-react";
import { MarkdownMeta } from "@/src/lib/markdown";
import { useRouter } from "next/navigation";

interface SystemDesignDocCardProps {
  doc: MarkdownMeta;
  index: number;
  type?: "lld" | "hld";
}

export default function SystemDesignDocCard({ doc, index, type }: SystemDesignDocCardProps) {
  const router = useRouter();
  const docType = type || doc.type || "hld";

  return (
    <button
      onClick={() => router.push(`/system-design/${docType}/${doc.slug}`)}
      className="group relative flex items-start gap-4 p-4 sm:p-5 bg-white border border-[var(--border)] rounded-lg hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-soft)] text-left w-full transition-all"
    >
      <span className="hidden sm:grid place-items-center w-9 h-9 rounded-md bg-[var(--bg-subtle)] border border-[var(--border)] text-xs font-bold text-[var(--text-secondary)] shrink-0">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
          <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wide px-2 py-1 rounded-md bg-[var(--bg-subtle)] border border-[var(--border)] text-[var(--text-secondary)] uppercase">
            <BookOpen size={11} /> {docType.toUpperCase()}
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wide px-2 py-1 rounded-md bg-white border border-[var(--border)] text-[var(--text-muted)]">
            <Clock size={11} /> {doc.readingTime} min
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wide px-2 py-1 rounded-md border"
            style={{
              background: doc.difficulty === "Easy" ? "var(--success-subtle)" : doc.difficulty === "Hard" ? "var(--error-subtle)" : "var(--warning-subtle)",
              borderColor: doc.difficulty === "Easy" ? "var(--success-border)" : doc.difficulty === "Hard" ? "#FFC9C9" : "#FDE68A",
              color: doc.difficulty === "Easy" ? "var(--success)" : doc.difficulty === "Hard" ? "var(--error)" : "#B45309",
            }}
          >
            {doc.difficulty}
          </span>
        </div>
        <h3 className="text-[15px] font-bold leading-tight tracking-tight text-[var(--text-primary)] line-clamp-2">{doc.title}</h3>
        {doc.description && <p className="mt-1 text-xs leading-relaxed text-[var(--text-secondary)] line-clamp-2">{doc.description}</p>}
        <div className="mt-2 flex flex-wrap gap-1">
          {doc.tags?.slice(0, 3).map((t) => (
            <span key={t} className="text-[11px] px-2 py-1 rounded-md bg-[var(--bg-subtle)] border border-[var(--border)] text-[var(--text-muted)]">
              {t}
            </span>
          ))}
        </div>
      </div>
      <span className="hidden sm:grid place-items-center w-8 h-8 rounded-md bg-[var(--text-primary)] text-white shrink-0 group-hover:translate-x-0.5 transition-transform">
        <ChevronRight size={14} />
      </span>
    </button>
  );
}
