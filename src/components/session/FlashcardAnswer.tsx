"use client";

import { Question } from "@/src/lib/data";
import ContentRenderer from "@/src/components/ContentRenderer";

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
    <div className="w-full max-w-[800px] bg-transparent pb-10">
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-4 px-2">
          {question.category && (
            <span className="text-[10px] font-bold text-[var(--accent)] uppercase tracking-[0.2em] bg-[var(--accent)]/10 px-3 py-1 rounded-full border border-[var(--accent)]/20">
              {question.category}
            </span>
          )}
          <span className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest bg-[var(--bg-subtle)] px-2 py-1 rounded-[6px] ml-auto">
            Question {currentIndex + 1} / {totalQuestions}
          </span>
        </div>

        <div className="space-y-6 px-2">
          <div className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] leading-tight tracking-tight">
              {question.question}
            </h2>
            <div className="h-1 w-12 bg-[var(--accent)] rounded-full" />
          </div>

          <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[16px] p-5 sm:p-8 shadow-sm">
            <ContentRenderer
              content={question.answer}
              code={question.code}
              image={question.image}
              image2={question.image2}
              onImageClick={setActiveImage}
            />
          </div>
        </div>

        {!showFeedback && (
          <div className="pt-8 px-2 space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-px bg-[var(--border)] flex-1" />
              <p className="font-bold text-[var(--text-muted)] uppercase tracking-[0.15em] text-[10px]">
                Rate your recall
              </p>
              <div className="h-px bg-[var(--border)] flex-1" />
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => handleAnswer(false)}
                className="flex-1 h-12 bg-[var(--bg-surface)] text-[var(--error)] text-xs font-bold uppercase tracking-widest rounded-[12px] hover:bg-[var(--error)] hover:text-white transition-all active:scale-[0.98] border border-[var(--border)] shadow-sm"
              >
                Failed
              </button>
              <button
                onClick={() => handleAnswer(true)}
                className="flex-1 h-12 bg-[var(--accent)] text-white text-xs font-bold uppercase tracking-widest rounded-[12px] hover:bg-[var(--accent-hover)] transition-all active:scale-[0.98] shadow-sm"
              >
                Mastered
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
