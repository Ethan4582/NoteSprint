"use client";

import { Question } from "@/src/lib/data";
import { ChevronRight } from "lucide-react";
import ContentRenderer from "@/src/components/ContentRenderer";

interface RevisionViewProps {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  showAnswer: boolean;
  setShowAnswer: (show: boolean) => void;
  setActiveImage: (img: string) => void;
}

export default function RevisionView({
  question,
  currentIndex,
  totalQuestions,
  showAnswer,
  setShowAnswer,
  setActiveImage,
}: RevisionViewProps) {
  return (
    <div className="w-full max-w-[800px] space-y-8 pb-20">
      <div className="flex justify-between items-center mb-2 px-2">
        {question.category && (
          <span className="text-[10px] font-bold text-[var(--accent)] uppercase tracking-[0.2em] bg-[var(--accent)]/10 px-3 py-1 rounded-full border border-[var(--accent)]/20">
            {question.category}
          </span>
        )}
        <span className="text-sm text-[var(--text-muted)] font-medium bg-[var(--bg-subtle)] px-2 py-0.5 rounded-[4px] ml-auto">
          Q {currentIndex + 1} / {totalQuestions}
        </span>
      </div>

      <div className="px-2">
        <h2 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] leading-snug tracking-tight">
          {question.question}
        </h2>
      </div>

      <div className="space-y-6 px-2">
        <button
          onClick={() => setShowAnswer(!showAnswer)}
          className="text-xs font-bold uppercase tracking-widest text-[var(--accent)] hover:text-[var(--accent-hover)] transition-all flex items-center gap-2 group bg-[var(--accent)]/5 px-4 py-2 rounded-full border border-[var(--accent)]/10"
        >
          {showAnswer ? "Hide Explanation" : "Reveal Explanation"}
          <ChevronRight
            className={`w-4 h-4 transition-transform duration-300 ${showAnswer ? "rotate-90" : "group-hover:translate-x-1"}`}
          />
        </button>

        <div
          className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
            showAnswer ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[16px] p-5 sm:p-8 shadow-md">
            <ContentRenderer
              content={question.answer}
              code={question.code}
              image={question.image}
              image2={question.image2}
              onImageClick={setActiveImage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
