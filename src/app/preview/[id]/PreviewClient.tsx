"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import { getQuestions } from "@/src/lib/data";
import ContentRenderer from "@/src/components/ContentRenderer";
import { ArrowLeft, ChevronLeft, ChevronRight, Layers, Hash } from "lucide-react";
import ThemeToggle from "@/src/components/ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";

const QUESTIONS_PER_PAGE = 15;

export default function PreviewClient({ id }: { id: string }) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const questions = useMemo(() => {
    return getQuestions([], id);
  }, [id]);

  const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);
  const currentQuestions = questions.slice(
    (currentPage - 1) * QUESTIONS_PER_PAGE,
    currentPage * QUESTIONS_PER_PAGE
  );

  if (!mounted) return null;

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[var(--bg-base)]">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] shadow-sm max-w-md"
        >
          <Layers className="text-[var(--accent)] mx-auto mb-4 opacity-50" size={40} />
          <h1 className="text-xl font-bold text-[var(--text-primary)]">Topic Not Found</h1>
          <p className="text-[var(--text-muted)] mt-2 text-sm">The topic "{id}" doesn't exist in our records yet.</p>
          <button 
            onClick={() => router.push("/practice")}
            className="mt-6 w-full px-6 py-2.5 bg-[var(--accent)] text-white rounded-lg font-semibold hover:bg-[var(--accent-hover)] transition-all"
          >
            Back to Practice
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] transition-colors duration-300 selection:bg-[var(--accent)] selection:text-white">
      {/* Minimal Header */}
      <header className="sticky top-0 z-[60] bg-[var(--bg-base)]/80 backdrop-blur-md border-b border-[var(--border)]">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[var(--bg-surface)] transition-all text-[var(--text-secondary)]"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="flex flex-col">
              <h1 className="text-sm font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Hash size={14} className="text-[var(--accent)]" />
                {id.replace(/_/g, ' ')}
              </h1>
              <span className="text-[10px] text-[var(--text-muted)] font-mono uppercase">
                {questions.length} Items • Preview
              </span>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Blog-style Content */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="divide-y divide-[var(--border)]"
          >
            {currentQuestions.map((q, index) => {
              const globalIndex = (currentPage - 1) * QUESTIONS_PER_PAGE + index + 1;
              return (
                <article key={q.id} className="py-12 first:pt-0 last:pb-0">
                  <div className="flex items-baseline gap-4 mb-4">
                    <span className="text-xs font-mono text-[var(--accent)] font-bold opacity-60">
                      {globalIndex.toString().padStart(2, '0')}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] leading-tight tracking-tight">
                      {q.question}
                    </h2>
                  </div>
                  
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    <ContentRenderer 
                      content={q.answer} 
                      code={q.code} 
                      image={q.image} 
                      image2={q.image2} 
                    />
                  </div>
                </article>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Inline Pagination at the Bottom */}
        <div className="mt-20 pt-8 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-6 pb-24">
          <div className="text-sm text-[var(--text-muted)] font-medium">
            Page <span className="text-[var(--text-primary)] font-bold">{currentPage}</span> of <span className="text-[var(--text-primary)] font-bold">{totalPages}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              disabled={currentPage === 1}
              className="h-10 px-4 rounded-lg flex items-center gap-2 border border-[var(--border)] hover:bg-[var(--bg-surface)] disabled:opacity-30 disabled:hover:bg-transparent transition-all text-sm font-semibold"
            >
              <ChevronLeft size={16} /> Previous
            </button>
            
            <div className="hidden sm:flex items-center gap-1.5 mx-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setCurrentPage(i + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                    currentPage === i + 1 
                      ? "bg-[var(--accent)] text-white" 
                      : "text-[var(--text-muted)] hover:bg-[var(--bg-surface)]"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              disabled={currentPage === totalPages}
              className="h-10 px-4 rounded-lg flex items-center gap-2 bg-[var(--text-primary)] text-[var(--bg-base)] hover:opacity-90 disabled:opacity-30 transition-all text-sm font-semibold"
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
