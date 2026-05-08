"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense, useMemo, useEffect } from "react";
import { DATA, getQuestions } from "@/src/lib/data";
import BottomNav from "@/src/components/BottomNav";

// Interview components
import InterviewHeader from "@/src/components/interview/InterviewHeader";
import TopicSelector from "@/src/components/practice/TopicSelector";
import InterviewSidebar from "@/src/components/interview/InterviewSidebar";

function InterviewContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const initialTopic = searchParams.get("topic");

  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [count, setCount] = useState(10);
  const [time, setTime] = useState(5);
  const [timerEnabled, setTimerEnabled] = useState(true);
  const [filterQuery, setFilterQuery] = useState("");

  useEffect(() => {
    if (initialTopic) setSelectedTopics([initialTopic]);
  }, [initialTopic]);

  const allAvailableTopics = useMemo(() => {
    return Object.keys(DATA)
      .filter(topic => topic.startsWith("interview_"))
      .map((topic) => ({ topic, count: getQuestions([], topic).length }))
      .filter((t) => t.count > 0)
      .sort((a, b) => b.count - a.count)
      .map((t) => t.topic);
  }, []);

  const filteredTopics = useMemo(() => {
    if (!filterQuery) return allAvailableTopics;
    return allAvailableTopics.filter(t => t.toLowerCase().includes(filterQuery.toLowerCase()));
  }, [allAvailableTopics, filterQuery]);

  const totalAvailable = useMemo(() => {
    return selectedTopics.reduce((sum, topic) => sum + getQuestions([], topic).length, 0);
  }, [selectedTopics]);

  useEffect(() => {
    if (count > totalAvailable && totalAvailable > 0) setCount(totalAvailable);
  }, [totalAvailable]);

  const toggleTopic = (topic: string) => {
    setSelectedTopics(prev => prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]);
  };

  const startSession = () => {
    const params = new URLSearchParams({
      topic: selectedTopics.join(","),
      count: count.toString(),
      time: timerEnabled ? time.toString() : "0",
      mode: "flashcard",
    });
    router.push(`/session?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex flex-col pb-32 overflow-x-hidden">
      <InterviewHeader />

      <main className="max-w-[1600px] mx-auto w-full p-4 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10">
        <TopicSelector 
          filteredTopics={filteredTopics}
          selectedTopics={selectedTopics}
          toggleTopic={toggleTopic}
          setSelectedTopics={setSelectedTopics}
          filterQuery={filterQuery}
          setFilterQuery={setFilterQuery}
        />

        <InterviewSidebar 
          totalAvailable={totalAvailable}
          count={count}
          setCount={setCount}
          time={time}
          setTime={setTime}
          timerEnabled={timerEnabled}
          setTimerEnabled={setTimerEnabled}
          startSession={startSession}
          selectedTopicsCount={selectedTopics.length}
        />
      </main>

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
