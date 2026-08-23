"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense, useMemo, useEffect } from "react";
import { fetchTopics, TopicWithCount } from "@/src/lib/api";
import { DATA, getQuestions } from "@/src/lib/data";
import BottomNav from "@/src/components/BottomNav";
import DashboardSidebar from "@/src/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/src/components/dashboard/DashboardHeader";
import TopicGrid from "@/src/components/dashboard/TopicGrid";
import SessionConfigModal from "@/src/components/dashboard/SessionConfigModal";
import { Play, Clock3, X } from "lucide-react";
import { useRecentDecks } from "@/src/hooks/useRecentDecks";

function InterviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTopic = searchParams.get("topic");

  const [dbTopics, setDbTopics] = useState<TopicWithCount[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { recent, clear } = useRecentDecks();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    fetchTopics().then((res) => {
      if (res && res.length > 0) {
        setDbTopics(res.filter((t) => t.slug.startsWith("interview_")));
      }
    });
  }, []);

  useEffect(() => {
    if (initialTopic) setSelectedTopics([initialTopic]);
  }, [initialTopic]);

  const allAvailableTopics = useMemo(() => {
    const list = dbTopics.length > 0
      ? dbTopics.map((t) => ({ topic: t.slug, qCount: t.questionCount }))
      : Object.keys(DATA)
          .filter((topic) => topic.startsWith("interview_"))
          .map((topic) => ({ topic, qCount: getQuestions([], topic).length }));

    return list.filter((t) => t.qCount > 0).sort((a, b) => b.qCount - a.qCount);
  }, [dbTopics]);

  const filteredTopics = useMemo(() => {
    if (!search) return allAvailableTopics;
    return allAvailableTopics.filter((t) =>
      t.topic.toLowerCase().replace("interview_", "").includes(search.toLowerCase())
    );
  }, [allAvailableTopics, search]);

  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const totalSelectedQuestions = selectedTopics.reduce((sum, topic) => {
    const matched = allAvailableTopics.find((t) => t.topic === topic);
    return sum + (matched?.qCount ?? getQuestions([], topic).length);
  }, 0);

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex font-sans">
      {/* Desktop Left Sidebar */}
      <DashboardSidebar activeTab="Interview Sessions" />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-28">
        <main className="flex-1 w-full max-w-[1700px] mx-auto px-4 sm:px-8 lg:px-10 py-6 sm:py-8 space-y-6">
          {/* Dashboard Header with Greeting & Search */}
          <DashboardHeader search={search} setSearch={setSearch} />

          {/* Recently Viewed Shelf */}
          {hydrated && recent.filter((r) => r.startsWith("interview_")).length > 0 && !search && (
            <div className="rounded-[12px] bg-white border border-[var(--border)] shadow-sm p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
                  <Clock3 size={13} />
                  <span>Recently Viewed Interview Decks</span>
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
                {recent
                  .filter((r) => r.startsWith("interview_"))
                  .slice(0, 6)
                  .map((slug) => {
                    const qCount = dbTopics.find((t) => t.slug === slug)?.questionCount ?? 0;
                    return (
                      <button
                        key={slug}
                        onClick={() => router.push(`/session?topic=${slug}&count=10&time=5&mode=flashcard`)}
                        className="text-left p-3 rounded-[11px] bg-[var(--bg-subtle)] border border-[var(--border)] hover:bg-white hover:border-[var(--accent)]/40 transition-all shadow-2xs group"
                      >
                        <p className="text-xs font-bold tracking-tight text-[var(--text-primary)] truncate group-hover:text-[var(--accent)]">
                          {slug.replace(/^interview_/, "").replace(/_/g, " ")}
                        </p>
                        <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                          {qCount ? `${qCount} cards` : "Open drill"}
                        </p>
                      </button>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Available Topic Grid */}
          <TopicGrid
            topics={filteredTopics}
            selectedTopics={selectedTopics}
            onToggleTopic={toggleTopic}
          />
        </main>
      </div>

      {/* Floating Multi-Topic Start Action */}
      {selectedTopics.length > 0 && (
        <div className="fixed bottom-24 sm:bottom-8 left-0 right-0 md:left-60 flex justify-center z-40 pointer-events-none px-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="pointer-events-auto inline-flex items-center gap-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white px-6 py-3.5 rounded-[12px] shadow-xl font-bold text-xs uppercase tracking-wider hover:scale-105 active:scale-95 transition-all"
          >
            <Play size={14} fill="currentColor" />
            <span>
              Start Session ({selectedTopics.length} Topics • {totalSelectedQuestions} Cards)
            </span>
          </button>
        </div>
      )}

      <SessionConfigModal
        topic={selectedTopics.join(",")}
        totalAvailable={totalSelectedQuestions}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <BottomNav />
    </div>
  );
}

export default function InterviewPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center font-mono text-xs uppercase tracking-widest text-[var(--text-muted)]">
          Loading Config...
        </div>
      }
    >
      <InterviewContent />
    </Suspense>
  );
}
