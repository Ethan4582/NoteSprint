"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PracticeHeader() {
  const router = useRouter();
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-[var(--border)] px-4 sm:px-6 h-14 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="w-9 h-9 grid place-items-center rounded-full bg-white border border-[var(--border)] shadow-sm hover:border-[var(--border-strong)] transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-sm font-black tracking-tight text-[var(--text-primary)]">Practice</h1>
          <p className="text-[11px] text-[var(--text-muted)] hidden sm:block">Pick decks to mix a session</p>
        </div>
      </div>
      <span className="hidden sm:inline-flex text-xs px-3 py-1.5 rounded-full bg-[var(--bg-subtle)] border border-[var(--border)] text-[var(--text-secondary)]">Local only</span>
    </header>
  );
}
