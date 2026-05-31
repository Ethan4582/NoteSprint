"use client";

import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";

const slugify = (text: string) => {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
};

const components: Components = {
  h1: ({ node, ...props }) => {
    const id = typeof props.children === 'string' ? slugify(props.children) : '';
    return <h1 id={id} className="text-3xl sm:text-4xl font-extrabold mt-12 mb-6 tracking-tight text-[var(--text-primary)]" {...props} />;
  },
  h2: ({ node, ...props }) => {
    const text = String(props.children);
    const id = slugify(text);
    return <h2 id={id} className="text-2xl sm:text-3xl font-bold mt-10 mb-4 pb-2 border-b border-[var(--border-outer)] tracking-tight text-[var(--text-primary)] scroll-mt-24" {...props} />;
  },
  h3: ({ node, ...props }) => {
    const text = String(props.children);
    const id = slugify(text);
    return <h3 id={id} className="text-xl sm:text-2xl font-semibold mt-8 mb-4 tracking-tight text-[var(--text-primary)] scroll-mt-24" {...props} />;
  },
  p: ({ node, ...props }) => (
    <p className="leading-relaxed mb-5 text-sm sm:text-base text-[var(--text-secondary)]" {...props} />
  ),
  a: ({ node, ...props }) => (
    <a className="text-[var(--accent)] hover:underline font-medium" target="_blank" rel="noopener noreferrer" {...props} />
  ),
  blockquote: ({ node, ...props }) => (
    <blockquote className="border-l-4 border-[var(--accent)] pl-4 py-1 my-5 italic text-sm sm:text-base text-[var(--text-muted)] [&>p]:mb-0" {...props} />
  ),
  ul: ({ node, ...props }) => (
    <ul className="list-disc list-outside ml-6 mb-5 space-y-1.5 text-sm sm:text-base text-[var(--text-secondary)] marker:text-[var(--text-muted)]" {...props} />
  ),
  ol: ({ node, ...props }) => (
    <ol className="list-decimal list-outside ml-6 mb-5 space-y-1.5 text-sm sm:text-base text-[var(--text-secondary)] marker:text-[var(--text-muted)] font-medium" {...props} />
  ),
  li: ({ node, ...props }) => (
    <li className="leading-relaxed pl-1" {...props} />
  ),
  table: ({ node, ...props }) => (
    <div className="w-full overflow-x-auto my-6 sm:my-8 rounded-xl border border-[var(--border-outer)] shadow-sm">
      <table className="w-full text-left border-collapse text-sm sm:text-base break-words" {...props} />
    </div>
  ),
  thead: ({ node, ...props }) => (
    <thead className="bg-[var(--bg-surface)] border-b border-[var(--border-outer)]" {...props} />
  ),
  th: ({ node, ...props }) => (
    <th className="px-3 py-2 sm:px-6 sm:py-4 text-xs sm:text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider" {...props} />
  ),
  td: ({ node, ...props }) => (
    <td className="px-3 py-2 sm:px-6 sm:py-4 text-[13px] sm:text-sm text-[var(--text-secondary)] border-b border-[var(--border-inner)] last:border-0 align-top" {...props} />
  ),
  img: ({ node, ...props }) => {
    let src = props.src;
    if (src && src.includes('/public/')) {
      src = src.split('/public')[1];
    }
    return (
      <span className="block my-6 sm:my-8">
        <img src={src} className="max-w-full h-auto rounded-xl border border-[var(--border-outer)] shadow-md mx-auto object-contain max-h-[70vh]" loading="lazy" alt={props.alt || ''} />
        {props.alt && <span className="block text-center text-xs sm:text-sm text-[var(--text-muted)] mt-2 sm:mt-3 italic">{props.alt}</span>}
      </span>
    );
  },
  pre: ({ node, ...props }) => (
    <div className="relative group my-6 sm:my-8">
      <pre className="bg-[#0f0f0f] text-gray-100 p-3 sm:p-6 rounded-xl overflow-x-auto whitespace-pre-wrap break-words text-xs sm:text-[15px] leading-relaxed border border-[#2a2a2a] shadow-inner font-mono scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent" {...props} />
    </div>
  ),
  code: ({ node, inline, ...props }: any) => {
    if (inline) {
      return <code className="bg-[var(--bg-surface)] text-[var(--text-primary)] px-1.5 py-0.5 rounded-md font-mono text-[0.9em] border border-[var(--border-inner)] mx-0.5" {...props} />;
    }
    return <code className="block min-w-full" {...props} />;
  }
};

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <article className="max-w-none break-words">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </article>
  );
}
