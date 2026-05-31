"use client";

interface ModeToggleProps {
  mode: "flashcard" | "notes";
  setMode: (mode: "flashcard" | "notes") => void;
}

export default function ModeToggle({ mode, setMode }: ModeToggleProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest drop-shadow-md">
        Session Mode
      </h3>
      <div className="flex bg-[var(--bg-subtle)] p-1 rounded-[12px] h-12 border border-[var(--border-strong)] shadow-inset-cavity relative">
        <button
          onClick={() => setMode("flashcard")}
          className={`flex-1 flex items-center justify-center text-[10px] font-black uppercase tracking-widest rounded-[9px] transition-all z-10 ${
            mode === "flashcard"
              ? "bg-raised shadow-raised-crisp text-[var(--accent)] border border-[var(--border-strong)]"
              : "text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-transparent"
          }`}
        >
          Flashcard
        </button>
        <button
          onClick={() => setMode("notes")}
          className={`flex-1 flex items-center justify-center text-[10px] font-black uppercase tracking-widest rounded-[9px] transition-all z-10 ${
            mode === "notes"
              ? "bg-raised shadow-raised-crisp text-[var(--accent)] border border-[var(--border-strong)]"
              : "text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-transparent"
          }`}
        >
          Read
        </button>
      </div>
    </div>
  );
}
