"use client";

import { motion } from "framer-motion";
import { Question } from "@/src/lib/data";
import BookmarkButton from "@/src/components/BookmarkButton";

interface FlashcardProps {
  question: Question;
  onAnswered: (success: boolean) => void;
  showFeedback: boolean;
  isFlipped: boolean;
  onFlip: () => void;
  total: number;
  current: number;
}

export default function Flashcard({
  question,
  onFlip,
  total,
  current,
}: FlashcardProps) {
  return (
    <div className="w-full max-w-xl mx-auto">
      <motion.div
        className="w-full bg-white rounded-lg p-6 sm:p-10 border border-[var(--border)] shadow-sm hover:shadow-md flex flex-col justify-between cursor-pointer transition-all hover:border-[var(--accent)] min-h-[340px]"
        onClick={onFlip}
        whileHover={{ y: -3 }}
        whileTap={{ scale: 0.99 }}
      >
        <div className="flex justify-between items-center">
          <BookmarkButton questionId={question.id} size={16} />
          <span className="text-[11px] font-bold text-[var(--text-secondary)] font-mono bg-[var(--bg-subtle)] px-3 py-1 rounded-md border border-[var(--border)]">
            {current} / {total}
          </span>
        </div>

        <div className="flex-1 flex items-center justify-center py-8">
          <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] leading-snug text-center tracking-tight">
            {question.question}
          </h2>
        </div>

        <div className="text-center pt-4 border-t border-[var(--border)]">
          <span className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider">
            Tap anywhere to flip card
          </span>
        </div>
      </motion.div>
    </div>
  );
}
