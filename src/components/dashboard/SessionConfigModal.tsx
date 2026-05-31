"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import ModeToggle from "@/src/components/practice/ModeToggle";
import TimerConfig from "@/src/components/practice/TimerConfig";

interface SessionConfigModalProps {
  topic: string;
  totalAvailable: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function SessionConfigModal({ topic, totalAvailable, isOpen, onClose }: SessionConfigModalProps) {
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

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-raised shadow-raised border border-[var(--border-strong)] rounded-2xl p-6 sm:p-8 w-full max-w-sm space-y-6 relative animate-in fade-in zoom-in duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-raised shadow-raised-crisp text-[var(--text-muted)] hover:text-[var(--accent)] active:scale-[0.95] transition-all border border-[var(--border-strong)]"
        >
          <X size={16} />
        </button>

        <div className="space-y-1">
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] flex items-center gap-2 drop-shadow-[0_2px_2px_rgba(0,0,0,1)]">
            <div className="w-1 h-3 bg-[var(--accent)] rounded-sm shadow-[0_0_8px_rgba(255,69,0,0.6)]"></div>
            Session Config
          </h3>
        </div>

        <div className="space-y-6">
          <ModeToggle mode={mode} setMode={setMode} />

          {mode === "flashcard" && (
            <>
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] ml-1 drop-shadow-md">Question Count</label>
                <div className="flex items-center gap-4 bg-[var(--bg-subtle)] px-5 h-14 rounded-xl shadow-inset-cavity transition-all">
                  <input
                    type="number"
                    min="1"
                    max={totalAvailable || 1}
                    value={count}
                    onChange={(e) => setCount(Math.min(totalAvailable, Math.max(1, parseInt(e.target.value) || 1)))}
                    className="w-full bg-transparent text-2xl font-black text-[var(--text-primary)] focus:outline-none drop-shadow-md"
                  />
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[9px] font-black text-[var(--text-muted)] uppercase">Max</span>
                    <span className="px-2.5 py-1 bg-raised shadow-raised-crisp border border-[var(--border-strong)] rounded-md text-[10px] font-bold text-[var(--accent)] drop-shadow-[0_0_5px_rgba(255,69,0,0.3)]">
                      {totalAvailable}
                    </span>
                  </div>
                </div>
              </div>

              <TimerConfig time={time} setTime={setTime} timerEnabled={timerEnabled} setTimerEnabled={setTimerEnabled} />
            </>
          )}
        </div>

        <div className="pt-2">
          <button
            onClick={startSession}
            disabled={totalAvailable === 0 || (mode === "notes" && topic.includes(","))}
            className="w-full h-12 bg-raised shadow-raised border border-[var(--border-strong)] text-[var(--accent)] text-[11px] font-black uppercase tracking-[0.2em] rounded-xl hover:text-[var(--accent-hover)] transition-all active:scale-[0.97] disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed drop-shadow-[0_0_8px_rgba(255,69,0,0.3)] flex items-center justify-center"
          >
            {mode === "notes" ? "Read Notes" : "Launch Session"}
          </button>
          {mode === "notes" && topic.includes(",") && (
            <p className="text-[10px] text-[var(--error)] text-center mt-3 font-bold uppercase tracking-widest drop-shadow-md">
              Please select only 1 topic to read notes.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
