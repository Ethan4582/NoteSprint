"use client";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import ThemeToggle from "@/src/components/ThemeToggle";

interface SessionHeaderProps {
  topic: string;
  timeLeft: number;
  timerEnabled: boolean;
  formatTime: (s: number) => string;
  getTimeColor: () => string;
}

export default function SessionHeader({
  topic,
  timeLeft,
  timerEnabled,
  formatTime,
  getTimeColor,
}: SessionHeaderProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-10 h-12 bg-[var(--bg-surface)] border-b border-[var(--border)] flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <button
          onClick={() => router.back()}
          className="w-8 h-8 flex items-center justify-center hover:bg-[var(--bg-subtle)] rounded-[6px]"
        >
          <X className="w-[18px] h-[18px] text-[var(--text-primary)]" />
        </button>
        <span className="text-sm font-medium capitalize truncate max-w-[120px] sm:max-w-none">
          {topic}
        </span>
      </div>

      {timerEnabled && (
        <div className={`text-base font-mono font-medium ${getTimeColor()}`}>
          {formatTime(timeLeft)}
        </div>
      )}

      <ThemeToggle />
    </header>
  );
}
