"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, useMemo, Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { getQuestions } from "@/src/lib/data";
import Flashcard from "@/src/components/Flashcard";

// Shared session components
import FinishedView from "@/src/components/session/FinishedView";
import Lightbox from "@/src/components/session/Lightbox";
import SessionHeader from "@/src/components/session/SessionHeader";
import SessionFooter from "@/src/components/session/SessionFooter";
import FlashcardAnswer from "@/src/components/session/FlashcardAnswer";
import RevisionView from "@/src/components/session/RevisionView";
import KeyboardHints from "@/src/components/session/KeyboardHints";

function SessionContent() {
  const searchParams = useSearchParams();

  const config = useMemo(() => ({
    subject: searchParams.get("subject") || "",
    topic: searchParams.get("topic") || "",
    count: parseInt(searchParams.get("count") || "10"),
    time: parseInt(searchParams.get("time") || "5"),
    mode: (searchParams.get("mode") as "flashcard" | "notes") || "flashcard",
  }), [searchParams]);

  const questions = useMemo(() => {
    const all = getQuestions(config.subject, config.topic);
    // Shuffle and slice based on requested count
    return all.sort(() => Math.random() - 0.5).slice(0, config.count);
  }, [config]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(config.time * 60);
  const [responses, setResponses] = useState<boolean[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  useEffect(() => {
    if (config.time === 0 || isFinished) return;
    if (timeLeft <= 0) {
      setIsFinished(true);
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isFinished, config.time]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFinished) return;
      if (config.mode === "flashcard") {
        if (e.code === "Space") {
          e.preventDefault();
          setIsFlipped(prev => !prev);
        } else if (e.code === "KeyY" && isFlipped && !showFeedback) {
          handleAnswer(true);
        } else if (e.code === "KeyN" && isFlipped && !showFeedback) {
          handleAnswer(false);
        } else if (e.code === "ArrowRight" && showFeedback) {
          nextQuestion();
        }
      } else {
        if (e.code === "ArrowRight") nextQuestion();
        if (e.code === "ArrowLeft") prevQuestion();
        if (e.code === "Space") setShowAnswer(!showAnswer);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFinished, config.mode, isFlipped, showFeedback, showAnswer, currentIndex, questions.length]);

  const handleAnswer = (success: boolean) => {
    setResponses(prev => [...prev, success]);
    setShowFeedback(true);
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowFeedback(false);
      setIsFlipped(false);
      setShowAnswer(false);
    } else {
      setIsFinished(true);
    }
  };

  const prevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setShowAnswer(false);
    }
  };

  const stats = useMemo(() => {
    const correct = responses.filter(r => r).length;
    return {
      total: questions.length,
      correct,
      incorrect: responses.length - correct,
      accuracy: Math.round((correct / questions.length) * 100) || 0
    };
  }, [responses, questions.length]);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    if (timeLeft < 10) return "text-[var(--error)] animate-pulse";
    if (timeLeft < 60) return "text-[var(--warning)]";
    return "text-[var(--text-secondary)]";
  };

  if (isFinished) {
    return <FinishedView stats={stats} />;
  }

  const currentQ = questions[currentIndex];

  if (!currentQ) return null;

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex flex-col">
      <Lightbox activeImage={activeImage} onClose={() => setActiveImage(null)} />

      <SessionHeader
        topic={config.topic}
        timeLeft={timeLeft}
        timerEnabled={config.time > 0}
        formatTime={formatTime}
        getTimeColor={getTimeColor}
      />

      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 pb-24 sm:pb-32">
        <AnimatePresence mode="wait">
          {config.mode === "flashcard" ? (
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

        <KeyboardHints
          mode={config.mode}
          isFlipped={isFlipped}
          showFeedback={showFeedback}
        />
      </main>

      <SessionFooter
        currentIndex={currentIndex}
        totalQuestions={questions.length}
        mode={config.mode}
        isFlipped={isFlipped}
        showFeedback={showFeedback}
        prevQuestion={prevQuestion}
        nextQuestion={nextQuestion}
        setIsFlipped={setIsFlipped}
        handleAnswer={handleAnswer}
        showAnswer={showAnswer}
      />
    </div>
  );
}

export default function SessionPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center font-mono text-xs uppercase tracking-widest text-[var(--text-muted)]">Initializing Session...</div>}>
      <SessionContent />
    </Suspense>
  );
}
