"use client";

import { useSearchParams } from "next/navigation";
import { useState, Suspense, useMemo, useEffect } from "react";
import { fetchTopics, TopicWithCount } from "@/src/lib/api";
import { DATA, getQuestions } from "@/src/lib/data";
import BottomNav from "@/src/components/BottomNav";
import { Play } from "lucide-react";

// Practice components
import PracticeHeader from "@/src/components/practice/PracticeHeader";
import TopicGrid from "@/src/components/dashboard/TopicGrid";
import SessionConfigModal from "@/src/components/dashboard/SessionConfigModal";

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
    <div className="min-h-screen bg-[var(--bg-base)] flex flex-col pb-32 overflow-x-hidden relative">
      <PracticeHeader />

      <main className="max-w-[1600px] mx-auto w-full p-4 sm:p-10 space-y-8 sm:space-y-10">
        <TopicGrid 
          topics={allAvailableTopics}
          selectedTopics={selectedTopics}
          onToggleTopic={toggleTopic}
        />
      </main>

      {selectedTopics.length > 0 && (
        <div className="fixed bottom-[84px] sm:bottom-6 left-0 right-0 flex justify-center z-40 pointer-events-none px-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="pointer-events-auto bg-[var(--text-primary)] text-white px-5 py-3 rounded-md shadow-[0_12px_32px_rgba(28,25,23,0.2)] font-bold text-xs tracking-wide flex items-center gap-2 hover:translate-y-[-1px] transition-transform"
          >
            <Play size={14} fill="currentColor" />
            Start session · {selectedTopics.length} deck{selectedTopics.length > 1 ? "s" : ""} · {totalSelectedQuestions} cards
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
    <Suspense fallback={<div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center font-mono text-xs uppercase tracking-widest text-[var(--text-muted)]">Loading Config...</div>}>
      <PracticeContent />
    </Suspense>
  );
}
