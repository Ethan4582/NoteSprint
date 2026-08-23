"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getQuestions } from "@/src/lib/data";
import { fetchTopicQuestions } from "@/src/lib/api";
import ContentRenderer from "@/src/components/ContentRenderer";
import { ArrowLeft, ChevronLeft, ChevronRight, Layers, Hash } from "lucide-react";
import BookmarkButton from "@/src/components/BookmarkButton";
import { motion, AnimatePresence } from "framer-motion";

const QUESTIONS_PER_PAGE = 15;

export default function PreviewClient({ id }: { id: string }) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [mounted, setMounted] = useState(false);
  const [questions, setQuestions] = useState<any[]>(() => getQuestions([], id));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    fetchTopicQuestions(id)
      .then((res) => {
        if (res?.questions && res.questions.length > 0) {
          setQuestions(res.questions);
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  const totalPages = Math.max(1, Math.ceil(questions.length / QUESTIONS_PER_PAGE));
  const currentQuestions = questions.slice(
    (currentPage - 1) * QUESTIONS_PER_PAGE,
    currentPage * QUESTIONS_PER_PAGE
  );

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center font-mono text-xs uppercase tracking-widest text-[var(--text-muted)]">
        Loading Questions...
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[var(--bg-base)]">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 rounded-lg bg-white border border-[var(--border)] shadow-sm max-w-md"
        >
          <Layers className="text-[var(--accent)] mx-auto mb-4 opacity-50" size={40} />
          <h1 className="text-xl font-normal font-serif text-[var(--text-primary)]">Topic Not Found</h1>
          <p className="text-[var(--text-muted)] mt-2 text-xs">The topic &quot;{id}&quot; doesn&apos;t exist in our records yet.</p>
          <button
            onClick={() => router.push("/practice")}
            className="mt-6 w-full px-6 py-2.5 bg-[var(--accent)] text-white rounded-md font-bold text-xs uppercase tracking-wider hover:bg-[var(--accent-hover)] transition-all shadow-sm"
          >
            Back to Practice
          </button>
        </motion.div>
      </div>
    );
  }

  const formattedTitle = id.replace(/interview_/g, "").replace(/_/g, " ");

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] selection:bg-[var(--accent)] selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-[60] bg-white/90 backdrop-blur-xl border-b border-[var(--border)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="w-9 h-9 rounded-md flex items-center justify-center bg-white border border-[var(--border)] hover:bg-[var(--bg-subtle)] transition-all text-[var(--text-secondary)] shadow-xs"
            >
              <ArrowLeft size={16} />
            </button>
            <div className="flex flex-col">
              <h1 className="text-lg font-normal font-serif capitalize tracking-tight flex items-center gap-1.5 text-[var(--text-primary)]">
                {formattedTitle}
              </h1>
              <span className="text-[11px] text-[var(--text-muted)] font-mono uppercase">
                {questions.length} Questions · Full Notes Preview
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Blog-style Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="bg-white rounded-lg border border-[var(--border)] p-6 sm:p-10 shadow-sm">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="divide-y divide-[var(--border)]"
            >
              {currentQuestions.map((q, index) => {
                const globalIndex = (currentPage - 1) * QUESTIONS_PER_PAGE + index + 1;
                return (
                  <article key={q.id} className="py-8 first:pt-0 last:pb-0 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-baseline gap-3">
                        <span className="text-xs font-mono text-[var(--accent)] font-bold">
                          #{globalIndex.toString().padStart(2, "0")}
                        </span>
                        <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)] leading-snug">
                          {q.question}
                        </h2>
                      </div>
                      <BookmarkButton questionId={q.id} size={16} className="shrink-0 mt-0.5" />
                    </div>

                    <div className="pl-6 border-l-2 border-[var(--accent)]/20 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                      <ContentRenderer
                        content={q.answer}
                        code={q.code}
                        image={q.imageUrl || q.image}
                        image2={q.image2}
                      />
                    </div>
                  </article>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Inline Pagination at the Bottom */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pb-20">
          <div className="text-xs text-[var(--text-muted)] font-medium">
            Page <span className="text-[var(--text-primary)] font-bold">{currentPage}</span> of{" "}
            <span className="text-[var(--text-primary)] font-bold">{totalPages}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setCurrentPage((p) => Math.max(1, p - 1));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              disabled={currentPage === 1}
              className="h-9 px-4 rounded-md flex items-center gap-1.5 border border-[var(--border)] bg-white hover:bg-[var(--bg-subtle)] disabled:opacity-30 transition-all text-xs font-bold shadow-xs"
            >
              <ChevronLeft size={14} /> Previous
            </button>

            <div className="hidden sm:flex items-center gap-1 mx-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setCurrentPage(i + 1);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`w-8 h-8 rounded-md text-xs font-bold transition-all ${
                    currentPage === i + 1
                      ? "bg-[var(--text-primary)] text-white shadow-xs"
                      : "text-[var(--text-muted)] hover:bg-[var(--bg-subtle)]"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setCurrentPage((p) => Math.min(totalPages, p + 1));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              disabled={currentPage === totalPages}
              className="h-9 px-4 rounded-md flex items-center gap-1.5 bg-[var(--text-primary)] text-white hover:bg-black disabled:opacity-30 transition-all text-xs font-bold shadow-xs"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
