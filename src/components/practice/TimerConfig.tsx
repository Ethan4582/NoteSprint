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
      <h3 className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest drop-shadow-md">
        Session Timer
      </h3>
      <div className="flex items-center gap-3">
        <div className="flex-1 flex items-center gap-3 bg-[var(--bg-subtle)] px-4 h-12 rounded-xl shadow-inset-cavity transition-all">
          <input
            type="number"
            min="0"
            max="120"
            value={time}
            onChange={(e) => setTime(Math.max(0, parseInt(e.target.value) || 0))}
            className="w-full bg-transparent text-lg font-bold text-[var(--text-primary)] focus:outline-none drop-shadow-md"
          />
          <span className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-tighter whitespace-nowrap drop-shadow-md">
            Mins
          </span>
        </div>
        <button
          onClick={() => setTimerEnabled(!timerEnabled)}
          className={`px-4 sm:px-6 h-12 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all z-10 ${
            timerEnabled
              ? "bg-raised shadow-raised-crisp text-[var(--accent)] border border-[var(--border-strong)]"
              : "bg-transparent shadow-inset-cavity text-[var(--text-muted)] border border-transparent"
          }`}
        >
          {timerEnabled ? "On" : "Off"}
        </button>
      </div>
      <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-tighter opacity-70 px-1 drop-shadow-md">
        Set to 0 for an untimed session.
      </p>
    </div>
  );
}
