"use client";

interface ModeToggleProps {
  mode: "flashcard" | "notes";
  setMode: (mode: "flashcard" | "notes") => void;
}

export default function ModeToggle({ mode, setMode }: ModeToggleProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
        Session Mode
      </h3>
      <div className="flex bg-[var(--bg-subtle)] p-1 rounded-[6px] gap-1">
        <button
          onClick={() => setMode("flashcard")}
          className={`flex-1 py-1.5 text-xs font-medium rounded-[4px] transition-all ${
            mode === "flashcard"
              ? "bg-[var(--bg-surface)] shadow-xs text-[var(--text-primary)]"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          }`}
        >
          Flashcard
        </button>
        <button
          onClick={() => setMode("notes")}
          className={`flex-1 py-1.5 text-xs font-medium rounded-[4px] transition-all ${
            mode === "notes"
              ? "bg-[var(--bg-surface)] shadow-xs text-[var(--text-primary)]"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          }`}
        >
          Revision
        </button>
      </div>
    </div>
  );
}
