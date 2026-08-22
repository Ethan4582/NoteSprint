"use client";

import { useSearchParams } from "next/navigation";
import { useState, Suspense, useMemo, useEffect } from "react";
import { fetchTopics, TopicWithCount } from "@/src/lib/api";
import { DATA, getQuestions } from "@/src/lib/data";
import BottomNav from "@/src/components/BottomNav";
import { Play, Search } from "lucide-react";

// Interview components
import InterviewHeader from "@/src/components/interview/InterviewHeader";
import TopicGrid from "@/src/components/dashboard/TopicGrid";
import SessionConfigModal from "@/src/components/dashboard/SessionConfigModal";

function InterviewContent() {
  const searchParams = useSearchParams();
  const initialTopic = searchParams.get("topic");

  const [dbTopics, setDbTopics] = useState<TopicWithCount[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");

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
    if (dbTopics.length > 0) {
      return dbTopics
        .map((t) => ({ topic: t.slug, qCount: t.questionCount }))
        .filter((t) => t.qCount > 0)
        .sort((a, b) => b.qCount - a.qCount);
    }

    return Object.keys(DATA)
      .filter((topic) => topic.startsWith("interview_"))
      .map((topic) => ({ topic, qCount: getQuestions([], topic).length }))
      .filter((t) => t.qCount > 0)
      .sort((a, b) => b.qCount - a.qCount);
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
    <div className="min-h-screen bg-[var(--bg-base)] flex flex-col pb-32 overflow-x-hidden relative">
      <InterviewHeader />

      <main className="max-w-[1600px] mx-auto w-full p-4 sm:p-10 space-y-8 sm:space-y-10">
        <div className="relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10">
            <Search className="w-4 h-4 sm:w-5 text-[var(--text-muted)] group-focus-within:text-[var(--accent)] transition-colors drop-shadow-md" />
          </div>
          <input 
            type="text" 
            placeholder="Search interview topics..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-12 sm:h-14 pl-11 sm:pl-14 pr-4 bg-[var(--bg-subtle)] rounded-2xl text-[var(--text-primary)] font-semibold text-base outline-none transition-all shadow-inset-cavity placeholder:text-[var(--text-muted)] placeholder:font-medium border border-[var(--border-inner)] focus:border-[var(--border-strong)]"
          />
        </div>

        <TopicGrid 
          topics={filteredTopics}
          selectedTopics={selectedTopics}
          onToggleTopic={toggleTopic}
        />
      </main>

      {selectedTopics.length > 0 && (
        <div className="fixed bottom-24 left-0 right-0 flex justify-center z-40 pointer-events-none px-4">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="pointer-events-auto bg-[var(--accent)] text-white px-6 py-3 rounded-full shadow-lg shadow-[var(--accent)]/30 font-bold tracking-widest uppercase text-xs flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
          >
            <Play size={14} fill="currentColor" />
            Configure Session ({selectedTopics.length})
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
    <Suspense fallback={<div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center font-mono text-xs uppercase tracking-widest text-[var(--text-muted)]">Loading Config...</div>}>
      <InterviewContent />
    </Suspense>
  );
}
