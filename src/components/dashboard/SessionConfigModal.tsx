"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Play, BookOpen } from "lucide-react";
import ModeToggle from "@/src/components/practice/ModeToggle";
import TimerConfig from "@/src/components/practice/TimerConfig";

interface SessionConfigModalProps {
  topic: string;
  totalAvailable: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function SessionConfigModal({
  topic,
  totalAvailable,
  isOpen,
  onClose,
}: SessionConfigModalProps) {
  const router = useRouter();
  const [count, setCount] = useState(totalAvailable);
  const [time, setTime] = useState(5);
  const [mode, setMode] = useState<"flashcard" | "notes">("flashcard");
  const [timerEnabled, setTimerEnabled] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setCount(totalAvailable);
    }
  }, [isOpen, totalAvailable]);

  if (!isOpen) return null;

  const startSession = () => {
    if (mode === "notes") {
      router.push(`/preview/${topic}`);
    } else {
      const params = new URLSearchParams({
        topic,
        count: count.toString(),
        time: timerEnabled ? time.toString() : "0",
        mode,
      });
      router.push(`/session?${params.toString()}`);
    }
  };

  const formattedTopic = topic.replace(/interview_/g, "").replace(/_/g, " ");

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-[var(--border)] rounded-lg p-6 sm:p-8 w-full max-w-sm space-y-6 relative shadow-2xl animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-md bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all"
        >
          <X size={16} />
        </button>

        <div className="space-y-1 pr-8">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--accent)]">
            Configure Deck
          </span>
          <h2 className="text-xl font-bold capitalize tracking-tight text-[var(--text-primary)] truncate">
            {formattedTopic}
          </h2>
        </div>

        <div className="space-y-5">
          <ModeToggle mode={mode} setMode={setMode} />

          {mode === "flashcard" && (
            <>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                    Question Count
                  </label>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[var(--bg-subtle)] text-[var(--text-secondary)] font-mono">
                    Max {totalAvailable}
                  </span>
                </div>
                <div className="flex items-center gap-3 bg-[var(--bg-subtle)] px-4 h-12 rounded-md border border-[var(--border)]">
                  <input
                    type="number"
                    min="1"
                    max={totalAvailable || 1}
                    value={count}
                    onChange={(e) =>
                      setCount(Math.min(totalAvailable, Math.max(1, parseInt(e.target.value) || 1)))
                    }
                    className="w-full bg-transparent text-base font-bold text-[var(--text-primary)] focus:outline-none font-mono"
                  />
                  <span className="text-xs font-bold text-[var(--text-muted)] uppercase">
                    Cards
                  </span>
                </div>
              </div>

              <TimerConfig
                time={time}
                setTime={setTime}
                timerEnabled={timerEnabled}
                setTimerEnabled={setTimerEnabled}
              />
            </>
          )}
        </div>

        <div className="pt-2">
          <button
            onClick={startSession}
            disabled={totalAvailable === 0 || (mode === "notes" && topic.includes(","))}
            className="w-full py-3.5 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs font-bold uppercase tracking-wider rounded-md transition-all shadow-md active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {mode === "notes" ? (
              <>
                <BookOpen size={14} />
                <span>Read Notes Overview</span>
              </>
            ) : (
              <>
                <Play size={14} fill="currentColor" />
                <span>Launch Practice Session</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
