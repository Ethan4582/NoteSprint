"use client";

interface DashboardSearchProps {
  tabs: string[];
  activeTab: string;
  setActiveTab: (val: string) => void;
}

export default function DashboardSearch({ tabs, activeTab, setActiveTab }: DashboardSearchProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1">
      {tabs.map((tab) => {
        const isActive = activeTab === tab;
        return (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap active:scale-95 shrink-0 ${
              isActive
                ? "bg-[var(--accent)] text-white shadow-xs"
                : "bg-white text-[var(--text-secondary)] border border-[var(--border)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]"
            }`}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}
