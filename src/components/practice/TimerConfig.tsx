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
    <div className="space-y-3">
      <h3 className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">
        Session Timer
      </h3>
      <div className="flex items-center gap-3">
        <div className="flex-1 flex items-center gap-3 bg-[var(--bg-subtle)] px-4 h-11 sm:h-12 rounded-[12px] border border-[var(--border)] focus-within:border-[var(--accent)] transition-all">
          <input
            type="number"
            min="0"
            max="120"
            value={time}
            onChange={(e) => setTime(Math.max(0, parseInt(e.target.value) || 0))}
            className="w-full bg-transparent text-lg font-bold text-[var(--text-primary)] focus:outline-none"
          />
          <span className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-tighter whitespace-nowrap">
            Mins
          </span>
        </div>
        <button
          onClick={() => setTimerEnabled(!timerEnabled)}
          className={`px-4 sm:px-6 h-11 sm:h-12 rounded-[12px] text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
            timerEnabled
              ? "bg-[var(--accent)] text-white border-[var(--accent)] shadow-sm"
              : "bg-transparent text-[var(--text-muted)] border-[var(--border)]"
          }`}
        >
          {timerEnabled ? "On" : "Off"}
        </button>
      </div>
      <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-tighter opacity-70 px-1">
        Set to 0 for an untimed session.
      </p>
    </div>
  );
}
