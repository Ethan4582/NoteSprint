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
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10">
          <Search className="w-4 h-4 sm:w-5 text-[var(--text-muted)] group-focus-within:text-[var(--accent)] transition-colors drop-shadow-md" />
        </div>
        <input 
          type="text" 
          placeholder="Search topics..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-12 sm:h-14 pl-11 sm:pl-14 pr-4 bg-[var(--bg-subtle)] rounded-2xl text-[var(--text-primary)] font-semibold text-base outline-none transition-all shadow-inset-cavity placeholder:text-[var(--text-muted)] placeholder:font-medium border border-[var(--border-inner)] focus:border-[var(--border-strong)]"
        />
      </div>

      <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide no-scrollbar p-1.5 shadow-inset-cavity bg-[var(--bg-subtle)] rounded-2xl border border-[var(--border-inner)]">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 sm:px-6 py-2 rounded-xl text-[10px] sm:text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap active:scale-[0.97] z-10 border border-[var(--border-strong)] ${
              activeTab === tab 
                ? "bg-raised shadow-raised-crisp text-[var(--accent)] drop-shadow-[0_0_8px_rgba(255,69,0,0.5)]" 
                : "bg-transparent text-[var(--text-muted)] border-transparent"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}
