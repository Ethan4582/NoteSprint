"use client";

interface KeyboardHintsProps {
  mode: "flashcard" | "notes";
  isFlipped: boolean;
  showFeedback: boolean;
}

export default function KeyboardHints({
  mode,
  isFlipped,
  showFeedback,
}: KeyboardHintsProps) {
  return (
    <div className="hidden md:flex fixed bottom-24 left-0 w-full justify-center gap-6 text-[11px] text-[var(--text-muted)] pointer-events-none">
      <div className="flex items-center gap-1.5">
        <kbd className="border border-[var(--border)] rounded-[3px] px-1.5 py-0.5 font-mono bg-[var(--bg-surface)] shadow-xs">
          Space
        </kbd>{" "}
        {mode === "flashcard" ? "flip" : "answer"}
      </div>
      <div className="flex items-center gap-1.5">
        <kbd className="border border-[var(--border)] rounded-[3px] px-1.5 py-0.5 font-mono bg-[var(--bg-surface)] shadow-xs">
          →
        </kbd>{" "}
        next
      </div>
      <div className="flex items-center gap-1.5">
        <kbd className="border border-[var(--border)] rounded-[3px] px-1.5 py-0.5 font-mono bg-[var(--bg-surface)] shadow-xs">
          ←
        </kbd>{" "}
        prev
      </div>
      {mode === "flashcard" && isFlipped && !showFeedback && (
        <>
          <div className="flex items-center gap-1.5">
            <kbd className="border border-[var(--border)] rounded-[3px] px-1.5 py-0.5 font-mono bg-[var(--bg-surface)] shadow-xs">
              Y
            </kbd>{" "}
            yes
          </div>
          <div className="flex items-center gap-1.5">
            <kbd className="border border-[var(--border)] rounded-[3px] px-1.5 py-0.5 font-mono bg-[var(--bg-surface)] shadow-xs">
              N
            </kbd>{" "}
            no
          </div>
        </>
      )}
    </div>
  );
}
