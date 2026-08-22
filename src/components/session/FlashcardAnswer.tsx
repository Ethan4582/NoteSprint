"use client";

import { Question } from "@/src/lib/data";
import ContentRenderer from "@/src/components/ContentRenderer";
import BookmarkButton from "@/src/components/BookmarkButton";

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
    <div className="w-full max-w-[700px] mx-auto bg-transparent pb-10">
      <div className="space-y-10">
        {/* Header */}
        <div className="flex justify-between items-center px-4">
          <div className="flex items-center gap-2">
            <BookmarkButton questionId={question.id} size={15} />
            {question.category && (
              <span className="text-[10px] font-bold text-[var(--accent)] uppercase tracking-widest">
                {question.category}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-widest ml-auto">
            Q {currentIndex + 1} / {totalQuestions}
          </span>
        </div>

        <div className="space-y-8 px-4">
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] leading-snug tracking-tight">
              {question.question}
            </h2>
          </div>

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
