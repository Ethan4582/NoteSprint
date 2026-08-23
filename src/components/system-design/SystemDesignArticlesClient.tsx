"use client";

import { useState } from "react";
import DashboardSidebar from "@/src/components/dashboard/DashboardSidebar";
import BottomNav from "@/src/components/BottomNav";
import SystemDesignDocCard from "@/src/components/read/SystemDesignDocCard";
import type { MarkdownMeta } from "@/src/lib/markdown";
import { Search, BookOpen } from "lucide-react";

interface SystemDesignArticlesClientProps {
  systemDocs: MarkdownMeta[];
}

export default function SystemDesignArticlesClient({ systemDocs }: SystemDesignArticlesClientProps) {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"ALL" | "HLD" | "LLD">("ALL");

  const filteredDocs = systemDocs.filter((doc) => {
    if (activeTab !== "ALL" && doc.type !== activeTab.toLowerCase()) return false;
    if (!search) return true;
    const s = search.toLowerCase();
    return doc.title.toLowerCase().includes(s) || doc.tags?.some((t) => t.toLowerCase().includes(s));
  });

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex font-sans">
      {/* Desktop Left Sidebar */}
      <DashboardSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-28">
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-[var(--border)] px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-[10px] bg-[var(--accent-subtle)] border border-[var(--accent)]/20 text-[var(--accent)]">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-normal font-serif tracking-tight text-[var(--text-primary)]">
                System Design & Architecture
              </h1>
              <p className="text-xs text-[var(--text-muted)] font-medium">
                Deep-dive distributed systems, real-time architectures, and design patterns.
              </p>
            </div>
          </div>
        </header>

        <main className="max-w-6xl w-full mx-auto p-4 sm:px-8 py-6 space-y-6 flex-1">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Category Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-[10px] bg-white border border-[var(--border)] shadow-2xs">
              {(["ALL", "HLD", "LLD"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-[8px] text-xs font-bold transition-all ${
                    activeTab === tab
                      ? "bg-[var(--accent)] text-white shadow-xs"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Search articles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 pl-9 pr-3 rounded-[10px] bg-white border border-[var(--border)] text-xs text-[var(--text-primary)] outline-none shadow-2xs placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]"
              />
            </div>
          </div>

          {/* Articles Grid */}
          {filteredDocs.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-[12px] border border-[var(--border)] shadow-xs p-8">
              <p className="text-xs text-[var(--text-muted)]">No articles found matching your filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDocs.map((doc, idx) => (
                <SystemDesignDocCard key={doc.slug} doc={doc} index={idx} type={doc.type} />
              ))}
            </div>
          )}
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
