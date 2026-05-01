"use client";

import TimerConfig from "./TimerConfig";
import ModeToggle from "./ModeToggle";

interface PracticeSidebarProps {
  totalAvailable: number;
  count: number;
  setCount: (val: number) => void;
  mode: "flashcard" | "notes";
  setMode: (val: "flashcard" | "notes") => void;
  time: number;
  setTime: (val: number) => void;
  timerEnabled: boolean;
  setTimerEnabled: (val: boolean) => void;
  startSession: () => void;
  selectedTopicsCount: number;
}

export default function PracticeSidebar({
  totalAvailable,
  count,
  setCount,
  mode,
  setMode,
  time,
  setTime,
  timerEnabled,
  setTimerEnabled,
  startSession,
  selectedTopicsCount,
}: PracticeSidebarProps) {
  return (
    <div className="lg:col-span-5 xl:col-span-4 2xl:col-span-3">
      <div className="lg:sticky lg:top-24 bg-[var(--bg-surface)] border border-[var(--border)] rounded-[24px] p-6 sm:p-8 shadow-xl space-y-8">
        <div className="space-y-1">
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] flex items-center gap-2">
            <div className="w-1 h-3 bg-[var(--accent)] rounded-full"></div>
            Session Config
          </h3>
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] ml-1">Question Count</label>
          <div className="flex items-center gap-4 bg-[var(--bg-subtle)] px-5 h-14 rounded-[16px] border-2 border-[var(--border)] focus-within:border-[var(--accent)] transition-all shadow-inner">
            <input
              type="number"
              min="1"
              max={totalAvailable || 1}
              value={count}
              onChange={(e) => setCount(Math.min(totalAvailable, Math.max(1, parseInt(e.target.value) || 1)))}
              className="w-full bg-transparent text-2xl font-black text-[var(--text-primary)] focus:outline-none"
            />
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[9px] font-black text-[var(--text-muted)] uppercase">Max</span>
              <span className="px-2.5 py-1 bg-[var(--bg-base)] border border-[var(--border)] rounded-lg text-[10px] font-bold text-[var(--accent)]">
                {totalAvailable}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <ModeToggle mode={mode} setMode={setMode} />
          <TimerConfig time={time} setTime={setTime} timerEnabled={timerEnabled} setTimerEnabled={setTimerEnabled} />
        </div>

        <div className="pt-4 space-y-4 flex flex-col items-center border-t border-[var(--border)]">
          <button
            onClick={startSession}
            disabled={selectedTopicsCount === 0 || totalAvailable === 0}
            className="w-full h-12 bg-[var(--accent)] text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-[14px] hover:bg-[var(--accent-hover)] transition-all shadow-lg hover:shadow-[var(--accent)]/20 active:scale-[0.97] disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed"
          >
            Launch Session
          </button>

          {selectedTopicsCount === 0 && (
            <p className="text-[10px] font-bold text-[var(--error)] uppercase tracking-tighter animate-pulse text-center">
              Select at least one topic to start session
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
