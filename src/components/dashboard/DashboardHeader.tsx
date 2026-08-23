"use client";

import { Search } from "lucide-react";

interface DashboardHeaderProps {
  search: string;
  setSearch: (val: string) => void;
}

export default function DashboardHeader({ search, setSearch }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--accent)] tracking-wide">
          <span>👋</span>
          <span>Welcome back!</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
          What do you want to learn today?
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
          Choose a topic and start mastering it with active recall flashcards.
        </p>
      </div>

      {/* Desktop Quick Search Input */}
      <div className="relative w-full md:w-80 shrink-0">
        <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
          <Search className="w-4 h-4 text-[var(--text-muted)]" />
        </div>
        <input
          type="text"
          placeholder="Search topics..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-11 pl-10 pr-12 bg-white rounded-[11px] text-[var(--text-primary)] text-xs font-medium outline-none border border-[var(--border)] shadow-xs focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/10 transition-all placeholder:text-[var(--text-muted)]"
        />
        <span className="absolute right-3 top-3 text-[10px] font-mono text-[var(--text-muted)] px-1.5 py-0.5 rounded-[8px] bg-[var(--bg-subtle)] border border-[var(--border)] pointer-events-none hidden sm:inline">
          ⌘K
        </span>
      </div>
    </div>
  );
}
