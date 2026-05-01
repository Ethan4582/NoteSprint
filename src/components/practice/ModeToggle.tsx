"use client";

interface ModeToggleProps {
  mode: "flashcard" | "notes";
  setMode: (mode: "flashcard" | "notes") => void;
}

export default function ModeToggle({ mode, setMode }: ModeToggleProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">
        Session Mode
      </h3>
      <div className="flex bg-[var(--bg-subtle)] p-1 rounded-[12px] h-11 sm:h-12 border border-[var(--border)]">
        <button
          onClick={() => setMode("flashcard")}
          className={`flex-1 flex items-center justify-center text-[10px] font-black uppercase tracking-widest rounded-[9px] transition-all ${
            mode === "flashcard"
              ? "bg-[var(--bg-surface)] shadow-sm text-[var(--text-primary)]"
              : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          }`}
        >
          Flashcard
        </button>
        <button
          onClick={() => setMode("notes")}
          className={`flex-1 flex items-center justify-center text-[10px] font-black uppercase tracking-widest rounded-[9px] transition-all ${
            mode === "notes"
              ? "bg-[var(--bg-surface)] shadow-sm text-[var(--text-primary)]"
              : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          }`}
        >
          Revision
        </button>
      </div>
    </div>
  );
}
