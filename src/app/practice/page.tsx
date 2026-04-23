"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense, useMemo } from "react";
import { ArrowLeft } from "lucide-react";
import { getQuestions } from "@/src/lib/data";
import ThemeToggle from "@/src/components/ThemeToggle";

// Practice components
import QuestionStepper from "@/src/components/practice/QuestionStepper";
import TimerConfig from "@/src/components/practice/TimerConfig";
import ModeToggle from "@/src/components/practice/ModeToggle";

function PracticeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const subject = searchParams.get("subject") || "all";
  const topic = searchParams.get("topic") || "all";

  const allQuestions = useMemo(() => getQuestions(subject, topic), [subject, topic]);

  const available = useMemo(() => ({
    Basic: allQuestions.filter(q => q.difficulty === "Basic").length,
    Medium: allQuestions.filter(q => q.difficulty === "Medium").length,
    Hard: allQuestions.filter(q => q.difficulty === "Hard").length,
  }), [allQuestions]);

  const [counts, setCounts] = useState({
    Basic: Math.min(5, available.Basic),
    Medium: Math.min(0, available.Medium),
    Hard: Math.min(0, available.Hard),
  });

  const [time, setTime] = useState(5);
  const [mode, setMode] = useState<"flashcard" | "notes">("flashcard");
  const [timerEnabled, setTimerEnabled] = useState(true);

  const startSession = () => {
    const params = new URLSearchParams({
      subject,
      topic,
      basic: counts.Basic.toString(),
      medium: counts.Medium.toString(),
      hard: counts.Hard.toString(),
      time: timerEnabled ? time.toString() : "0",
      mode,
    });
    router.push(`/session?${params.toString()}`);
  };

  const updateCount = (diff: keyof typeof counts, delta: number) => {
    setCounts(prev => ({
      ...prev,
      [diff]: Math.max(0, Math.min(available[diff], prev[diff] + delta))
    }));
  };

  const totalSelected = Object.values(counts).reduce((a, b) => a + b, 0);

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
        <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[12px] p-6 shadow-sm space-y-8">
          
          <div className="space-y-4">
            <h3 className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
              Question Limits
            </h3>
            {(Object.keys(counts) as Array<keyof typeof counts>).map((diff) => (
              <QuestionStepper
                key={diff}
                label={diff}
                count={counts[diff]}
                available={available[diff]}
                onUpdate={(delta) => updateCount(diff, delta)}
              />
            ))}
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
            disabled={totalSelected === 0}
            className="w-full h-10 bg-[var(--accent)] text-white text-sm font-medium rounded-[8px] hover:bg-[var(--accent-hover)] transition-all shadow-sm disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Start Session
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
