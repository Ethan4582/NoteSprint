"use client";

import { motion } from "framer-motion";
import { Question } from "@/src/lib/data";

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
  isFlipped, 
  onFlip,
  total,
  current 
}: FlashcardProps) {

  return (
    <div className="w-full max-w-[560px] mx-auto">
      <motion.div
        className="w-full bg-[var(--bg-surface)] rounded-[12px] p-5 sm:p-8 border border-[var(--border)] shadow-sm flex flex-col justify-between cursor-pointer transition-all hover:border-[var(--accent)] hover:shadow-md min-h-[300px]"
        onClick={onFlip}
        whileHover={{ y: -4 }}
      >
        <div className="flex justify-end items-start">
          <span className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest bg-[var(--bg-subtle)] px-2 py-1 rounded-[6px]">
            Question {current} / {total}
          </span>
        </div>

        <div className="flex-1 flex items-center justify-center py-8">
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] leading-tight text-center tracking-tight">
            {question.question}
          </h2>
        </div>

        <div className="text-center pt-5 border-t border-[var(--border)]">
          <span className="text-[11px] font-semibold text-[var(--accent)] uppercase tracking-widest animate-pulse">
            Tap to reveal answer
          </span>
        </div>
      </motion.div>
    </div>
  );
}
