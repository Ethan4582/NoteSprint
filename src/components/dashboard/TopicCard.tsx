"use client";

import { useRouter } from "next/navigation";
import { getTechIcon } from "./TechIcons";
import { ChevronRight } from "lucide-react";

interface TopicCardProps {
  subject: string;
  topic: string;
  qCount: number;
}

export default function TopicCard({ subject, topic, qCount }: TopicCardProps) {
  const router = useRouter();

  const handleStart = () => {
    const params = new URLSearchParams({ topic });
    router.push(`/practice?${params.toString()}`);
  };

  return (
    <button
      onClick={handleStart}
      className="group relative flex sm:flex-col items-center sm:items-start p-2 sm:p-5 bg-[var(--bg-surface)] border border-[var(--border)] rounded-[12px] sm:rounded-[16px] hover:border-[var(--accent)] transition-all duration-300 text-left shadow-sm hover:shadow-lg active:scale-[0.98] overflow-hidden gap-2 sm:gap-0"
    >
      {/* Background Accent Gradient */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[var(--accent)] to-transparent opacity-[0.02] group-hover:opacity-[0.06] transition-opacity rounded-bl-full hidden sm:block" />

      <div className="flex items-start justify-between sm:mb-4 shrink-0">
        <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-[8px] sm:rounded-[12px] bg-[var(--bg-base)] border border-[var(--border)] flex items-center justify-center group-hover:scale-110 group-hover:rotate-2 transition-transform duration-500 shadow-inner">
          <div className="scale-75 sm:scale-100">
            {getTechIcon(topic)}
          </div>
        </div>
        <div className="h-6 w-6 rounded-full border border-[var(--border)] hidden sm:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
          <ChevronRight className="w-3.5 h-3.5 text-[var(--accent)]" />
        </div>
      </div>

      <div className="flex-1 space-y-0 min-w-0">
        <h3 className="text-[11px] sm:text-lg font-bold text-[var(--text-primary)] leading-tight tracking-tight truncate">
          {topic.replace(/_/g, ' ')}
        </h3>
        <div className="flex items-center gap-1 opacity-70 sm:mt-3">
          <span className="text-[8px] sm:text-xs font-black text-[var(--text-secondary)]">
            {qCount}
          </span>
          <span className="text-[7px] sm:text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-tighter sm:tracking-widest">
            Cards
          </span>
        </div>
      </div>
    </button>
  );
}
