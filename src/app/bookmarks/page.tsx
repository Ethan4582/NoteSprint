"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useBookmarks } from "@/src/hooks/useBookmarks";
import { fetchQuestions } from "@/src/lib/api";
import type { Question } from "@/src/db/schema";
import BottomNav from "@/src/components/BottomNav";
import DashboardSidebar from "@/src/components/dashboard/DashboardSidebar";
import BookmarkButton from "@/src/components/BookmarkButton";
import ContentRenderer from "@/src/components/ContentRenderer";
import { Input } from "@/src/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import {
  Bookmark,
  Play,
  Search,
  ChevronRight,
  Loader2,
  ArrowRight,
  BookOpen,
} from "lucide-react";

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
    fetchQuestions(bookmarks)
      .then((results) => {
        setQuestions(results as BookmarkItem[]);
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
    router.push(
      `/session?topic=bookmarks&count=${Math.max(1, filteredQuestions.length)}&time=10&mode=flashcard`
    );
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex font-sans">
      {/* Desktop Left Sidebar */}
      <DashboardSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-28">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-[var(--border)] px-4 sm:px-8 py-3.5">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[var(--accent-subtle)] border border-[var(--accent)]/20 text-[var(--accent)]">
                <Bookmark className="h-5 w-5 fill-current" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-normal font-serif tracking-tight text-[var(--text-primary)]">
                  Saved Bookmarks
                </h1>
                <p className="text-xs text-[var(--text-muted)] font-medium">
                  {questions.length} question{questions.length === 1 ? "" : "s"} saved for review
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-5 flex-1">
          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center gap-3 text-xs text-[var(--text-muted)] font-mono">
              <Loader2 className="h-6 w-6 animate-spin text-[var(--accent)]" />
              <span>Loading bookmarks...</span>
            </div>
          ) : questions.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-center p-8 bg-white rounded-[12px] border border-[var(--border)] shadow-sm max-w-md mx-auto">
              <div className="p-4 rounded-[12px] bg-[var(--accent-subtle)] text-[var(--accent)] mb-4">
                <Bookmark className="h-8 w-8 opacity-75" />
              </div>
              <h2 className="text-lg font-bold text-[var(--text-primary)]">No Bookmarks Saved</h2>
              <p className="text-xs text-[var(--text-muted)] mt-1.5 leading-relaxed">
                Tap the bookmark icon on any flashcard or question to save it for targeted practice.
              </p>
              <button
                onClick={() => router.push("/library")}
                className="mt-6 px-6 py-2.5 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs font-bold uppercase tracking-wider rounded-[11px] transition-all shadow-sm active:scale-95 flex items-center gap-2"
              >
                <span>Explore Topics</span>
                <ArrowRight size={14} />
              </button>
            </div>
          ) : (
            <>
              {/* Filter & Search Bar */}
              <div className="flex flex-row items-center gap-2 sm:gap-3 w-full">
                {topics.length > 1 && (
                  <div className="w-36 sm:w-48 shrink-0">
                    <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                      <SelectTrigger className="h-10 rounded-[10px] bg-white border-[var(--border)] text-xs font-semibold px-3 shadow-xs">
                        <SelectValue placeholder="All Topics" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-[var(--border)] rounded-[12px] shadow-xl">
                        <SelectItem value="all">All Topics</SelectItem>
                        {topics.map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="relative flex-1 min-w-0">
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search bookmarks..."
                    className="h-10 pl-9 pr-3 rounded-[10px] bg-white border-[var(--border)] text-xs placeholder:text-[var(--text-muted)] w-full shadow-xs focus:ring-2 focus:ring-[var(--accent)]/15"
                  />
                  <Search className="absolute left-3 top-3 h-4 w-4 text-[var(--text-muted)]" />
                </div>

                <button
                  onClick={startSession}
                  disabled={filteredQuestions.length === 0}
                  className="h-10 px-4 bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-50 text-white rounded-[10px] font-bold text-xs uppercase tracking-wider transition-all shadow-sm active:scale-95 flex items-center justify-center gap-1.5 shrink-0 ml-auto"
                >
                  <Play size={13} fill="currentColor" />
                  <span className="hidden sm:inline">Practice Deck</span>
                  <span className="sm:hidden">Practice</span>
                  <span>({filteredQuestions.length})</span>
                </button>
              </div>

              {/* Questions Multi-Column Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {filteredQuestions.map((q, idx) => {
                  const isExpanded = !!expandedIds[q.id];
                  return (
                    <div
                      key={q.id}
                      className="rounded-[11px] border border-[var(--border)] bg-white p-4 shadow-sm flex flex-col justify-between hover:border-[var(--accent)]/40 hover:shadow-md transition-all group"
                    >
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="font-mono text-xs font-bold text-[var(--text-muted)]">
                              #{(idx + 1).toString().padStart(2, "0")}
                            </span>
                            {q.topicName && (
                              <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-[6px] bg-[var(--bg-subtle)] text-[var(--text-secondary)] border border-[var(--border)] truncate">
                                {q.topicName}
                              </span>
                            )}
                          </div>
                          <BookmarkButton questionId={q.id} size={15} />
                        </div>

                        <h2 className="text-xs sm:text-[13px] font-semibold text-[var(--text-primary)] leading-relaxed">
                          {q.question}
                        </h2>
                      </div>

                      <div className="pt-2.5 mt-2.5 border-t border-[var(--border)] flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => toggleExpand(q.id)}
                          className="text-[11px] font-bold text-[var(--accent)] hover:text-[var(--accent-hover)] flex items-center gap-1 transition-colors"
                        >
                          <BookOpen size={12} />
                          <span>{isExpanded ? "Hide Answer" : "View Answer"}</span>
                          <ChevronRight
                            size={12}
                            className={`transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}
                          />
                        </button>
                      </div>

                      {isExpanded && (
                        <div className="pt-3 mt-3 border-t border-[var(--border)] text-xs text-[var(--text-secondary)] leading-relaxed">
                          <ContentRenderer
                            content={q.answer}
                            code={q.code}
                            image={q.imageUrl || q.image}
                            image2={q.image2}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
