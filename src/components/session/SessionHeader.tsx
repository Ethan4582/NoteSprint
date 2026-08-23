"use client";

import { LogOut } from "lucide-react";

interface SessionHeaderProps {
  topic: string;
  timeLeft: number;
  timerEnabled: boolean;
  formatTime: (s: number) => string;
  getTimeColor: () => string;
  onEndSession: () => void;
}

export default function SessionHeader({ topic, timeLeft, timerEnabled, formatTime, getTimeColor, onEndSession }: SessionHeaderProps) {
  return (
    <header className="sticky top-0 z-10 h-14 bg-white/90 backdrop-blur-xl border-b border-[var(--border)] flex items-center justify-between px-4 sm:px-6">
      <span className="text-sm font-bold capitalize truncate text-[var(--text-primary)] max-w-[40vw] sm:max-w-none">{topic}</span>
      {timerEnabled && <div className={`text-sm font-mono font-bold tracking-widest ${getTimeColor()}`}>{formatTime(timeLeft)}</div>}
      <button onClick={onEndSession} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[var(--border)] rounded-full hover:bg-[var(--error-subtle)] hover:border-rose-200 hover:text-rose-600 text-xs font-bold text-[var(--text-secondary)] transition-colors">
        <LogOut className="w-3 h-3" /> <span className="hidden sm:inline">End</span>
      </button>
    </header>
  );
}
