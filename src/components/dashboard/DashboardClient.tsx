"use client";

import { useState, useEffect } from "react";
import { Play } from "lucide-react";
import { DATA, getQuestions } from "@/src/lib/data";
import { fetchTopics, TopicWithCount } from "@/src/lib/api";
import BottomNav from "@/src/components/BottomNav";
import DashboardSidebar from "@/src/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/src/components/dashboard/DashboardHeader";
import DashboardSearch from "@/src/components/dashboard/DashboardSearch";
import TopicGrid from "@/src/components/dashboard/TopicGrid";
import SessionConfigModal from "@/src/components/dashboard/SessionConfigModal";
import SystemDesignReadView from "@/src/components/read/SystemDesignReadView";
import SystemDesignDocCard from "@/src/components/read/SystemDesignDocCard";
import { MarkdownMeta } from "@/src/lib/markdown";
import { useRouter } from "next/navigation";
import { Clock3, X } from "lucide-react";
import { useRecentDecks } from "@/src/hooks/useRecentDecks";

export default function DashboardClient({ systemDocs }: { systemDocs: MarkdownMeta[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("ALL");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dbTopics, setDbTopics] = useState<TopicWithCount[]>([]);
  const { recent, clear } = useRecentDecks();
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    fetchTopics().then((res) => {
      if (res && res.length > 0) setDbTopics(res.filter((t) => !t.slug.startsWith("interview_")));
    });
  }, []);

  const CATEGORY_MAP: Record<string, string[]> = {
    Frontend: ["react", "nextjs", "typescript", "redux", "javascript", "playwright_", "testing"],
    Backend: [
      "nodejs",
      "express",
      "mongodb",
      "postgresql",
      "aws_",
      "azure_",
      "drizzle_",
      "fastapi_",
      "graphql_",
      "grpc_",
      "hono_",
      "langchain_",
      "langgraph_",
      "prisma",
      "python",
      "redis",
      "socketio_",
      "websocket_",
    ],
    Fundamentals: ["operating_systeam", "computer_network", "c++", "database_management", "oops", "sql"],
    "System Design": ["lld", "hld"],
  };

  const getFilteredTopics = () => {
    let topics: { topic: string; qCount?: number }[] =
      dbTopics.length > 0
        ? dbTopics.map((t) => ({ topic: t.slug, qCount: t.questionCount }))
        : Object.keys(DATA)
            .filter((topic) => !topic.startsWith("interview_"))
            .map((topic) => ({ topic, qCount: getQuestions([], topic).length }));
    if (activeTab !== "ALL") {
      const cat = CATEGORY_MAP[activeTab] || [];
      topics = topics.filter((t) => cat.includes(t.topic));
    }
    if (search) topics = topics.filter((t) => t.topic.toLowerCase().includes(search.toLowerCase()));
    return topics.filter((t) => (t.qCount ?? getQuestions([], t.topic).length) > 0);
  };

  const toggleTopic = (topic: string) =>
    setSelectedTopics((prev) => (prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]));
  const filtered = getFilteredTopics();
  const totalSelectedQuestions = selectedTopics.reduce((acc, topic) => {
    const m = filtered.find((t) => t.topic === topic);
    return acc + (m?.qCount ?? getQuestions([], topic).length);
  }, 0);
  const tabs = ["ALL", "Frontend", "Backend", "Fundamentals", "System Design"];

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex font-sans">
      {/* 1. Left Fixed / Sticky Desktop Sidebar */}
      <DashboardSidebar activeTab={activeTab} onSelectTab={(tab) => setActiveTab(tab)} />

      {/* 2. Main Content Area Taking Window Width */}
      <div className="flex-1 flex flex-col min-w-0 pb-28">
        {/* Mobile-Only Top Brand Bar */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-[var(--border)] px-4 h-14 flex items-center justify-between md:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-[var(--accent)] flex items-center justify-center text-white font-extrabold text-xs shadow-xs p-1">
              <img src="/logo.png" alt="NoteSprint" className="w-full h-full object-contain" />
            </div>
            <span className="text-sm font-extrabold tracking-tight text-[var(--text-primary)]">
              Note<span className="text-[var(--accent)]">Sprint</span>
            </span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-[10px] bg-[var(--bg-subtle)] text-[var(--text-muted)] border border-[var(--border)]">
            Offline Ready
          </span>
        </header>

        <main className="flex-1 w-full max-w-[1700px] mx-auto px-4 sm:px-8 lg:px-10 py-6 sm:py-8 space-y-6">
          {/* Header Area with Greeting & Search */}
          <DashboardHeader search={search} setSearch={setSearch} />

          {/* Category Filter Pills */}
          <DashboardSearch tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Recently Viewed Shelf (Local Only) */}
          {hydrated && recent.length > 0 && activeTab === "ALL" && !search && (
            <div className="rounded-[12px] bg-white border border-[var(--border)] shadow-sm p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
                  <Clock3 size={13} />
                  <span>Recently Viewed</span>
                </h2>
                <button
                  onClick={clear}
                  className="text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text-primary)] flex items-center gap-1"
                >
                  <X size={13} />
                  <span>Clear</span>
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
                {recent.slice(0, 6).map((slug) => {
                  const qCount = dbTopics.find((t) => t.slug === slug)?.questionCount ?? 0;
                  return (
                    <button
                      key={slug}
                      onClick={() => router.push(`/practice?topic=${slug}`)}
                      className="text-left p-3 rounded-[11px] bg-[var(--bg-subtle)] border border-[var(--border)] hover:bg-white hover:border-[var(--accent)]/40 transition-all shadow-2xs group"
                    >
                      <p className="text-xs font-bold tracking-tight text-[var(--text-primary)] truncate group-hover:text-[var(--accent)]">
                        {slug.replace(/^interview_/, "").replace(/_/g, " ")}
                      </p>
                      <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                        {qCount ? `${qCount} cards` : "Open deck"}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Main Topics or System Design View */}
          {activeTab === "System Design" ? (
            <SystemDesignReadView search={search} systemDocs={systemDocs} />
          ) : (
            <div className="space-y-6">
              <TopicGrid topics={filtered} selectedTopics={selectedTopics} onToggleTopic={toggleTopic} />
              {search &&
                systemDocs.filter((doc) => {
                  const s = search.toLowerCase();
                  return doc.title.toLowerCase().includes(s) || doc.tags?.some((t) => t.toLowerCase().includes(s));
                }).length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                      Matching Documentation
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                      {systemDocs
                        .filter((doc) => {
                          const s = search.toLowerCase();
                          return (
                            doc.title.toLowerCase().includes(s) ||
                            doc.tags?.some((t) => t.toLowerCase().includes(s))
                          );
                        })
                        .map((doc, idx) => (
                          <SystemDesignDocCard key={doc.slug} doc={doc} index={idx} />
                        ))}
                    </div>
                  </div>
                )}
            </div>
          )}
        </main>
      </div>

      {/* Floating Multi-Topic Start Action */}
      {selectedTopics.length > 0 && (
        <div className="fixed bottom-24 sm:bottom-8 left-0 right-0 md:left-64 flex justify-center z-40 pointer-events-none px-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="pointer-events-auto inline-flex items-center gap-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white px-6 py-3.5 rounded-[12px] shadow-xl shadow-[var(--accent)]/25 font-bold text-xs uppercase tracking-wider hover:scale-105 active:scale-95 transition-all"
          >
            <Play size={14} fill="currentColor" />
            <span>
              Start Session ({selectedTopics.length} Decks • {totalSelectedQuestions} Cards)
            </span>
          </button>
        </div>
      )}

      {/* Session Config Modal */}
      <SessionConfigModal
        topic={selectedTopics.join(",")}
        totalAvailable={totalSelectedQuestions}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Mobile Floating Pill Navigation */}
      <BottomNav />
    </div>
  );
}
