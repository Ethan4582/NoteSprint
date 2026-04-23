"use client";

import { motion } from "framer-motion";
import { Question } from "@/src/lib/data";
import { Copy, Check, RotateCcw } from "lucide-react";
import { useState } from "react";

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
  onAnswered, 
  showFeedback, 
  isFlipped, 
  onFlip,
  total,
  current 
}: FlashcardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-[560px] mx-auto">
      <motion.div
        className="w-full bg-[var(--bg-surface)] rounded-[8px] p-6 sm:p-10 border border-[var(--border)] shadow-sm flex flex-col justify-between cursor-pointer transition-all hover:border-[var(--text-primary)] min-h-[300px]"
        onClick={onFlip}
        whileHover={{ y: -4 }}
      >
        <div className="flex justify-between items-start">
          <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-[4px] ${
            question.difficulty === "Basic" ? "bg-[#DCFCE7] text-[#15803D]" :
            question.difficulty === "Medium" ? "bg-[#FEF3C7] text-[#B45309]" :
            "bg-[#FEE2E2] text-[#B91C1C]"
          }`}>
            {question.difficulty}
          </span>
          <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Question {current} / {total}</span>
        </div>

        <div className="flex-1 flex items-center justify-center py-12">
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] leading-tight text-center tracking-tight">
            {question.question}
          </h2>
        </div>

        <div className="text-center pt-4 border-t border-[var(--border)]">
          <span className="text-[11px] font-bold text-[var(--accent)] uppercase tracking-widest animate-pulse">Tap to reveal answer</span>
        </div>
      </motion.div>
    </div>
  );
}
