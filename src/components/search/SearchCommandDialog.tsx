"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, BookOpen, Layers, Sparkles, X } from "lucide-react";
import { DATA } from "@/src/lib/data";
import { fetchTopics, fetchArticles, TopicWithCount } from "@/src/lib/api";
import type { Article } from "@/src/db/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog";

interface SearchCommandDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SearchCommandDialog({ open, onOpenChange }: SearchCommandDialogProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [dbTopics, setDbTopics] = useState<TopicWithCount[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    if (!open) return;
    fetchTopics().then((res) => {
      if (res && res.length > 0) setDbTopics(res);
    });
    fetchArticles().then((res) => {
      if (res && res.length > 0) setArticles(res);
    });
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  const q = query.trim().toLowerCase();

  // 1. System Design Articles
  const matchedArticles = articles.filter((art) => {
    if (!q) return true;
    const matchTitle = art.title.toLowerCase().includes(q);
    let matchTag = false;
    try {
      if (art.tags) {
        const parsedTags: string[] = Array.isArray(art.tags)
          ? art.tags
          : JSON.parse(art.tags);
        matchTag = parsedTags.some((t) => t.toLowerCase().includes(q));
      }
    } catch {
      matchTag = (art.tags || "").toLowerCase().includes(q);
    }
    return matchTitle || matchTag;
  });

  // All topics list
  const allTopics = dbTopics.length > 0
    ? dbTopics.map((t) => ({
        slug: t.slug,
        name: t.name || t.slug.replace(/^interview_/, "").replace(/_/g, " "),
        count: t.questionCount,
        isInterview: t.slug.startsWith("interview_"),
      }))
    : Object.keys(DATA).map((topic) => ({
        slug: topic,
        name: topic.replace(/^interview_/, "").replace(/_/g, " "),
        count: 0,
        isInterview: topic.startsWith("interview_"),
      }));

  // 2. Interview Topics
  const matchedInterviews = allTopics
    .filter((t) => t.isInterview)
    .filter((t) => !q || t.name.toLowerCase().includes(q) || t.slug.toLowerCase().includes(q));

  // 3. Flashcard Topics
  const matchedFlashcards = allTopics
    .filter((t) => !t.isInterview)
    .filter((t) => !q || t.name.toLowerCase().includes(q) || t.slug.toLowerCase().includes(q));

  const displayedArticles = q ? matchedArticles : matchedArticles.slice(0, 2);
  const displayedInterviews = q ? matchedInterviews : matchedInterviews.slice(0, 2);
  const displayedFlashcards = q ? matchedFlashcards : matchedFlashcards.slice(0, 3);

  const hasAnyResults =
    displayedArticles.length > 0 ||
    displayedInterviews.length > 0 ||
    displayedFlashcards.length > 0;

  const handleSelectArticle = (article: Article) => {
    onOpenChange(false);
    setQuery("");
    const category = article.category === "lld" ? "lld" : "hld";
    router.push(`/system-design/${category}/${article.slug}`);
  };

  const handleSelectTopic = (topic: { slug: string; isInterview: boolean }) => {
    onOpenChange(false);
    setQuery("");
    if (topic.isInterview) {
      router.push(`/interview?topic=${topic.slug}`);
    } else {
      router.push(`/session?topic=${topic.slug}&count=10&time=5&mode=flashcard`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-0 overflow-hidden bg-white border border-[var(--border)] rounded-[12px] shadow-2xl [&>button:last-child]:hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>Search System Design, Interview, and Flashcards</DialogTitle>
        </DialogHeader>

        {/* Clean Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)] bg-white">
          <Search className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
          <input
            type="text"
            placeholder="Search system design, interview, flashcards..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-xs sm:text-sm font-medium text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none"
            autoFocus
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
            >
              <X size={15} />
            </button>
          ) : (
            <kbd
              onClick={() => onOpenChange(false)}
              className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-[var(--bg-subtle)] border border-[var(--border)] text-[var(--text-muted)] cursor-pointer select-none shadow-2xs"
            >
              ESC
            </kbd>
          )}
        </div>

        {/* Results Container with Hidden Scrollbar */}
        <div className="max-h-[380px] overflow-y-auto scrollbar-hide p-3 space-y-4">
          {/* Section 1: System Design */}
          {displayedArticles.length > 0 && (
            <div className="space-y-1">
              <div className="px-2 py-1 text-xs font-bold uppercase tracking-wider text-[var(--accent)] flex items-center justify-between">
                <span>System Design</span>
                <span className="text-[10px] font-mono text-[var(--text-muted)] lowercase font-normal">reading</span>
              </div>
              <div className="space-y-0.5">
                {displayedArticles.map((art) => (
                  <button
                    key={art.slug}
                    onClick={() => handleSelectArticle(art)}
                    className="w-full flex items-center justify-between p-2 rounded-[8px] hover:bg-[var(--bg-subtle)] text-left transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="p-1.5 rounded-[6px] bg-[var(--bg-subtle)] text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors shrink-0">
                        <BookOpen size={13} />
                      </div>
                      <span className="text-xs font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] truncate">
                        {art.title}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-[var(--text-muted)] font-mono shrink-0 ml-2">
                      {(art.category || "HLD").toUpperCase()}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Section 2: Interview Sessions */}
          {displayedInterviews.length > 0 && (
            <div className="space-y-1">
              <div className="px-2 py-1 text-xs font-bold uppercase tracking-wider text-[var(--accent)] flex items-center justify-between">
                <span>Interview Sessions</span>
                <span className="text-[10px] font-mono text-[var(--text-muted)] lowercase font-normal">drills</span>
              </div>
              <div className="space-y-0.5">
                {displayedInterviews.map((t) => (
                  <button
                    key={t.slug}
                    onClick={() => handleSelectTopic(t)}
                    className="w-full flex items-center justify-between p-2 rounded-[8px] hover:bg-[var(--bg-subtle)] text-left transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="p-1.5 rounded-[6px] bg-[var(--bg-subtle)] text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors shrink-0">
                        <Sparkles size={13} />
                      </div>
                      <span className="text-xs font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] truncate capitalize">
                        {t.name}
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold text-[var(--text-muted)] font-mono shrink-0 ml-2">
                      Interview
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Section 3: Flashcards */}
          {displayedFlashcards.length > 0 && (
            <div className="space-y-1">
              <div className="px-2 py-1 text-xs font-bold uppercase tracking-wider text-[var(--accent)] flex items-center justify-between">
                <span>Flashcards</span>
                <span className="text-[10px] font-mono text-[var(--text-muted)] lowercase font-normal">active recall</span>
              </div>
              <div className="space-y-0.5">
                {displayedFlashcards.map((t) => (
                  <button
                    key={t.slug}
                    onClick={() => handleSelectTopic(t)}
                    className="w-full flex items-center justify-between p-2 rounded-[8px] hover:bg-[var(--bg-subtle)] text-left transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="p-1.5 rounded-[6px] bg-[var(--bg-subtle)] text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors shrink-0">
                        <Layers size={13} />
                      </div>
                      <span className="text-xs font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] truncate capitalize">
                        {t.name}
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold text-[var(--text-muted)] font-mono shrink-0 ml-2">
                      {t.count ? `${t.count} cards` : "Flashcards"}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {!hasAnyResults && (
            <div className="py-12 text-center text-xs text-[var(--text-muted)]">
              No matching results found for &quot;{query}&quot;
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
