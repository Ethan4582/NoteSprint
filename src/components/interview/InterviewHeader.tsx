"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function InterviewHeader() {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-[var(--border)] px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-2 bg-white border border-[var(--border)] rounded-full hover:bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] active:scale-95 transition-all shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-lg sm:text-xl font-normal font-serif tracking-tight text-[var(--text-primary)]">
            Interview Prep Decks
          </h1>
          <p className="text-[11px] text-[var(--text-muted)]">
            Configure targeted active recall session
          </p>
        </div>
      </div>
    </header>
  );
}
