"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <article className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-[var(--accent)] prose-a:no-underline hover:prose-a:underline prose-pre:bg-[#0f0f0f] prose-pre:border prose-pre:border-[var(--border)] prose-img:rounded-xl prose-img:border prose-img:border-[var(--border)]">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </article>
  );
}
