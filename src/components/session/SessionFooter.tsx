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
            className="h-8 px-6 bg-[var(--accent)] text-white text-sm font-medium rounded-[6px] hover:bg-[var(--accent-hover)] transition-all shadow-sm"
          >
            Reveal
          </button>
        ) : showFeedback ? (
          <button
            onClick={nextQuestion}
            className="h-8 px-4 bg-[var(--accent)] text-white text-sm font-medium rounded-[6px] hover:bg-[var(--accent-hover)] transition-all flex items-center gap-1 shadow-sm"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => handleAnswer(false)}
              className="h-8 px-3 border border-[var(--error)] text-[var(--error)] text-xs font-medium rounded-[6px] hover:bg-[var(--bg-subtle)]"
            >
              No
            </button>
            <button
              onClick={() => handleAnswer(true)}
              className="h-8 px-3 border border-[var(--success)] text-[var(--success)] text-xs font-medium rounded-[6px] hover:bg-[var(--bg-subtle)]"
            >
              Yes
            </button>
          </div>
        )
      ) : (
        <button
          onClick={nextQuestion}
          className="h-8 px-4 bg-[var(--accent)] text-white text-sm font-medium rounded-[6px] hover:bg-[var(--accent-hover)] transition-all flex items-center gap-1 shadow-sm"
        >
          {currentIndex === totalQuestions - 1 ? "Finish" : "Next"}{" "}
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </footer>
  );
}
