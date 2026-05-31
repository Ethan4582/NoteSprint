import { ChevronRight, Clock } from "lucide-react";
import { MarkdownMeta } from "@/src/lib/markdown";
import { useRouter } from "next/navigation";

interface SystemDesignDocCardProps {
  doc: MarkdownMeta;
  index: number;
  type?: "lld" | "hld"; // defaults to doc.type
}

export default function SystemDesignDocCard({ doc, index, type }: SystemDesignDocCardProps) {
  const router = useRouter();
  const docType = type || doc.type || "hld";

  return (
    <button
      onClick={() => router.push(`/system-design/${docType}/${doc.slug}`)}
      className="group relative flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 p-5 sm:p-6 bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-2xl hover:border-[var(--accent)] transition-all duration-300 text-left shadow-sm hover:shadow-md active:scale-[0.99] overflow-hidden w-full"
    >
      <div className="w-10 h-10 rounded-xl bg-[var(--bg-base)] border border-[var(--border-inner)] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-500 hidden sm:flex">
        <span className="text-xs font-bold text-[var(--text-secondary)]">{index + 1}</span>
      </div>

      <div className="flex-1 space-y-2 min-w-0 pr-8">
        <h3 className="text-lg font-bold text-[var(--text-primary)] leading-tight tracking-tight truncate">
          {doc.title}
        </h3>
        
        <div className="flex items-center gap-4 pt-1">
          <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
            <Clock size={14} className="opacity-60" />
            <span className="text-[11px] font-bold tracking-wider uppercase">{doc.readingTime} min read</span>
          </div>
          <div className="flex items-center gap-1 text-[var(--text-secondary)]" title={`Difficulty: ${doc.difficulty}`}>
            <div className={`w-1 h-3 rounded-full ${doc.difficulty === 'Easy' ? 'bg-green-500' : doc.difficulty === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'}`} />
            <div className={`w-1 h-3 rounded-full ${(doc.difficulty === 'Medium' || doc.difficulty === 'Hard') ? (doc.difficulty === 'Medium' ? 'bg-yellow-500' : 'bg-red-500') : 'bg-[var(--border-strong)]'}`} />
            <div className={`w-1 h-3 rounded-full ${doc.difficulty === 'Hard' ? 'bg-red-500' : 'bg-[var(--border-strong)]'}`} />
          </div>
        </div>
      </div>

      <div className="absolute right-6 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[var(--accent-subtle)] border border-[var(--accent)]/20 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
        <ChevronRight size={16} className="text-[var(--accent)]" />
      </div>
    </button>
  );
}
