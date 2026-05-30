"use client";

import dynamic from "next/dynamic";

const MarkdownRenderer = dynamic(() => import("./MarkdownRenderer"), {
  ssr: false,
  loading: () => <div className="animate-pulse space-y-4">
    <div className="h-8 bg-[var(--bg-surface)] rounded w-3/4"></div>
    <div className="h-4 bg-[var(--bg-surface)] rounded"></div>
    <div className="h-4 bg-[var(--bg-surface)] rounded w-5/6"></div>
  </div>
});

export default function ClientMarkdownRenderer({ content }: { content: string }) {
  return <MarkdownRenderer content={content} />;
}
