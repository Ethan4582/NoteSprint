"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useMemo, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getQuestions, Question } from "@/src/lib/data";
import Flashcard from "@/src/components/Flashcard";
import ThemeToggle from "@/src/components/ThemeToggle";
import { ArrowLeft, X, ChevronLeft, ChevronRight, Home, RotateCcw, Copy, Check } from "lucide-react";

function SessionContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const config = useMemo(() => ({
    subject: searchParams.get("subject") || "",
    topic: searchParams.get("topic") || "",
    basic: parseInt(searchParams.get("basic") || "0"),
    medium: parseInt(searchParams.get("medium") || "0"),
    hard: parseInt(searchParams.get("hard") || "0"),
    time: parseInt(searchParams.get("time") || "5"),
    mode: searchParams.get("mode") as "flashcard" | "notes" || "flashcard",
  }), [searchParams]);

  const questions = useMemo(() => {
    const all = getQuestions(config.subject, config.topic);
    const basic = all.filter(q => q.difficulty === "Basic").sort(() => Math.random() - 0.5).slice(0, config.basic);
    const medium = all.filter(q => q.difficulty === "Medium").sort(() => Math.random() - 0.5).slice(0, config.medium);
    const hard = all.filter(q => q.difficulty === "Hard").sort(() => Math.random() - 0.5).slice(0, config.hard);
    return [...basic, ...medium, ...hard].sort(() => Math.random() - 0.5);
  }, [config]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(config.time * 60);
  const [responses, setResponses] = useState<boolean[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [copied, setCopied] = useState(false);

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
  }, [isFinished, config.mode, isFlipped, showFeedback, showAnswer, currentIndex]);

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
  }, [responses, questions]);

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

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isFinished) {
    return (
      <div className="min-h-screen bg-[var(--bg-base)] flex flex-col items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-[400px] bg-[var(--bg-surface)] border border-[var(--border)] rounded-[8px] p-8 shadow-sm text-center space-y-8"
        >
          <div className="space-y-2">
            <h1 className="text-xl font-semibold text-[var(--text-primary)]">Session Complete</h1>
            <div className="text-4xl font-semibold text-[var(--text-primary)]">{stats.accuracy}%</div>
            <div className="w-full h-2 bg-[var(--bg-subtle)] rounded-[2px] overflow-hidden mt-2">
               <div className="h-full bg-[var(--accent)] transition-all duration-500" style={{ width: `${stats.accuracy}%` }} />
            </div>
            <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Accuracy</p>
          </div>

          <div className="grid grid-cols-3 gap-4 py-4 border-y border-[var(--border)]">
             <div>
                <div className="text-base font-semibold">{stats.total}</div>
                <div className="text-[10px] text-[var(--text-muted)] uppercase">Total</div>
             </div>
             <div>
                <div className="text-base font-semibold text-[var(--success)]">{stats.correct}</div>
                <div className="text-[10px] text-[var(--text-muted)] uppercase">Correct</div>
             </div>
             <div>
                <div className="text-base font-semibold text-[var(--error)]">{stats.incorrect}</div>
                <div className="text-[10px] text-[var(--text-muted)] uppercase">Wrong</div>
             </div>
          </div>

          <div className="space-y-2 pt-4">
             <button 
               onClick={() => window.location.reload()}
               className="w-full h-10 bg-[var(--accent)] text-white text-sm font-medium rounded-[6px] hover:bg-[var(--accent-hover)] transition-all"
             >
               Try Again
             </button>
             <button 
               onClick={() => router.push("/dashboard")}
               className="w-full h-10 bg-transparent border border-[var(--border)] text-[var(--text-primary)] text-sm font-medium rounded-[6px] hover:bg-[var(--bg-subtle)] transition-all"
             >
               Back to Dashboard
             </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex flex-col">
      {/* App Bar */}
      <header className="sticky top-0 z-10 h-12 bg-[var(--bg-surface)] border-b border-[var(--border)] flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
           <button 
             onClick={() => router.back()}
             className="w-8 h-8 flex items-center justify-center hover:bg-[var(--bg-subtle)] rounded-[6px]"
           >
             <X className="w-[18px] h-[18px] text-[var(--text-primary)]" />
           </button>
           <span className="text-sm font-medium capitalize truncate max-w-[120px] sm:max-w-none">{config.topic}</span>
        </div>
        
        {config.time > 0 && (
          <div className={`text-base font-mono font-medium ${getTimeColor()}`}>
            {formatTime(timeLeft)}
          </div>
        )}

        <ThemeToggle />
      </header>

      {/* Main Content */}
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
                <div className="w-full max-w-[800px] bg-[var(--bg-surface)] border border-[var(--border)] rounded-[8px] overflow-hidden shadow-sm">
                  <div className="p-6 sm:p-10 space-y-8">
                    <div className="flex justify-between items-start mb-4">
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-[4px] ${
                        currentQ.difficulty === "Basic" ? "bg-[#DCFCE7] text-[#15803D]" :
                        currentQ.difficulty === "Medium" ? "bg-[#FEF3C7] text-[#B45309]" :
                        "bg-[#FEE2E2] text-[#B91C1C]"
                      }`}>
                        {currentQ.difficulty}
                      </span>
                      <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Question {currentIndex + 1} / {questions.length}</span>
                    </div>

                    <div className="space-y-4">
                      <h2 className="text-lg sm:text-xl font-bold text-[var(--text-secondary)] leading-tight tracking-tight border-l-2 border-[var(--accent)] pl-4">
                        {currentQ.question}
                      </h2>
                      <div className="h-px bg-[var(--border)] w-full opacity-50" />
                      <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Explanation</h3>
                      <p className="text-base sm:text-lg text-[var(--text-primary)] leading-relaxed">
                        {currentQ.answer}
                      </p>
                    </div>

                    {currentQ.code && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Code Implementation</h3>
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText(currentQ.code!);
                              setCopied(true);
                              setTimeout(() => setCopied(false), 2000);
                            }}
                            className="flex items-center gap-2 text-xs font-bold text-[var(--accent)] hover:text-[var(--accent-hover)] uppercase tracking-wide"
                          >
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            {copied ? "Copied" : "Copy Code"}
                          </button>
                        </div>
                        <pre className="bg-[var(--bg-subtle)] p-5 rounded-[8px] text-sm border border-[var(--border)] font-mono overflow-x-auto text-[var(--text-primary)]">
                          <code>{currentQ.code}</code>
                        </pre>
                      </div>
                    )}

                    {(currentQ.image || currentQ.image2) && (
                      <div className="space-y-4">
                        <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Reference Visuals</h3>
                        <div className="grid grid-cols-1 gap-6">
                          {currentQ.image && (
                            <div className="rounded-[8px] border border-[var(--border)] overflow-hidden bg-[var(--bg-base)]">
                              <img src={currentQ.image} className="w-full h-auto" alt="Ref 1" />
                            </div>
                          )}
                          {currentQ.image2 && (
                            <div className="rounded-[8px] border border-[var(--border)] overflow-hidden bg-[var(--bg-base)]">
                              <img src={currentQ.image2} className="w-full h-auto" alt="Ref 2" />
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {!showFeedback && (
                      <div className="pt-8 border-t border-[var(--border)] space-y-6">
                        <p className="text-center font-bold text-[var(--text-primary)] uppercase tracking-widest text-xs">Rate your recall</p>
                        <div className="flex gap-4">
                          <button 
                            onClick={() => handleAnswer(false)} 
                            className="flex-1 h-12 border-2 border-[var(--error)] text-[var(--error)] font-bold rounded-[8px] hover:bg-[var(--error)] hover:text-white transition-all active:scale-95"
                          >
                            FAILURE
                          </button>
                          <button 
                            onClick={() => handleAnswer(true)} 
                            className="flex-1 h-12 border-2 border-[var(--success)] text-[var(--success)] font-bold rounded-[8px] hover:bg-[var(--success)] hover:text-white transition-all active:scale-95"
                          >
                            MASTERED
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
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
              <div className="flex justify-between items-center mb-2">
                <span className={`text-xs px-2 py-0.5 rounded-[4px] font-medium tracking-tight ${
                  currentQ.difficulty === "Basic" ? "bg-[#DCFCE7] text-[#15803D]" :
                  currentQ.difficulty === "Medium" ? "bg-[#FEF3C7] text-[#B45309]" :
                  "bg-[#FEE2E2] text-[#B91C1C]"
                }`}>
                  {currentQ.difficulty.toLowerCase()}
                </span>
                <span className="text-sm text-[var(--text-muted)] font-medium">Q {currentIndex + 1} / {questions.length}</span>
              </div>

              <h2 className="text-md sm:text-lg font-medium text-[var(--text-primary)] leading-snug">
                {currentQ.question}
              </h2>

              <div className="space-y-4">
                <button
                  onClick={() => setShowAnswer(!showAnswer)}
                  className="text-sm font-medium text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors flex items-center gap-1"
                >
                  {showAnswer ? "Hide Answer" : "Show Answer"}
                  <ChevronRight className={`w-4 h-4 transition-transform ${showAnswer ? "rotate-90" : ""}`} />
                </button>

                <div className={`overflow-hidden transition-all duration-300 ${showAnswer ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"}`}>
                   <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[6px] p-5 space-y-6 shadow-xs">
                      <p className="text-[15px] leading-relaxed text-[var(--text-primary)]">
                        {currentQ.answer}
                      </p>

                      {currentQ.code && (
                        <div className="space-y-2 relative group">
                          <div className="flex justify-between items-center">
                            <h3 className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Snippet</h3>
                            <button 
                              onClick={() => handleCopy(currentQ.code!)}
                              className="flex items-center gap-1 text-[11px] font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                            >
                              {copied ? <Check className="w-3 h-3 text-[var(--success)]" /> : <Copy className="w-3 h-3" />}
                              {copied ? "Copied!" : "Copy"}
                            </button>
                          </div>
                          <pre className="bg-[var(--bg-subtle)] p-3 rounded-[6px] text-[13px] border border-[var(--border)] font-mono overflow-x-auto text-[var(--text-primary)]">
                            <code>{currentQ.code}</code>
                          </pre>
                        </div>
                      )}

                      {(currentQ.image || currentQ.image2) && (
                        <div className="flex flex-col gap-3">
                          {currentQ.image && (
                            <img src={currentQ.image} className="w-full h-auto rounded-[4px] border border-[var(--border)]" alt="Ref" />
                          )}
                          {currentQ.image2 && (
                            <img src={currentQ.image2} className="w-full h-auto rounded-[4px] border border-[var(--border)]" alt="Ref 2" />
                          )}
                        </div>
                      )}
                   </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Desktop Keyboard Hints */}
        <div className="hidden md:flex fixed bottom-24 left-0 w-full justify-center gap-6 text-[11px] text-[var(--text-muted)] pointer-events-none">
           <div className="flex items-center gap-1.5"><kbd className="border border-[var(--border)] rounded-[3px] px-1.5 py-0.5 font-mono bg-[var(--bg-surface)] shadow-xs">Space</kbd> {config.mode === 'flashcard' ? 'flip' : 'answer'}</div>
           <div className="flex items-center gap-1.5"><kbd className="border border-[var(--border)] rounded-[3px] px-1.5 py-0.5 font-mono bg-[var(--bg-surface)] shadow-xs">→</kbd> next</div>
           <div className="flex items-center gap-1.5"><kbd className="border border-[var(--border)] rounded-[3px] px-1.5 py-0.5 font-mono bg-[var(--bg-surface)] shadow-xs">←</kbd> prev</div>
           {config.mode === 'flashcard' && isFlipped && !showFeedback && (
             <>
               <div className="flex items-center gap-1.5"><kbd className="border border-[var(--border)] rounded-[3px] px-1.5 py-0.5 font-mono bg-[var(--bg-surface)] shadow-xs">Y</kbd> yes</div>
               <div className="flex items-center gap-1.5"><kbd className="border border-[var(--border)] rounded-[3px] px-1.5 py-0.5 font-mono bg-[var(--bg-surface)] shadow-xs">N</kbd> no</div>
             </>
           )}
        </div>
      </main>

      {/* Sticky Bottom Controls */}
      <footer className="fixed bottom-0 left-0 w-full h-[56px] bg-[var(--bg-surface)] border-t border-[var(--border)] flex items-center justify-between px-4 pb-[env(safe-area-inset-bottom)] z-10">
        <button 
          onClick={prevQuestion}
          disabled={currentIndex === 0}
          className="h-8 px-4 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] rounded-[6px] disabled:opacity-30 flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" /> Prev
        </button>
        
        <div className="text-sm font-medium text-[var(--text-muted)]">
          {currentIndex + 1} / {questions.length}
        </div>

        {config.mode === "flashcard" ? (
          !isFlipped ? (
            <button 
              onClick={() => setIsFlipped(true)}
              className="h-8 px-6 bg-[var(--accent)] text-white text-sm font-medium rounded-[6px] hover:bg-[var(--accent-hover)] transition-all"
            >
              Flip
            </button>
          ) : (
            showFeedback ? (
              <button 
                onClick={nextQuestion}
                className="h-8 px-4 bg-[var(--accent)] text-white text-sm font-medium rounded-[6px] hover:bg-[var(--accent-hover)] transition-all flex items-center gap-1"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex gap-2">
                 <button onClick={() => handleAnswer(false)} className="h-8 px-3 border border-[var(--error)] text-[var(--error)] text-xs font-medium rounded-[6px] hover:bg-[var(--bg-subtle)]">No</button>
                 <button onClick={() => handleAnswer(true)} className="h-8 px-3 border border-[var(--success)] text-[var(--success)] text-xs font-medium rounded-[6px] hover:bg-[var(--bg-subtle)]">Yes</button>
              </div>
            )
          )
        ) : (
          <button 
            onClick={nextQuestion}
            className="h-8 px-4 bg-[var(--accent)] text-white text-sm font-medium rounded-[6px] hover:bg-[var(--accent-hover)] transition-all flex items-center gap-1"
          >
            {currentIndex === questions.length - 1 ? "Finish" : "Next"} <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </footer>
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
