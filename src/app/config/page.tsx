"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense, useMemo } from "react";
import { ArrowLeft, Minus, Plus } from "lucide-react";
import { getQuestions } from "@/src/lib/data";
import ThemeToggle from "@/src/components/ThemeToggle";

function ConfigContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const subject = searchParams.get("subject") || "";
  const topic = searchParams.get("topic") || "";

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
          <span className="text-sm font-medium capitalize truncate max-w-[150px]">{topic} Configuration</span>
        </div>
        <ThemeToggle />
      </header>

      <main className="max-w-[720px] mx-auto w-full p-4 sm:p-8 space-y-8">
        <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[8px] p-6 shadow-sm space-y-8">

          {/* Question Steppers */}
          <div className="space-y-4">
            <h3 className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Question Limits</h3>
            {(Object.keys(counts) as Array<keyof typeof counts>).map((diff) => (
              <div key={diff} className="flex items-center justify-between">
                <span className="text-sm font-medium">{diff}</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateCount(diff, -1)}
                    className="w-8 h-8 flex items-center justify-center border border-[var(--border)] rounded-[6px] hover:bg-[var(--bg-subtle)] disabled:opacity-30"
                    disabled={counts[diff] <= 0}
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-sm font-medium w-6 text-center">{counts[diff]}</span>
                  <button
                    onClick={() => updateCount(diff, 1)}
                    className="w-8 h-8 flex items-center justify-center border border-[var(--border)] rounded-[6px] hover:bg-[var(--bg-subtle)] disabled:opacity-30"
                    disabled={counts[diff] >= available[diff]}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Difficulty Segmented Control (Optional fallback if they want one diff) */}
          <div className="space-y-4">
            <h3 className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Session Mode</h3>
            <div className="flex bg-[var(--bg-subtle)] p-1 rounded-[6px] gap-1">
              <button
                onClick={() => setMode("flashcard")}
                className={`flex-1 py-1.5 text-xs font-medium rounded-[4px] transition-all ${mode === "flashcard" ? "bg-[var(--bg-surface)] shadow-xs text-[var(--text-primary)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
              >
                Flashcard
              </button>
              <button
                onClick={() => setMode("notes")}
                className={`flex-1 py-1.5 text-xs font-medium rounded-[4px] transition-all ${mode === "notes" ? "bg-[var(--bg-surface)] shadow-xs text-[var(--text-primary)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
              >
                Revision
              </button>
            </div>
          </div>

          {/* Timer Selection */}
          <div className="space-y-4">
            <h3 className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Session Timer</h3>
            <div className="flex items-center gap-4">
              <div className="flex-1 flex items-center gap-3 bg-[var(--bg-subtle)] p-3 rounded-[6px] border border-[var(--border)]">
                <input
                  type="number"
                  min="0"
                  max="120"
                  value={time}
                  onChange={(e) => setTime(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full bg-transparent text-lg font-semibold text-[var(--text-primary)] focus:outline-none"
                />
                <span className="text-xs font-medium text-[var(--text-secondary)] uppercase whitespace-nowrap">Minutes</span>
              </div>
              <button
                onClick={() => setTimerEnabled(!timerEnabled)}
                className={`px-4 h-11 rounded-[6px] text-xs font-bold uppercase tracking-wider transition-all border ${timerEnabled
                    ? "bg-[var(--accent)] text-white border-[var(--accent)]"
                    : "bg-transparent text-[var(--text-muted)] border-[var(--border)]"
                  }`}
              >
                {timerEnabled ? "On" : "Off"}
              </button>
            </div>
            <p className="text-[11px] text-[var(--text-muted)] italic">
              Set to 0 or toggle off for an untimed session.
            </p>
          </div>

          <button
            onClick={startSession}
            disabled={Object.values(counts).reduce((a, b) => a + b, 0) === 0}
            className="w-full h-10 bg-[var(--accent)] text-white text-sm font-medium rounded-[6px] hover:bg-[var(--accent-hover)] transition-all shadow-sm disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Start Session
          </button>
        </div>
      </main>
    </div>
  );
}

export default function ConfigPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center font-mono text-xs uppercase tracking-widest text-[var(--text-muted)]">Loading Config...</div>}>
      <ConfigContent />
    </Suspense>
  );
}
