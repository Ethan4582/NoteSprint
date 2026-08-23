"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useMemo, useRef, Suspense } from "react";
import { getQuestions } from "@/src/lib/data";
import { fetchTopicQuestions, fetchQuestion } from "@/src/lib/api";
import { getBookmarkedIds } from "@/src/hooks/useBookmarks";
import { saveSessionProgress } from "@/src/lib/progress";

// Shared session components
import FinishedView from "@/src/components/session/FinishedView";
import Lightbox from "@/src/components/session/Lightbox";
import SessionHeader from "@/src/components/session/SessionHeader";
import SessionFooter from "@/src/components/session/SessionFooter";
import SessionMain from "@/src/components/session/SessionMain";

function SessionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const config = useMemo(() => ({
    subject: searchParams.get("subject") || "",
    topic: searchParams.get("topic") || "",
    count: parseInt(searchParams.get("count") || "10"),
    time: parseInt(searchParams.get("time") || "5"),
    mode: (searchParams.get("mode") as "flashcard" | "notes") || "flashcard",
  }), [searchParams]);

  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSessionQuestions = async () => {
      const topics = config.topic.split(",").map((t) => t.trim()).filter(Boolean);
      let allLoaded: any[] = [];

      if (config.topic === "bookmarks" || topics.includes("bookmarks")) {
        const bookmarkedIds = getBookmarkedIds();
        const loaded = await Promise.all(
          bookmarkedIds.map((id) => fetchQuestion(id).catch(() => null))
        );
        allLoaded = (loaded.filter(Boolean) as any[]).map((q) => ({
          ...q,
          topic: q.topicSlug || "Bookmarks",
          subject: "Tech",
        }));
      } else {
        for (const t of topics) {
          try {
            const res = await fetchTopicQuestions(t);
            if (res?.questions && res.questions.length > 0) {
              allLoaded.push(...res.questions.map((q) => ({ ...q, topic: t, subject: "Tech" })));
            }
          } catch {
            // fallback
          }
        }
      }

      if (allLoaded.length === 0 && config.topic !== "bookmarks") {
        allLoaded = getQuestions(config.subject, config.topic);
      }

      const shuffled = allLoaded.sort(() => Math.random() - 0.5).slice(0, config.count);
      setQuestions(shuffled);
      setLoading(false);
    };

    loadSessionQuestions();
  }, [config]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(config.time * 60);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const recordedRef = useRef(false);

  // Timer
  useEffect(() => {
    if (isFinished || timeLeft <= 0 || loading) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isFinished, timeLeft, loading]);

  // Record session to progress history
  useEffect(() => {
    if (isFinished && !recordedRef.current && questions.length > 0) {
      recordedRef.current = true;
      const totalAnswered = correctCount + incorrectCount;
      const accuracy = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;
      const topics = config.topic.split(",").map((t) => t.trim()).filter(Boolean);
      const isInterview = topics.some((t) => t.startsWith("interview_"));
      saveSessionProgress({
        mode: isInterview ? "interview" : config.mode,
        topics: topics.length > 0 ? topics : ["General"],
        totalQuestions: questions.length,
        correct: correctCount,
        incorrect: incorrectCount,
        accuracy,
        timeSpentSeconds: Math.max(0, (config.time * 60) - timeLeft),
      });
    }
  }, [isFinished, correctCount, incorrectCount, questions.length, config, timeLeft]);

  const handleAnswer = (success: boolean) => {
    if (success) setCorrectCount((c) => c + 1);
    else setIncorrectCount((c) => c + 1);

    setShowFeedback(true);
    setTimeout(() => {
      setShowFeedback(false);
      setIsFlipped(false);
      setShowAnswer(false);
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        setIsFinished(true);
      }
    }, 300);
  };

  const nextQuestion = () => {
    setIsFlipped(false);
    setShowAnswer(false);
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const prevQuestion = () => {
    setIsFlipped(false);
    setShowAnswer(false);
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const getTimeColor = () => {
    if (timeLeft < 60) return "text-red-500";
    if (timeLeft < 180) return "text-amber-500";
    return "text-[var(--text-primary)]";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center font-mono text-xs uppercase tracking-widest text-[var(--text-muted)]">
        Preparing Session...
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--bg-base)] flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-xl font-bold text-[var(--text-primary)]">No Questions Found</h1>
        <p className="text-sm text-[var(--text-muted)] mt-2">Could not find any questions for the selected topics.</p>
        <button
          onClick={() => router.back()}
          className="mt-6 px-6 py-2.5 bg-[var(--accent)] text-white rounded-xl font-bold text-xs uppercase tracking-widest"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (isFinished) {
    const totalAnswered = correctCount + incorrectCount;
    const accuracy = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;
    return (
      <FinishedView
        stats={{
          total: questions.length,
          correct: correctCount,
          incorrect: incorrectCount,
          accuracy,
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex flex-col justify-between selection:bg-[var(--accent)] selection:text-white">
      <SessionHeader
        topic={config.topic.replace(/_/g, " ")}
        timeLeft={timeLeft}
        timerEnabled={true}
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

      {activeImage && (
        <Lightbox activeImage={activeImage} onClose={() => setActiveImage(null)} />
      )}
    </div>
  );
}

export default function SessionPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center font-mono text-xs uppercase tracking-widest text-[var(--text-muted)]">Loading Session...</div>}>
      <SessionContent />
    </Suspense>
  );
}
