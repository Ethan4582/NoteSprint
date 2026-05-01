"use client";

import { ArrowLeft } from "lucide-react";
import ThemeToggle from "@/src/components/ThemeToggle";
import { useRouter } from "next/navigation";

export default function PracticeHeader() {
  const router = useRouter();
  
  return (
    <header className="sticky top-0 z-40 bg-[var(--bg-surface)]/80 backdrop-blur-md border-b border-[var(--border)] px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="p-2 hover:bg-[var(--bg-subtle)] rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-sm sm:text-lg font-black uppercase tracking-widest text-[var(--text-primary)]">Practice</h1>
          <p className="text-[9px] font-bold text-[var(--accent)] uppercase tracking-tighter hidden sm:block">Configure your session</p>
        </div>
      </div>
      <ThemeToggle />
    </header>
  );
}
