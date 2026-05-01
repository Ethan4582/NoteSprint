"use client";

import { LogOut } from "lucide-react";
import ThemeToggle from "@/src/components/ThemeToggle";

interface SessionHeaderProps {
  topic: string;
  timeLeft: number;
  timerEnabled: boolean;
  formatTime: (s: number) => string;
  getTimeColor: () => string;
  onEndSession: () => void;
}

export default function SessionHeader({
  topic,
  timeLeft,
  timerEnabled,
  formatTime,
  getTimeColor,
  onEndSession,
}: SessionHeaderProps) {
  return (
    <header className="sticky top-0 z-10 h-14 bg-[var(--bg-surface)] border-b border-[var(--border)] flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-4">
        <span className="text-sm font-bold capitalize truncate text-[var(--text-primary)]">
          {topic}
        </span>
      </div>

      {timerEnabled && (
        <div className={`text-sm font-mono font-bold tracking-widest ${getTimeColor()}`}>
          {formatTime(timeLeft)}
        </div>
      )}

      <div className="flex items-center gap-3">
        <ThemeToggle />
        <button
          onClick={onEndSession}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--error)]/10 text-[var(--error)] rounded-[6px] hover:bg-[var(--error)] hover:text-white transition-all text-xs font-bold uppercase tracking-widest"
        >
          <LogOut className="w-3 h-3" />
          <span className="hidden sm:inline">End Session</span>
        </button>
      </div>
    </header>
  );
}
