"use client";

import { useState, useEffect } from "react";
import { Play } from "lucide-react";
import { DATA, getQuestions } from "@/src/lib/data";
import { fetchTopics, TopicWithCount } from "@/src/lib/api";
import BottomNav from "@/src/components/BottomNav";
import DashboardHeader from "@/src/components/dashboard/DashboardHeader";
import DashboardSearch from "@/src/components/dashboard/DashboardSearch";
import TopicGrid from "@/src/components/dashboard/TopicGrid";
import SessionConfigModal from "@/src/components/dashboard/SessionConfigModal";
import SystemDesignReadView from "@/src/components/read/SystemDesignReadView";
import SystemDesignDocCard from "@/src/components/read/SystemDesignDocCard";
import { MarkdownMeta } from "@/src/lib/markdown";

export default function DashboardClient({ systemDocs }: { systemDocs: MarkdownMeta[] }) {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("ALL");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dbTopics, setDbTopics] = useState<TopicWithCount[]>([]);

  useEffect(() => {
    fetchTopics().then((res) => {
      if (res && res.length > 0) setDbTopics(res.filter((t) => !t.slug.startsWith("interview_")));
    });
  }, []);

  const CATEGORY_MAP: Record<string, string[]> = {
    Frontend: ["react", "nextjs", "typescript", "redux", "javascript", "playwright_", "testing"],
    Backend: ["nodejs", "express", "mongodb", "postgresql", "aws_", "azure_", "drizzle_", "fastapi_", "graphql_", "grpc_", "hono_", "langchain_", "langgraph_", "prisma", "python", "redis", "socketio_", "websocket_"],
    Fundamentals: ["operating_systeam", "computer_network", "c++", "database_management", "oops", "sql"],
    "System Design": ["lld", "hld"],
  };

  const getFilteredTopics = () => {
    let topics: { topic: string; qCount?: number }[] = dbTopics.length > 0
      ? dbTopics.map((t) => ({ topic: t.slug, qCount: t.questionCount }))
      : Object.keys(DATA).filter((topic) => !topic.startsWith("interview_")).map((topic) => ({ topic, qCount: getQuestions([], topic).length }));
    if (activeTab !== "ALL") {
      const cat = CATEGORY_MAP[activeTab] || [];
      topics = topics.filter((t) => cat.includes(t.topic));
    }
    if (search) topics = topics.filter((t) => t.topic.toLowerCase().includes(search.toLowerCase()));
    return topics.filter((t) => (t.qCount ?? getQuestions([], t.topic).length) > 0);
  };

  const toggleTopic = (topic: string) => setSelectedTopics((prev) => (prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]));
  const filtered = getFilteredTopics();
  const totalSelectedQuestions = selectedTopics.reduce((acc, topic) => {
    const m = filtered.find((t) => t.topic === topic);
    return acc + (m?.qCount ?? getQuestions([], topic).length);
  }, 0);
  const tabs = ["ALL", "Frontend", "Backend", "Fundamentals", "System Design"];

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex flex-col pb-28 font-sans overflow-x-hidden">
      {/* Top header bar — consistent with landing */}
      <header className="sticky top-0 z-30 bg-[var(--bg-base)]/90 backdrop-blur-xl border-b border-[var(--border)]">
        <div className="max-w-[1120px] mx-auto w-full px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
          <a href="/dashboard" className="flex items-center gap-2.5 min-w-0">
            <img src="/logo.png" alt="NoteSprint" className="w-7 h-7 rounded-lg border border-[var(--border)] object-cover" />
            <span className="text-sm font-extrabold tracking-tight text-[var(--text-primary)] hidden sm:inline">NoteSprint</span>
          </a>
          <div className="hidden sm:flex items-center gap-2 text-[11px] text-[var(--text-muted)] font-medium truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" /> Local-only · Bookmarks & recents on this device
          </div>
          <a href="/admin" className="text-xs font-bold px-3 py-1.5 rounded-full bg-white border border-[var(--border)] shadow-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
            Admin
          </a>
        </div>
      </header>

      <main className="max-w-[1120px] mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-7">
        <DashboardHeader />
        <DashboardSearch search={search} setSearch={setSearch} tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

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
                  <h3 className="text-[11px] font-black uppercase tracking-[0.14em] text-[var(--text-muted)]">Matching documentation</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {systemDocs
                      .filter((doc) => {
                        const s = search.toLowerCase();
                        return doc.title.toLowerCase().includes(s) || doc.tags?.some((t) => t.toLowerCase().includes(s));
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

      {selectedTopics.length > 0 && (
        <div className="fixed bottom-[84px] sm:bottom-6 left-0 right-0 flex justify-center z-40 pointer-events-none px-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="pointer-events-auto inline-flex items-center gap-2 bg-[var(--text-primary)] text-white px-5 py-3 rounded-full shadow-[0_12px_32px_rgba(28,25,23,0.2)] font-bold text-xs tracking-wide hover:translate-y-[-1px] active:translate-y-0 transition-transform"
          >
            <Play size={14} fill="currentColor" />
            Start session · {selectedTopics.length} deck{selectedTopics.length > 1 ? "s" : ""} · {totalSelectedQuestions} cards
          </button>
        </div>
      )}

      <SessionConfigModal topic={selectedTopics.join(",")} totalAvailable={totalSelectedQuestions} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <BottomNav />
    </div>
  );
}
