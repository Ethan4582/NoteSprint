"use client";

import { useState, useEffect, useMemo } from "react";

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

export default function TableOfContents({ content }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  const headings = useMemo(() => {
    const regex = /^(##)\s+(.+)$/gm;
    const items: TOCItem[] = [];
    let match;
    while ((match = regex.exec(content)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      items.push({ id, text, level });
    }
    return items;
  }, [content]);

  useEffect(() => {
    if (headings.length === 0) return;

    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleObserver, {
      rootMargin: "0px 0px -80% 0px",
    });

    const timer = setTimeout(() => {
      headings.forEach((item) => {
        const element = document.getElementById(item.id);
        if (element) {
          observer.observe(element);
        }
      });
    }, 500);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="max-h-[calc(100vh-8rem)] overflow-y-auto pr-4 custom-scrollbar">
      <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-4 px-3">
        On this page
      </h3>
      <ul className="space-y-1 relative border-l border-[var(--border-outer)] ml-3">
        {headings.map((heading) => (
          <li key={heading.id} className="relative">
            <a
              href={`#${heading.id}`}
              className={`block py-1.5 px-4 text-sm transition-all duration-200 ${
                activeId === heading.id
                  ? "text-[var(--text-primary)] font-bold bg-[var(--bg-surface)] rounded-r-lg"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] rounded-r-lg"
              }`}
              style={{
                paddingLeft: heading.level === 3 ? "1.5rem" : "1rem",
              }}
            >
              {heading.text}
            </a>
            {activeId === heading.id && (
              <div className="absolute left-[-1px] top-1/2 -translate-y-1/2 w-0.5 h-6 bg-[var(--accent)] rounded-r-full" />
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
