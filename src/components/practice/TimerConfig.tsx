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
    <div className="space-y-4">
      <h3 className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
        Session Timer
      </h3>
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
          <span className="text-xs font-medium text-[var(--text-secondary)] uppercase whitespace-nowrap">
            Minutes
          </span>
        </div>
        <button
          onClick={() => setTimerEnabled(!timerEnabled)}
          className={`px-4 h-11 rounded-[6px] text-xs font-bold uppercase tracking-wider transition-all border ${
            timerEnabled
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
  );
}
