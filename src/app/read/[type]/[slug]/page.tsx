import { getMarkdownContent, getMarkdownFiles } from "@/src/lib/markdown";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";
import Link from "next/link";
import ThemeToggle from "@/src/components/ThemeToggle";
import ClientMarkdownRenderer from "@/src/components/read/ClientMarkdownRenderer";

// Note: Next.js page params might be async in newer versions, so we await them.
export async function generateStaticParams() {
  const lldFiles = await getMarkdownFiles("lld");
  const hldFiles = await getMarkdownFiles("hld");

  return [
    ...lldFiles.map((file) => ({ type: "lld", slug: file.slug })),
    ...hldFiles.map((file) => ({ type: "hld", slug: file.slug })),
  ];
}

export default async function MarkdownReaderPage({
  params,
}: {
  params: Promise<{ type: string; slug: string }>;
}) {
  const { type, slug } = await params;
  
  if (type !== "lld" && type !== "hld") {
    notFound();
  }

  const content = await getMarkdownContent(type as "lld" | "hld", slug);
  if (!content) {
    notFound();
  }

  // Extract title and reading time for the header
  const titleMatch = content.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1].trim() : slug.replace(/_/g, " ");
  const wordCount = content.split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] transition-colors duration-300 selection:bg-[var(--accent)] selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-[60] bg-[var(--bg-base)]/80 backdrop-blur-md border-b border-[var(--border)]">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/read"
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[var(--bg-surface)] transition-all text-[var(--text-secondary)]"
            >
              <ArrowLeft size={18} />
            </Link>
            <div className="flex flex-col">
              <h1 className="text-sm font-bold uppercase tracking-wider flex items-center gap-1.5 truncate max-w-[200px] sm:max-w-[400px]">
                {title}
              </h1>
              <span className="text-[10px] text-[var(--text-muted)] font-mono uppercase flex items-center gap-2">
                <span className="flex items-center gap-1"><Clock size={10} /> {readingTime} min</span>
                <span>•</span>
                <span>{type.toUpperCase()}</span>
              </span>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Reader Content */}
      <main className="max-w-3xl mx-auto px-6 py-12 pb-32">
        <ClientMarkdownRenderer content={content} />
      </main>
    </div>
  );
}
