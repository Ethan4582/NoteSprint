"use client";

interface ModeToggleProps {
  mode: "flashcard" | "notes";
  setMode: (mode: "flashcard" | "notes") => void;
}

export default function ModeToggle({ mode, setMode }: ModeToggleProps) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider block">
        Session Mode
      </label>
      <div className="flex bg-[var(--bg-subtle)] p-1 rounded-2xl border border-[var(--border)] relative">
        <button
          type="button"
          onClick={() => setMode("flashcard")}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            mode === "flashcard"
              ? "bg-white text-[var(--text-primary)] shadow-xs"
              : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          }`}
        >
          Flashcard Drill
        </button>
        <button
          type="button"
          onClick={() => setMode("notes")}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            mode === "notes"
              ? "bg-white text-[var(--text-primary)] shadow-xs"
              : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          }`}
        >
          Read Overview
        </button>
      </div>
    </div>
  );
}
