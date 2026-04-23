"use client";

import { Question } from "@/src/lib/data";

interface FlashcardAnswerProps {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  showFeedback: boolean;
  handleAnswer: (success: boolean) => void;
  setActiveImage: (img: string) => void;
}

export default function FlashcardAnswer({
  question,
  currentIndex,
  totalQuestions,
  showFeedback,
  handleAnswer,
  setActiveImage,
}: FlashcardAnswerProps) {
  return (
    <div className="w-full max-w-[800px] bg-transparent space-y-6 px-2">
      <div className="space-y-6">
        <div className="flex justify-between items-start mb-2">
          <span
            className={`text-[10px] font-semibold uppercase tracking-widest px-2 py-1 rounded-[6px] ${
              question.difficulty === "Basic"
                ? "bg-[#DCFCE7] text-[#15803D]"
                : question.difficulty === "Medium"
                ? "bg-[#FEF3C7] text-[#B45309]"
                : "bg-[#FEE2E2] text-[#B91C1C]"
            }`}
          >
            {question.difficulty}
          </span>
          <span className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest bg-[var(--bg-subtle)] px-2 py-1 rounded-[6px]">
            Question {currentIndex + 1} / {totalQuestions}
          </span>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg sm:text-xl font-bold text-[var(--text-secondary)] leading-tight tracking-tight border-l-2 border-[var(--accent)] pl-4">
            {question.question}
          </h2>
          <div className="h-px bg-[var(--border)] w-full opacity-50" />
          <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">
            Explanation
          </h3>
          <p className="text-base sm:text-lg text-[var(--text-primary)] leading-relaxed">
            {question.answer}
          </p>
        </div>

        {question.code && (
          <div className="space-y-2">
            <h3 className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-widest">
              Code Implementation
            </h3>
            <pre className="bg-[var(--bg-subtle)] p-4 rounded-[8px] text-[13px] border border-[var(--border)] font-mono overflow-x-auto text-[var(--text-primary)]">
              <code>{question.code}</code>
            </pre>
          </div>
        )}

        {(question.image || question.image2) && (
          <div className="space-y-3">
            <h3 className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-widest">
              Reference Visuals
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {question.image && (
                <div
                  onClick={() => setActiveImage(question.image!)}
                  className="rounded-[8px] border border-[var(--border)] overflow-hidden bg-[var(--bg-base)] cursor-zoom-in hover:opacity-90 transition-opacity"
                >
                  <img src={question.image} className="w-full h-auto" alt="Ref 1" />
                </div>
              )}
              {question.image2 && (
                <div
                  onClick={() => setActiveImage(question.image2!)}
                  className="rounded-[8px] border border-[var(--border)] overflow-hidden bg-[var(--bg-base)] cursor-zoom-in hover:opacity-90 transition-opacity"
                >
                  <img src={question.image2} className="w-full h-auto" alt="Ref 2" />
                </div>
              )}
            </div>
          </div>
        )}

        {!showFeedback && (
          <div className="pt-6 border-t border-[var(--border)] space-y-4">
            <p className="text-center font-semibold text-[var(--text-primary)] uppercase tracking-widest text-[11px]">
              Rate your recall
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleAnswer(false)}
                className="flex-1 h-10 bg-[var(--bg-subtle)] text-[var(--error)] text-sm font-semibold rounded-[8px] hover:bg-[var(--error)] hover:text-white transition-all active:scale-95 border border-[var(--border)]"
              >
                FAILURE
              </button>
              <button
                onClick={() => handleAnswer(true)}
                className="flex-1 h-10 bg-[var(--accent)] text-white text-sm font-semibold rounded-[8px] hover:bg-[var(--accent-hover)] transition-all active:scale-95 shadow-sm"
              >
                MASTERED
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
