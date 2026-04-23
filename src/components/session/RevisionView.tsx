"use client";

import { Question } from "@/src/lib/data";
import { ChevronRight } from "lucide-react";

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
    <div className="w-full max-w-[800px] space-y-6">
      <div className="flex justify-between items-center mb-2">
        <span
          className={`text-xs px-2 py-0.5 rounded-[4px] font-medium tracking-tight ${
            question.difficulty === "Basic"
              ? "bg-[#DCFCE7] text-[#15803D]"
              : question.difficulty === "Medium"
              ? "bg-[#FEF3C7] text-[#B45309]"
              : "bg-[#FEE2E2] text-[#B91C1C]"
          }`}
        >
          {question.difficulty.toLowerCase()}
        </span>
        <span className="text-sm text-[var(--text-muted)] font-medium">
          Q {currentIndex + 1} / {totalQuestions}
        </span>
      </div>

      <h2 className="text-md sm:text-lg font-medium text-[var(--text-primary)] leading-snug">
        {question.question}
      </h2>

      <div className="space-y-4">
        <button
          onClick={() => setShowAnswer(!showAnswer)}
          className="text-sm font-medium text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors flex items-center gap-1"
        >
          {showAnswer ? "Hide Answer" : "Show Answer"}
          <ChevronRight
            className={`w-4 h-4 transition-transform ${showAnswer ? "rotate-90" : ""}`}
          />
        </button>

        <div
          className={`overflow-hidden transition-all duration-300 ${
            showAnswer ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[6px] p-5 space-y-6 shadow-xs">
            <p className="text-[15px] leading-relaxed text-[var(--text-primary)]">
              {question.answer}
            </p>

            {question.code && (
              <div className="space-y-2 relative group">
                <h3 className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  Snippet
                </h3>
                <pre className="bg-[var(--bg-subtle)] p-3 rounded-[6px] text-[13px] border border-[var(--border)] font-mono overflow-x-auto text-[var(--text-primary)]">
                  <code>{question.code}</code>
                </pre>
              </div>
            )}

            {(question.image || question.image2) && (
              <div className="flex flex-col gap-4">
                {question.image && (
                  <div
                    onClick={() => setActiveImage(question.image!)}
                    className="cursor-zoom-in hover:opacity-90 transition-opacity"
                  >
                    <img
                      src={question.image}
                      className="w-full h-auto rounded-[12px] border border-[var(--border)] shadow-sm"
                      alt="Ref"
                    />
                  </div>
                )}
                {question.image2 && (
                  <div
                    onClick={() => setActiveImage(question.image2!)}
                    className="cursor-zoom-in hover:opacity-90 transition-opacity"
                  >
                    <img
                      src={question.image2}
                      className="w-full h-auto rounded-[12px] border border-[var(--border)] shadow-sm"
                      alt="Ref 2"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
