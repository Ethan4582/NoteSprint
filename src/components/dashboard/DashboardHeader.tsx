"use client";

import ThemeToggle from "@/src/components/ThemeToggle";

export default function DashboardHeader() {
  return (
    <div className="flex flex-row justify-between items-center gap-4 sm:gap-6 mt-2 sm:mt-0">
      <div className="flex items-center gap-4">
        <img src="/logo.png" className="w-10 h-10 sm:w-12 sm:h-12 drop-shadow-md rounded-lg" alt="Logo" />
        <div className="space-y-0">
          <p className="text-[9px] sm:text-[10px] font-black text-[var(--accent)] tracking-[0.3em] uppercase">Note sprints</p>
          <h1 className="text-xl sm:text-4xl font-black text-[var(--text-primary)] tracking-tight">
            Master the stack
          </h1>
        </div>
      </div>
      <div className="bg-[var(--bg-surface)] p-1.5 sm:p-2 rounded-[12px] shadow-sm border border-[var(--border)] shrink-0">
        <ThemeToggle />
      </div>
    </div>
  );
}
