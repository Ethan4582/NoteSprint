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

import SessionMain from "@/src/components/session/SessionMain";

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
    const subjects = config.subject.split(",");
    const topics = config.topic.split(",");
    
    if (topics.length <= 1) {
      const all = getQuestions(config.subject, config.topic);
      return all.sort(() => Math.random() - 0.5).slice(0, config.count);
    }

    const perTopic = Math.floor(config.count / topics.length);
    const extra = config.count % topics.length;
    let selected: any[] = [];

    topics.forEach((t, i) => {
      const s = subjects[i] || subjects[0];
      const topicQuestions = getQuestions(s, t).sort(() => Math.random() - 0.5);
      const countToTake = i < extra ? perTopic + 1 : perTopic;
      selected = [...selected, ...topicQuestions.slice(0, countToTake)];
    });

    return selected.sort(() => Math.random() - 0.5);
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
        if (e.code === "Space") { e.preventDefault(); setIsFlipped(prev => !prev); }
        else if (e.code === "KeyY" && isFlipped && !showFeedback) handleAnswer(true);
        else if (e.code === "KeyN" && isFlipped && !showFeedback) handleAnswer(false);
        else if (e.code === "ArrowRight" && showFeedback) nextQuestion();
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

  if (isFinished) return <FinishedView stats={stats} />;
  if (!questions[currentIndex]) return null;

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex flex-col">
      <Lightbox activeImage={activeImage} onClose={() => setActiveImage(null)} />

      <SessionHeader
        topic={config.topic}
        timeLeft={timeLeft}
        timerEnabled={config.time > 0}
        formatTime={formatTime}
        getTimeColor={getTimeColor}
        onEndSession={() => setIsFinished(true)}
      />

      <SessionMain
        mode={config.mode}
        currentIndex={currentIndex}
        isFlipped={isFlipped}
        questions={questions}
        handleAnswer={handleAnswer}
        showFeedback={showFeedback}
        setIsFlipped={setIsFlipped}
        showAnswer={showAnswer}
        setShowAnswer={setShowAnswer}
        setActiveImage={setActiveImage}
      />

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
