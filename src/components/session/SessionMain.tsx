"use client";

import { AnimatePresence, motion } from "framer-motion";
import Flashcard from "@/src/components/Flashcard";
import FlashcardAnswer from "@/src/components/session/FlashcardAnswer";
import RevisionView from "@/src/components/session/RevisionView";

interface SessionMainProps {
  mode: "flashcard" | "notes";
  currentIndex: number;
  isFlipped: boolean;
  questions: any[];
  handleAnswer: (success: boolean) => void;
  showFeedback: boolean;
  setIsFlipped: (val: boolean) => void;
  showAnswer: boolean;
  setShowAnswer: (val: boolean) => void;
  setActiveImage: (val: string | null) => void;
}

export default function SessionMain({
  mode,
  currentIndex,
  isFlipped,
  questions,
  handleAnswer,
  showFeedback,
  setIsFlipped,
  showAnswer,
  setShowAnswer,
  setActiveImage,
}: SessionMainProps) {
  const currentQ = questions[currentIndex];
  if (!currentQ) return null;

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 pb-24 sm:pb-32">
      <AnimatePresence mode="wait">
        {mode === "flashcard" ? (
          <motion.div
            key={`flash-${currentIndex}-${isFlipped}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="w-full flex flex-col items-center gap-8"
          >
            {!isFlipped ? (
              <Flashcard 
                question={currentQ} 
                onAnswered={handleAnswer} 
                showFeedback={showFeedback}
                isFlipped={isFlipped}
                onFlip={() => setIsFlipped(true)}
                total={questions.length}
                current={currentIndex + 1}
              />
            ) : (
              <FlashcardAnswer
                question={currentQ}
                currentIndex={currentIndex}
                totalQuestions={questions.length}
                showFeedback={showFeedback}
                handleAnswer={handleAnswer}
                setActiveImage={setActiveImage}
              />
            )}
          </motion.div>
        ) : (
          <motion.div
            key={`note-${currentIndex}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full max-w-[800px] space-y-6"
          >
            <RevisionView
              question={currentQ}
              currentIndex={currentIndex}
              totalQuestions={questions.length}
              showAnswer={showAnswer}
              setShowAnswer={setShowAnswer}
              setActiveImage={setActiveImage}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
