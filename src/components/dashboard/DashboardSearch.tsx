"use client";

import { Search } from "lucide-react";

interface DashboardSearchProps {
  search: string;
  setSearch: (val: string) => void;
  tabs: string[];
  activeTab: string;
  setActiveTab: (val: string) => void;
}

export default function DashboardSearch({ search, setSearch, tabs, activeTab, setActiveTab }: DashboardSearchProps) {
  return (
    <div className="space-y-4">
      <div className="relative group">
        <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
          <Search className="w-4 h-4 text-[var(--text-muted)] group-focus-within:text-[var(--accent)] transition-colors" />
        </div>
        <input
          type="text"
          placeholder="Search topics or docs…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-[44px] sm:h-11 pl-10 pr-4 bg-white rounded-full text-[var(--text-primary)] text-[14px] font-medium outline-none border border-[var(--border)] shadow-sm placeholder:text-[var(--text-muted)] focus:border-[var(--border-strong)] focus:shadow-[var(--shadow-soft)] transition-all"
        />
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide p-1 rounded-full bg-white border border-[var(--border)] shadow-sm w-fit max-w-full">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3.5 sm:px-4 py-1.5 rounded-full text-[11px] font-bold tracking-wide whitespace-nowrap transition-all ${
              activeTab === tab
                ? "bg-[var(--text-primary)] text-white shadow-sm"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}
