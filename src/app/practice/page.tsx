"use client";

import { useSearchParams } from "next/navigation";
import { useState, Suspense, useMemo, useEffect } from "react";
import { fetchTopics, TopicWithCount } from "@/src/lib/api";
import { DATA, getQuestions } from "@/src/lib/data";
import BottomNav from "@/src/components/BottomNav";
import DashboardSidebar from "@/src/components/dashboard/DashboardSidebar";
import PracticeHeader from "@/src/components/practice/PracticeHeader";
import TopicGrid from "@/src/components/dashboard/TopicGrid";
import SessionConfigModal from "@/src/components/dashboard/SessionConfigModal";
import { Play } from "lucide-react";

function PracticeContent() {
  const searchParams = useSearchParams();
  const initialTopic = searchParams.get("topic");

  const [dbTopics, setDbTopics] = useState<TopicWithCount[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchTopics().then((res) => {
      if (res && res.length > 0) {
        setDbTopics(res.filter((t) => !t.slug.startsWith("interview_")));
      }
    });
  }, []);

  useEffect(() => {
    if (initialTopic) setSelectedTopics([initialTopic]);
  }, [initialTopic]);

  const allAvailableTopics = useMemo(() => {
    if (dbTopics.length > 0) {
      return dbTopics
        .map((t) => ({ topic: t.slug, qCount: t.questionCount }))
        .filter((t) => t.qCount > 0)
        .sort((a, b) => b.qCount - a.qCount);
    }

    return Object.keys(DATA)
      .filter((topic) => !topic.startsWith("interview_"))
      .map((topic) => ({ topic, qCount: getQuestions([], topic).length }))
      .filter((t) => t.qCount > 0)
      .sort((a, b) => b.qCount - a.qCount);
  }, [dbTopics]);

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
      <DashboardSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-28">
        <PracticeHeader />

        <main className="max-w-[1600px] w-full mx-auto px-4 sm:px-8 lg:px-10 py-6 sm:py-8 space-y-6">
          <TopicGrid
            topics={allAvailableTopics}
            selectedTopics={selectedTopics}
            onToggleTopic={toggleTopic}
          />
        </main>
      </div>

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

export default function PracticePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center font-mono text-xs uppercase tracking-widest text-[var(--text-muted)]">
          Loading Config...
        </div>
      }
    >
      <PracticeContent />
    </Suspense>
  );
}
