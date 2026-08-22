"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useBookmarks } from "@/src/hooks/useBookmarks";
import { fetchQuestion } from "@/src/lib/api";
import type { Question } from "@/src/db/schema";
import BottomNav from "@/src/components/BottomNav";
import ThemeToggle from "@/src/components/ThemeToggle";
import BookmarkButton from "@/src/components/BookmarkButton";
import ContentRenderer from "@/src/components/ContentRenderer";
import {
  Bookmark,
  Play,
  Search,
  ChevronRight,
  Layers,
  Sparkles,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type BookmarkItem = Question & {
  topicSlug?: string;
  topicName?: string;
  category?: string;
  code?: string;
  image?: string;
  image2?: string;
};

export default function BookmarksPage() {
  const router = useRouter();
  const { bookmarks, isLoaded } = useBookmarks();
  const [questions, setQuestions] = useState<BookmarkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [expandedIds, setExpandedIds] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (!isLoaded) return;
    if (bookmarks.length === 0) {
      setQuestions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    Promise.all(bookmarks.map((id) => fetchQuestion(id).catch(() => null)))
      .then((results) => {
        const valid = results.filter(Boolean) as BookmarkItem[];
        setQuestions(valid);
      })
      .finally(() => setLoading(false));
  }, [bookmarks, isLoaded]);

  const topics = useMemo(() => {
    const set = new Set<string>();
    questions.forEach((q) => {
      if (q.topicName) set.add(q.topicName);
    });
    return Array.from(set);
  }, [questions]);

  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const matchSearch =
        !search ||
        q.question.toLowerCase().includes(search.toLowerCase()) ||
        q.answer.toLowerCase().includes(search.toLowerCase());
      const matchTopic = selectedTopic === "all" || q.topicName === selectedTopic;
      return matchSearch && matchTopic;
    });
  }, [questions, search, selectedTopic]);

  const toggleExpand = (id: number) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const startSession = () => {
    router.push(`/session?topic=bookmarks&count=${Math.max(1, filteredQuestions.length)}&time=10&mode=flashcard`);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex flex-col pb-32 font-sans selection:bg-[var(--accent)] selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[var(--bg-base)]/85 backdrop-blur-xl border-b border-[var(--border)] px-4 sm:px-8 py-4">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[var(--accent)]/15 border border-[var(--accent)]/25 text-[var(--accent)]">
              <Bookmark className="h-5 w-5 fill-current" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[var(--text-primary)]">
                Saved Bookmarks
              </h1>
              <p className="text-xs text-[var(--text-secondary)]">
                {questions.length} saved question{questions.length === 1 ? "" : "s"}
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto w-full p-4 sm:p-8 space-y-6 flex-1">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3 text-xs text-[var(--text-muted)] font-mono">
            <Loader2 className="h-6 w-6 animate-spin text-[var(--accent)]" />
            <span>Loading bookmarks...</span>
          </div>
        ) : questions.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center p-6 bg-raised rounded-2xl border border-[var(--border)] shadow-sm max-w-md mx-auto">
            <div className="p-4 rounded-2xl bg-[var(--bg-subtle)] text-[var(--accent)] mb-4">
              <Bookmark className="h-8 w-8 opacity-60" />
            </div>
            <h2 className="text-lg font-bold text-[var(--text-primary)]">No Bookmarks Saved</h2>
            <p className="text-xs text-[var(--text-muted)] mt-1.5 leading-relaxed">
              Tap the bookmark icon on any flashcard or preview question to save it for quick practice.
            </p>
            <button
              onClick={() => router.push("/practice")}
              className="mt-6 px-6 py-2.5 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm active:scale-95 flex items-center gap-2"
            >
              <span>Explore Topics</span>
              <ArrowRight size={14} />
            </button>
          </div>
        ) : (
          <>
            {/* Action & Filter Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex flex-1 items-center gap-2.5">
                <div className="relative flex-1 max-w-md">
                  <Input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search bookmarks..."
                    className="h-10 pl-9 pr-3 rounded-xl bg-raised border-[var(--border-strong)] text-xs text-[var(--text-primary)] w-full"
                  />
                  <Search className="absolute left-3 top-3 h-4 w-4 text-[var(--text-muted)] pointer-events-none" />
                </div>

                {topics.length > 1 && (
                  <select
                    value={selectedTopic}
                    onChange={(e) => setSelectedTopic(e.target.value)}
                    className="h-10 px-3 rounded-xl bg-raised border border-[var(--border-strong)] text-xs font-semibold text-[var(--text-secondary)] outline-none"
                  >
                    <option value="all">All Topics</option>
                    {topics.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <button
                onClick={startSession}
                disabled={filteredQuestions.length === 0}
                className="h-10 px-5 bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-50 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-[var(--accent)]/20 active:scale-95 flex items-center justify-center gap-2 shrink-0"
              >
                <Play size={14} fill="currentColor" />
                <span>Practice Bookmarks ({filteredQuestions.length})</span>
              </button>
            </div>

            {/* Questions List */}
            <div className="space-y-3">
              <AnimatePresence>
                {filteredQuestions.map((q, idx) => {
                  const isExpanded = !!expandedIds[q.id];
                  return (
                    <motion.div
                      key={q.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      className="rounded-2xl border border-[var(--border-strong)] bg-raised p-4 sm:p-5 shadow-raised-crisp transition-all space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0 flex-1">
                          <span className="text-[11px] font-mono font-bold text-[var(--accent)] opacity-70 mt-0.5 shrink-0">
                            #{(idx + 1).toString().padStart(2, "0")}
                          </span>
                          <div className="min-w-0 flex-1">
                            {q.topicName && (
                              <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[var(--bg-subtle)] text-[var(--text-muted)] border border-[var(--border)] inline-block mb-1.5">
                                {q.topicName}
                              </span>
                            )}
                            <h2 className="text-sm sm:text-base font-bold text-[var(--text-primary)] leading-snug">
                              {q.question}
                            </h2>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <BookmarkButton questionId={q.id} size={16} />
                          <button
                            type="button"
                            onClick={() => toggleExpand(q.id)}
                            className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] rounded-lg transition-colors"
                            title={isExpanded ? "Collapse answer" : "Expand answer"}
                          >
                            <ChevronRight
                              size={16}
                              className={`transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}
                            />
                          </button>
                        </div>
                      </div>

                      {/* Expandable Answer */}
                      {isExpanded && (
                        <div className="pt-3 border-t border-[var(--border)] text-xs text-[var(--text-secondary)] leading-relaxed">
                          <ContentRenderer
                            content={q.answer}
                            code={q.code}
                            image={q.imageUrl || q.image}
                            image2={q.image2}
                          />
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </>
        )}
      </main>

      <BottomNav />
    </div>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} />;
}
