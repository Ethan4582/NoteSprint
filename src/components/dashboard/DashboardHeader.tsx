"use client";

import ThemeToggle from "@/src/components/ThemeToggle";

export default function DashboardHeader() {
  return (
    <div className="flex flex-row justify-between items-center gap-4 sm:gap-6 mt-2 sm:mt-0">
      <div className="flex items-center gap-4">
        <img src="/logo.png" className="w-10 h-10 sm:w-12 sm:h-12 drop-shadow-[0_0_8px_rgba(255,69,0,0.5)] rounded-lg" alt="Logo" />
        <div className="space-y-0">
          <p className="text-[9px] sm:text-[10px] font-black text-[var(--accent)] tracking-[0.3em] uppercase drop-shadow-[0_0_5px_rgba(255,69,0,0.3)]">Note sprints</p>
          <h1 className="text-xl sm:text-4xl font-black text-[var(--text-primary)] tracking-tight drop-shadow-lg">
            Master the stack
          </h1>
        </div>
      </div>
      <div className="bg-raised shadow-raised-crisp p-1.5 sm:p-2 rounded-2xl border border-[var(--border-strong)] shrink-0">
        <ThemeToggle />
      </div>
    </div>
  );
}
