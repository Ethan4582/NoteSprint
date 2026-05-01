"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense, useMemo } from "react";
import { ArrowLeft, BookOpen, Code2 } from "lucide-react";
import { getQuestions } from "@/src/lib/data";
import ThemeToggle from "@/src/components/ThemeToggle";

// Practice components
import TimerConfig from "@/src/components/practice/TimerConfig";
import ModeToggle from "@/src/components/practice/ModeToggle";

function PracticeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const subject = searchParams.get("subject") || "all";
  const topic = searchParams.get("topic") || "all";

  const allQuestions = useMemo(() => getQuestions(subject, topic), [subject, topic]);
  const totalAvailable = allQuestions.length;

  const categories = useMemo(() => {
    const counts: Record<string, number> = {};
    allQuestions.forEach(q => {
      if (q.category) {
        counts[q.category] = (counts[q.category] || 0) + 1;
      }
    });
    return Object.keys(counts).length > 0 ? counts : null;
  }, [allQuestions]);

  const [count, setCount] = useState(Math.min(10, totalAvailable));
  const [time, setTime] = useState(5);
  const [mode, setMode] = useState<"flashcard" | "notes">("flashcard");
  const [timerEnabled, setTimerEnabled] = useState(true);

  const startSession = () => {
    const params = new URLSearchParams({
      subject,
      topic,
      count: count.toString(),
      time: timerEnabled ? time.toString() : "0",
      mode,
    });
    router.push(`/session?${params.toString()}`);
  };

  const handleCountChange = (val: string) => {
    const num = parseInt(val) || 0;
    setCount(Math.min(totalAvailable, Math.max(0, num)));
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex flex-col">
      <header className="sticky top-0 z-10 h-12 bg-[var(--bg-surface)] border-b border-[var(--border)] flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.back()}
            className="w-8 h-8 flex items-center justify-center hover:bg-[var(--bg-subtle)] rounded-[6px]"
          >
            <ArrowLeft className="w-[18px] h-[18px]" />
          </button>
          <span className="text-sm font-medium capitalize truncate max-w-[150px]">
            {topic === "all" ? "Random Practice" : topic}
          </span>
        </div>
        <ThemeToggle />
      </header>

      <main className="max-w-[720px] mx-auto w-full p-4 sm:p-8 space-y-8">
        <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[16px] p-6 shadow-md space-y-8">
          
          <div className="space-y-6">
            <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-[0.2em]">
              Session Configuration
            </h3>

            {categories && (
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(categories).map(([cat, num]) => (
                  <div key={cat} className="bg-[var(--bg-subtle)] p-4 rounded-[12px] border border-[var(--border)] flex flex-col gap-1 items-center text-center">
                    {cat.toLowerCase() === 'theory' ? <BookOpen className="w-4 h-4 text-[var(--accent)] mb-1" /> : <Code2 className="w-4 h-4 text-[var(--accent)] mb-1" />}
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">{cat}</span>
                    <span className="text-lg font-bold text-[var(--text-primary)]">{num}</span>
                  </div>
                ))}
              </div>
            )}
            
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)]">Question Pool</label>
              <div className="flex items-center gap-4 bg-[var(--bg-subtle)] p-4 rounded-[12px] border border-[var(--border)] focus-within:border-[var(--accent)] transition-all">
                <input
                  type="number"
                  min="0"
                  max={totalAvailable}
                  value={count}
                  onChange={(e) => handleCountChange(e.target.value)}
                  className="w-full bg-transparent text-2xl font-bold text-[var(--text-primary)] focus:outline-none"
                />
                <div className="text-right">
                  <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-tighter block whitespace-nowrap">
                    Total Available
                  </span>
                  <span className="text-sm font-bold text-[var(--accent)]">
                    {totalAvailable}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <ModeToggle mode={mode} setMode={setMode} />

          <TimerConfig
            time={time}
            setTime={setTime}
            timerEnabled={timerEnabled}
            setTimerEnabled={setTimerEnabled}
          />

          <button
            onClick={startSession}
            disabled={count === 0}
            className="w-full h-12 bg-[var(--accent)] text-white text-sm font-bold uppercase tracking-[0.1em] rounded-[12px] hover:bg-[var(--accent-hover)] transition-all shadow-lg active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Launch Session
          </button>
        </div>
      </main>
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
