"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import DashboardSidebar from "@/src/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/src/components/dashboard/DashboardHeader";
import DashboardSearch from "@/src/components/dashboard/DashboardSearch";
import BottomNav from "@/src/components/BottomNav";
import SystemDesignDocCard from "@/src/components/read/SystemDesignDocCard";
import type { MarkdownMeta } from "@/src/lib/markdown";
import { Clock3, X } from "lucide-react";
import { useRecentDecks } from "@/src/hooks/useRecentDecks";

interface SystemDesignArticlesClientProps {
  systemDocs: MarkdownMeta[];
}

function ArticlesContent({ systemDocs }: SystemDesignArticlesClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const [search, setSearch] = useState(initialSearch);
  const [activeTab, setActiveTab] = useState("ALL");
  const { recent, clear } = useRecentDecks();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    if (initialSearch) setSearch(initialSearch);
  }, [initialSearch]);

  const filteredDocs = systemDocs.filter((doc) => {
    if (activeTab !== "ALL" && doc.type !== activeTab.toLowerCase()) return false;
    if (!search) return true;
    const s = search.toLowerCase();
    return doc.title.toLowerCase().includes(s) || doc.tags?.some((t) => t.toLowerCase().includes(s));
  });

  const tabs = ["ALL", "HLD", "LLD"];

  // Filter recent docs matching systemDocs
  const recentArticles = hydrated
    ? recent
        .map((slug) => systemDocs.find((d) => d.slug === slug))
        .filter((d): d is MarkdownMeta => Boolean(d))
    : [];

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex font-sans">
      {/* Desktop Left Sidebar */}
      <DashboardSidebar activeTab="System Design" />

      {/* Main Content Area following Library-style layout */}
      <div className="flex-1 flex flex-col min-w-0 pb-28">
        <main className="flex-1 w-full max-w-[1700px] mx-auto px-4 sm:px-8 lg:px-10 py-6 sm:py-8 space-y-6">
          {/* Library-Style Header with Greeting & Search */}
          <DashboardHeader search={search} setSearch={setSearch} />

          {/* Category Filter Pills */}
          <DashboardSearch tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Recently Visited Section Card for System Design */}
          {recentArticles.length > 0 && activeTab === "ALL" && !search && (
            <div className="rounded-[12px] bg-white border border-[var(--border)] shadow-sm p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
                  <Clock3 size={13} />
                  <span>Recently Read Articles</span>
                </h2>
                <button
                  onClick={clear}
                  className="text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text-primary)] flex items-center gap-1"
                >
                  <X size={13} />
                  <span>Clear</span>
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {recentArticles.slice(0, 3).map((doc) => (
                  <button
                    key={doc.slug}
                    onClick={() => router.push(`/system-design/${doc.type || "hld"}/${doc.slug}`)}
                    className="text-left p-3.5 rounded-[11px] bg-[var(--bg-subtle)] border border-[var(--border)] hover:bg-white hover:border-[var(--accent)]/40 transition-all shadow-2xs group"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent)] block mb-1">
                      {(doc.type || "hld").toUpperCase()} · {doc.readingTime} min read
                    </span>
                    <p className="text-xs font-bold tracking-tight text-[var(--text-primary)] line-clamp-1 group-hover:text-[var(--accent)]">
                      {doc.title}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Articles Grid */}
          {filteredDocs.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-[12px] border border-[var(--border)] shadow-xs p-8">
              <p className="text-xs text-[var(--text-muted)]">No articles found matching &quot;{search}&quot;.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDocs.map((doc) => (
                <SystemDesignDocCard key={doc.slug} doc={doc} type={doc.type} activeTab={activeTab} />
              ))}
            </div>
          )}
        </main>
      </div>

      <BottomNav />
    </div>
  );
}

export default function SystemDesignArticlesClient({ systemDocs }: SystemDesignArticlesClientProps) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center text-xs text-[var(--text-muted)] font-mono">Loading Articles...</div>}>
      <ArticlesContent systemDocs={systemDocs} />
    </Suspense>
  );
}
