"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense, useMemo, useEffect } from "react";
import { DATA, getQuestions } from "@/src/lib/data";
import BottomNav from "@/src/components/BottomNav";
import { Play } from "lucide-react";

// Interview components
import InterviewHeader from "@/src/components/interview/InterviewHeader";
import TopicGrid from "@/src/components/dashboard/TopicGrid";
import SessionConfigModal from "@/src/components/dashboard/SessionConfigModal";

function InterviewContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const initialTopic = searchParams.get("topic");

  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (initialTopic) setSelectedTopics([initialTopic]);
  }, [initialTopic]);

  const allAvailableTopics = useMemo(() => {
    return Object.keys(DATA)
      .filter(topic => topic.startsWith("interview_"))
      .map((topic) => ({ topic, count: getQuestions([], topic).length }))
      .filter((t) => t.count > 0)
      .sort((a, b) => b.count - a.count)
      .map((t) => ({ topic: t.topic }));
  }, []);

  const toggleTopic = (topic: string) => {
    setSelectedTopics(prev => prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]);
  };

  const totalSelectedQuestions = selectedTopics.reduce((sum, topic) => {
    return sum + getQuestions([], topic).length;
  }, 0);

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex flex-col pb-32 overflow-x-hidden relative">
      <InterviewHeader />

      <main className="max-w-[1600px] mx-auto w-full p-4 sm:p-10 space-y-8 sm:space-y-10">
        <TopicGrid 
          topics={allAvailableTopics}
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
