"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense, useMemo, useEffect } from "react";
import { ArrowLeft, BookOpen, Code2, Check, Filter, Trash2, LayoutGrid } from "lucide-react";
import { DATA, getQuestions } from "@/src/lib/data";
import ThemeToggle from "@/src/components/ThemeToggle";
import BottomNav from "@/src/components/BottomNav";

// Practice components
import TimerConfig from "@/src/components/practice/TimerConfig";
import ModeToggle from "@/src/components/practice/ModeToggle";
import { getTechIcon } from "@/src/components/dashboard/TechIcons";

function PracticeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Initial selection from params
  const initialTopic = searchParams.get("topic");

  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [count, setCount] = useState(10);
  const [time, setTime] = useState(5);
  const [mode, setMode] = useState<"flashcard" | "notes">("flashcard");
  const [timerEnabled, setTimerEnabled] = useState(true);
  const [filterQuery, setFilterQuery] = useState("");

  // Populate initial selection
  useEffect(() => {
    if (initialTopic) {
      setSelectedTopics([initialTopic]);
    }
  }, [initialTopic]);

  // All available topics for filtering
  const allAvailableTopics = useMemo(() => {
    return Object.keys(DATA).filter(topic => {
      const qCount = getQuestions([], topic).length;
      return qCount > 0;
    });
  }, []);

  const filteredTopics = useMemo(() => {
    if (!filterQuery) return allAvailableTopics;
    return allAvailableTopics.filter(t => 
      t.toLowerCase().includes(filterQuery.toLowerCase())
    );
  }, [allAvailableTopics, filterQuery]);

  // Calculate total available based on selection
  const totalAvailable = useMemo(() => {
    if (selectedTopics.length === 0) return 0;
    let sum = 0;
    selectedTopics.forEach(topic => {
      sum += getQuestions([], topic).length;
    });
    return sum;
  }, [selectedTopics]);

  useEffect(() => {
    if (count > totalAvailable && totalAvailable > 0) {
      setCount(totalAvailable);
    }
  }, [totalAvailable]);

  const toggleTopic = (topic: string) => {
    setSelectedTopics(prev => {
      if (prev.includes(topic)) {
        return prev.filter(t => t !== topic);
      }
      return [...prev, topic];
    });
  };

  const startSession = () => {
    const topics = selectedTopics.join(",");
    
    const params = new URLSearchParams({
      topic: topics,
      count: count.toString(),
      time: timerEnabled ? time.toString() : "0",
      mode,
    });
    router.push(`/session?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex flex-col pb-32 overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[var(--bg-surface)]/80 backdrop-blur-md border-b border-[var(--border)] px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 hover:bg-[var(--bg-subtle)] rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-sm sm:text-lg font-black uppercase tracking-widest text-[var(--text-primary)]">Practice</h1>
            <p className="text-[9px] font-bold text-[var(--accent)] uppercase tracking-tighter hidden sm:block">Configure your session</p>
          </div>
        </div>
        <ThemeToggle />
      </header>

      <main className="max-w-[1100px] mx-auto w-full p-4 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10">
        
        {/* Left Column: Topic Selection */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <LayoutGrid className="w-4 h-4 text-[var(--accent)]" />
              Topics
              <span className="px-2 py-0.5 bg-[var(--accent-subtle)] text-[var(--accent)] text-[10px] rounded-full">
                {selectedTopics.length}
              </span>
            </h2>
            
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-muted)]" />
              <input 
                type="text" 
                placeholder="Filter topics..."
                value={filterQuery}
                onChange={e => setFilterQuery(e.target.value)}
                className="pl-9 pr-4 py-1.5 bg-[var(--bg-surface)] border border-[var(--border)] rounded-[8px] text-xs focus:border-[var(--accent)] outline-none w-full sm:w-56"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredTopics.map((topic) => {
              const isSelected = selectedTopics.includes(topic);
              const qCount = getQuestions([], topic).length;
              
              return (
                <button
                  key={topic}
                  onClick={() => toggleTopic(topic)}
                  className={`flex items-center justify-between p-3.5 rounded-[12px] border-2 transition-all duration-300 ${
                    isSelected 
                      ? "bg-[var(--bg-surface)] border-[var(--accent)] shadow-sm" 
                      : "bg-[var(--bg-surface)] border-[var(--border)] hover:border-[var(--text-muted)]"
                  }`}
                >
                  <div className="flex items-center gap-3 text-left">
                    <div className={`w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0 ${isSelected ? "bg-[var(--accent-subtle)]" : "bg-[var(--bg-subtle)]"}`}>
                      {getTechIcon(topic)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[var(--text-primary)] leading-tight capitalize">{topic.replace(/_/g, ' ')}</h4>
                      <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-tight">{qCount} Cards</p>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-[var(--accent)] flex items-center justify-center shadow-sm">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {selectedTopics.length > 0 && (
            <button 
              onClick={() => setSelectedTopics([])}
              className="flex items-center gap-1.5 text-[9px] font-bold text-[var(--error)] uppercase tracking-widest hover:opacity-80 transition-all ml-1"
            >
              <Trash2 className="w-3 h-3" /> Clear Selection
            </button>
          )}
        </div>

        {/* Right Column: Configuration Sidebar */}
        <div className="lg:col-span-5 space-y-6">
          <div className="lg:sticky lg:top-24 bg-[var(--bg-surface)] border border-[var(--border)] rounded-[20px] p-6 sm:p-8 shadow-lg space-y-6 sm:space-y-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] border-b border-[var(--border)] pb-3">
              Session Config
            </h3>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">Question Count</label>
              <div className="flex items-center gap-4 bg-[var(--bg-subtle)] px-4 sm:px-5 h-12 sm:h-14 rounded-[12px] border border-[var(--border)] focus-within:border-[var(--accent)] transition-all">
                <input
                  type="number"
                  min="1"
                  max={totalAvailable || 1}
                  value={count}
                  onChange={(e) => setCount(Math.min(totalAvailable, Math.max(1, parseInt(e.target.value) || 1)))}
                  className="w-full bg-transparent text-xl sm:text-2xl font-black text-[var(--text-primary)] focus:outline-none"
                />
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-tighter">Max</span>
                  <span className="px-2 py-0.5 bg-[var(--bg-base)] border border-[var(--border)] rounded-full text-[9px] font-bold text-[var(--accent)]">
                    {totalAvailable}
                  </span>
                </div>
              </div>
            </div>

            <ModeToggle mode={mode} setMode={setMode} />
            <TimerConfig time={time} setTime={setTime} timerEnabled={timerEnabled} setTimerEnabled={setTimerEnabled} />

            <div className="space-y-3">
              <button
                onClick={startSession}
                disabled={selectedTopics.length === 0 || totalAvailable === 0}
                className="w-full h-11 sm:h-12 bg-[var(--accent)] text-white text-[11px] sm:text-xs font-black uppercase tracking-[0.2em] rounded-[12px] hover:bg-[var(--accent-hover)] transition-all shadow-md active:scale-[0.97] disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed"
              >
                Launch Session
              </button>

              {selectedTopics.length === 0 && (
                <p className="text-center text-[9px] font-bold text-[var(--error)] uppercase animate-pulse">
                  Select a topic to start
                </p>
              )}
            </div>
          </div>
        </div>
      </main>

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
