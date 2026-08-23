"use client";

interface TimerConfigProps {
  time: number;
  setTime: (time: number) => void;
  timerEnabled: boolean;
  setTimerEnabled: (enabled: boolean) => void;
}

export default function TimerConfig({
  time,
  setTime,
  timerEnabled,
  setTimerEnabled,
}: TimerConfigProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider block">
          Session Timer
        </label>
        <button
          type="button"
          onClick={() => setTimerEnabled(!timerEnabled)}
          className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
            timerEnabled
              ? "bg-[var(--accent-subtle)] text-[var(--accent)] border border-[var(--accent)]/20"
              : "bg-[var(--bg-subtle)] text-[var(--text-muted)] border border-[var(--border)]"
          }`}
        >
          {timerEnabled ? "Timer Enabled" : "Untimed"}
        </button>
      </div>

      {timerEnabled && (
        <div className="flex items-center gap-3 bg-[var(--bg-subtle)] px-4 h-12 rounded-2xl border border-[var(--border)]">
          <input
            type="number"
            min="1"
            max="120"
            value={time}
            onChange={(e) => setTime(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full bg-transparent text-base font-bold text-[var(--text-primary)] focus:outline-none font-mono"
          />
          <span className="text-xs font-bold text-[var(--text-muted)] uppercase">
            Minutes
          </span>
        </div>
      )}
    </div>
  );
}
