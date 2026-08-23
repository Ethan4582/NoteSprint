"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, BookOpen, Layers, X, Sparkles, Tag } from "lucide-react";
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
    fetchTopics().then((res) => {
      if (res && res.length > 0) setDbTopics(res);
    });
    fetchArticles().then((res) => {
      if (res && res.length > 0) setArticles(res);
    });
  }, []);

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

  // Extract all articles and tags
  const matchedArticles = articles.filter((art) => {
    if (!query) return false;
    const q = query.toLowerCase();
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

  const allTopics = dbTopics.length > 0
    ? dbTopics.map((t) => ({ slug: t.slug, name: t.name || t.slug.replace(/^interview_/, "").replace(/_/g, " "), count: t.questionCount, isInterview: t.slug.startsWith("interview_") }))
    : Object.keys(DATA).map((topic) => ({
        slug: topic,
        name: topic.replace(/^interview_/, "").replace(/_/g, " "),
        count: 0,
        isInterview: topic.startsWith("interview_"),
      }));

  const filteredTopics = allTopics.filter((t) =>
    t.name.toLowerCase().includes(query.toLowerCase()) || t.slug.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelectTopic = (topic: { slug: string; isInterview: boolean }) => {
    onOpenChange(false);
    setQuery("");
    if (topic.isInterview) {
      router.push(`/interview?topic=${topic.slug}`);
    } else {
      router.push(`/session?topic=${topic.slug}&count=10&time=5&mode=flashcard`);
    }
  };

  const handleSelectArticle = (article: Article) => {
    onOpenChange(false);
    setQuery("");
    const category = article.category === "lld" ? "lld" : "hld";
    router.push(`/system-design/${category}/${article.slug}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-0 overflow-hidden bg-white border border-[var(--border)] rounded-[12px] shadow-2xl">
        <DialogHeader className="sr-only">
          <DialogTitle>Search Topics, Tags, and Reading Articles</DialogTitle>
        </DialogHeader>

        {/* Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[var(--border)] bg-[var(--bg-subtle)]/50">
          <Search className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
          <input
            type="text"
            placeholder="Search tags, reading articles, system design, flashcards..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-xs sm:text-sm font-medium text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 rounded-[6px] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              <X size={14} />
            </button>
          )}
          <kbd className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded-[6px] bg-white border border-[var(--border)] text-[var(--text-muted)]">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-[var(--border)]/40 space-y-2">
          {/* Article & Reading Tag Results (Routed directly to reading) */}
          {matchedArticles.length > 0 && (
            <div className="space-y-1 pb-1">
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--accent)] flex items-center gap-1.5">
                <Tag size={12} />
                <span>Reading & System Design Articles ({matchedArticles.length})</span>
              </div>
              {matchedArticles.slice(0, 6).map((art) => (
                <button
                  key={art.slug}
                  onClick={() => handleSelectArticle(art)}
                  className="w-full flex items-center justify-between p-2.5 rounded-[10px] bg-[var(--accent-subtle)]/40 hover:bg-[var(--accent-subtle)] text-left transition-colors group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="p-1.5 rounded-[8px] bg-white border border-[var(--accent)]/30 text-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-white transition-colors">
                      <BookOpen size={13} />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] truncate block">
                        {art.title}
                      </span>
                      <span className="text-[10px] text-[var(--text-muted)] font-mono">
                        {(art.category || "reading").toUpperCase()} · Read article
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-[6px] bg-white border border-[var(--accent)]/30 text-[var(--accent)]">
                    Reading
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Flashcards & Practice Topics */}
          {filteredTopics.length > 0 && (
            <div className="space-y-1 pt-1">
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                Flashcard & Practice Decks ({filteredTopics.length})
              </div>
              {filteredTopics.slice(0, 8).map((t) => (
                <button
                  key={t.slug}
                  onClick={() => handleSelectTopic(t)}
                  className="w-full flex items-center justify-between p-2.5 rounded-[10px] hover:bg-[var(--bg-subtle)] text-left transition-colors group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="p-1.5 rounded-[8px] bg-white border border-[var(--border)] text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors">
                      {t.isInterview ? <Sparkles size={13} /> : <Layers size={13} />}
                    </div>
                    <span className="text-xs font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] truncate capitalize">
                      {t.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold text-[var(--text-muted)] font-mono">
                      {t.isInterview ? "Interview" : "Flashcards"}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {matchedArticles.length === 0 && filteredTopics.length === 0 && (
            <div className="py-12 text-center text-xs text-[var(--text-muted)]">
              No matching tags, articles, or decks found for &quot;{query}&quot;
            </div>
          )}

          {/* Quick Nav shortcut */}
          <div className="pt-2">
            <button
              onClick={() => {
                onOpenChange(false);
                router.push(`/system-design/articles${query ? `?search=${encodeURIComponent(query)}` : ""}`);
              }}
              className="w-full flex items-center gap-2.5 p-2 rounded-[10px] hover:bg-[var(--bg-subtle)] text-left text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
            >
              <div className="p-1.5 rounded-[8px] bg-white border border-[var(--border)]">
                <BookOpen size={13} />
              </div>
              <span>Search System Design Reading & Articles</span>
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
