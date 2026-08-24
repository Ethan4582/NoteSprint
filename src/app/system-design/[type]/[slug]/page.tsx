import { getArticleBySlug } from "@/src/db";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";
import Link from "next/link";
import ClientMarkdownRenderer from "@/src/components/read/ClientMarkdownRenderer";
import TableOfContents from "@/src/components/read/TableOfContents";

export const revalidate = 3600;

export default async function MarkdownReaderPage({
  params,
}: {
  params: Promise<{ type: string; slug: string }>;
}) {
  const { type, slug } = await params;

  let article = null;
  try {
    article = await getArticleBySlug(slug);
  } catch (err) {
    console.warn("Error fetching article by slug:", err);
  }

  if (!article) {
    notFound();
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
