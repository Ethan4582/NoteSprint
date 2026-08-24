"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";
import Link from "next/link";
import ClientMarkdownRenderer from "@/src/components/read/ClientMarkdownRenderer";
import TableOfContents from "@/src/components/read/TableOfContents";
import ArticleReaderSkeleton from "@/src/components/read/ArticleReaderSkeleton";
import type { Article } from "@/src/db/schema";

export default function MarkdownReaderPage() {
  const params = useParams();
  const type = (params?.type as string) || "hld";
  const slug = (params?.slug as string) || "";

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`/api/articles/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Article not found");
        return res.json() as Promise<Article>;
      })
      .then((data: Article) => {
        setArticle(data);
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return <ArticleReaderSkeleton />;
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-[var(--bg-base)] flex flex-col items-center justify-center gap-4 text-center px-4">
        <h1 className="text-xl font-bold">Article not found</h1>
        <Link
          href="/system-design/articles"
          className="text-xs font-bold text-[var(--accent)] hover:underline flex items-center gap-1"
        >
          <ArrowLeft size={14} /> Back to Articles
        </Link>
      </div>
    );
  }

  const content = article.content || "";
  const title = article.title || slug.replace(/_/g, " ");
  const readingTime = article.readingTime || Math.max(1, Math.ceil(content.split(/\s+/).length / 200));

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] selection:bg-[var(--accent)] selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-[60] bg-white/90 backdrop-blur-xl border-b border-[var(--border)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/system-design/articles"
              className="w-9 h-9 rounded-[10px] flex items-center justify-center bg-white border border-[var(--border)] hover:bg-[var(--bg-subtle)] transition-all text-[var(--text-secondary)] hover:text-[var(--text-primary)] shadow-xs"
            >
              <ArrowLeft size={16} />
            </Link>
            <div className="flex flex-col">
              <h1 className="text-sm sm:text-base font-extrabold tracking-tight truncate max-w-[240px] sm:max-w-md">
                {title}
              </h1>
              <span className="text-[11px] text-[var(--text-muted)] font-mono uppercase flex items-center gap-2">
                <span className="flex items-center gap-1">
                  <Clock size={11} /> {readingTime} min read
                </span>
                <span>•</span>
                <span>{type.toUpperCase()}</span>
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Reader Content */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-12 pb-32">
        <div className="relative flex justify-center">
          <aside className="hidden xl:block absolute right-[calc(50%+24rem+2rem)] w-[220px] top-0 h-full">
            <div className="sticky top-24">
              <TableOfContents content={content} />
            </div>
          </aside>

          <div className="w-full max-w-3xl bg-white p-6 sm:p-12 rounded-[12px] border border-[var(--border)] shadow-sm">
            <ClientMarkdownRenderer content={content} />
          </div>
        </div>
      </main>
    </div>
  );
}
