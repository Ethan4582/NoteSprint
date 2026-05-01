"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface SessionFooterProps {
  currentIndex: number;
  totalQuestions: number;
  mode: "flashcard" | "notes";
  isFlipped: boolean;
  showFeedback: boolean;
  prevQuestion: () => void;
  nextQuestion: () => void;
  setIsFlipped: (flipped: boolean) => void;
  handleAnswer: (success: boolean) => void;
  showAnswer: boolean;
}

export default function SessionFooter({
  currentIndex,
  totalQuestions,
  mode,
  isFlipped,
  showFeedback,
  prevQuestion,
  nextQuestion,
  setIsFlipped,
  handleAnswer,
}: SessionFooterProps) {
  return (
    <footer className="fixed bottom-0 left-0 w-full h-[56px] bg-[var(--bg-surface)] border-t border-[var(--border)] flex items-center justify-between px-4 pb-[env(safe-area-inset-bottom)] z-10">
      <button
        onClick={prevQuestion}
        disabled={currentIndex === 0}
        className="h-8 px-3 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] rounded-[6px] disabled:opacity-30 flex items-center gap-1"
      >
        <ChevronLeft className="w-4 h-4" /> Prev
      </button>

      <div className="text-sm font-medium text-[var(--text-muted)]">
        {currentIndex + 1} / {totalQuestions}
      </div>

      {mode === "flashcard" ? (
        !isFlipped ? (
          <button
            onClick={() => setIsFlipped(true)}
            className="h-8 px-4 bg-[var(--accent)] text-white text-[10px] font-bold uppercase tracking-widest rounded-[6px] hover:bg-[var(--accent-hover)] transition-all shadow-sm active:scale-95"
          >
            Reveal
          </button>
        ) : showFeedback ? (
          <button
            //reduce the button size to match the reveal button
            onClick={nextQuestion}
            className="h-8 px-4 bg-[var(--accent)] text-white text-[10px] font-bold uppercase tracking-widest rounded-[8px] hover:bg-[var(--accent-hover)] transition-all flex items-center gap-2 shadow-md active:scale-95"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-tighter mr-1">
              Mark Progress:
            </span>
            <button
              onClick={() => handleAnswer(false)}
              className="h-9 px-5 bg-[var(--error)]/10 text-[var(--error)] text-[10px] font-bold uppercase tracking-widest rounded-[8px] hover:bg-[var(--error)] hover:text-white transition-all border border-[var(--error)]/20 shadow-sm"
            >
              Incorrect
            </button>
            <button
              onClick={() => handleAnswer(true)}
              className="h-9 px-5 bg-[var(--success)]/10 text-[var(--success)] text-[10px] font-bold uppercase tracking-widest rounded-[8px] hover:bg-[var(--success)] hover:text-white transition-all border border-[var(--success)]/20 shadow-sm"
            >
              Correct
            </button>
          </div>
        )
      ) : (
        <button
          onClick={nextQuestion}
          className="h-9 px-6 bg-[var(--accent)] text-white text-sm font-bold uppercase tracking-widest rounded-[8px] hover:bg-[var(--accent-hover)] transition-all flex items-center gap-2 shadow-md active:scale-95"
        >
          {currentIndex === totalQuestions - 1 ? "Finish Session" : "Next Note"}{" "}
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </footer>
  );
}
