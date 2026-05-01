"use client";

import { Search } from "lucide-react";

interface DashboardSearchProps {
  search: string;
  setSearch: (val: string) => void;
  tabs: string[];
  activeTab: string;
  setActiveTab: (val: string) => void;
}

export default function DashboardSearch({ 
  search, 
  setSearch, 
  tabs, 
  activeTab, 
  setActiveTab 
}: DashboardSearchProps) {
  return (
    <div className="space-y-6">
      <div className="relative group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className="w-4 h-4 sm:w-5 text-[var(--text-muted)] group-focus-within:text-[var(--accent)] transition-colors" />
        </div>
        <input 
          type="text" 
          placeholder="Search topics..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-12 sm:h-14 pl-11 sm:pl-14 pr-4 bg-[var(--bg-surface)] border-2 border-[var(--border)] rounded-[12px] sm:rounded-[14px] text-[var(--text-primary)] font-semibold text-base focus:border-[var(--accent)] outline-none transition-all shadow-sm placeholder:text-[var(--text-muted)] placeholder:font-medium"
        />
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 sm:px-6 py-2 rounded-[12px] text-[10px] sm:text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap border-2 ${
              activeTab === tab 
                ? "bg-[var(--accent)] text-white border-[var(--accent)] shadow-md" 
                : "bg-[var(--bg-surface)] text-[var(--text-muted)] border-[var(--border)] hover:border-[var(--text-secondary)]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}
