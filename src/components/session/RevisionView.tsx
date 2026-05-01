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
    <div className="w-full max-w-[700px] mx-auto space-y-10 pb-20">
      <div className="flex justify-between items-center px-4">
        {question.category && (
          <span className="text-[10px] font-bold text-[var(--accent)] uppercase tracking-widest">
            {question.category}
          </span>
        )}
        <span className="text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-widest ml-auto">
          Q {currentIndex + 1} / {totalQuestions}
        </span>
      </div>

      <div className="space-y-4 px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] leading-snug tracking-tight">
          {question.question}
        </h2>
      </div>

      <div className="space-y-8 px-4">
        <button
          onClick={() => setShowAnswer(!showAnswer)}
          className="text-xs font-bold uppercase tracking-widest text-[var(--accent)] hover:text-[var(--accent-hover)] transition-all flex items-center gap-2 group"
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
          <div className="pt-2">
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
