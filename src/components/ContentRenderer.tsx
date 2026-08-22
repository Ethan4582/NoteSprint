"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

interface ContentRendererProps {
  content?: string;
  code?: string;
  image?: string;
  image2?: string;
  onImageClick?: (src: string) => void;
}

export default function ContentRenderer({
  content = "",
  code,
  image,
  image2,
  onImageClick,
}: ContentRendererProps) {
  // Pre-process legacy image tags and HTML tags to standard markdown
  const processedContent = (content || "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/?strong>/gi, "**")
    .replace(/<\/?b>/gi, "**")
    .replace(/<\/?em>/gi, "*")
    .replace(/<\/?i>/gi, "*")
    .replace(
      /\$\{image\("([^"]+)"\)\}/gi,
      (_match, imgPath: string) => {
        let resolved = imgPath.trim();
        if (!resolved.startsWith("http") && !resolved.startsWith("/")) {
          resolved = resolved.startsWith("assets/") ? `/${resolved}` : `/assets/theory/${resolved}`;
        }
        return `\n\n![diagram](${resolved})\n\n`;
      }
    );

  return (
    <div className="w-full space-y-4 animate-in fade-in duration-300">
      <div className="text-[15px] sm:text-[16px] leading-relaxed text-[var(--text-primary)] break-words">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkBreaks]}
          components={{
            h1: ({ children }) => (
              <h1 className="text-2xl font-black tracking-tight text-[var(--text-primary)] mt-6 mb-3 border-b border-[var(--border)] pb-2">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-xl font-bold tracking-tight text-[var(--text-primary)] mt-5 mb-2.5">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-lg font-bold text-[var(--text-primary)] mt-4 mb-2">
                {children}
              </h3>
            ),
            p: ({ children }) => (
              <p className="my-2.5 leading-relaxed text-[var(--text-primary)] font-normal">
                {children}
              </p>
            ),
            strong: ({ children }) => (
              <strong className="font-bold text-[var(--text-primary)] text-[var(--accent-text)]">
                {children}
              </strong>
            ),
            em: ({ children }) => <em className="italic text-[var(--text-secondary)]">{children}</em>,
            ul: ({ children }) => (
              <ul className="list-disc list-inside space-y-1.5 my-3 pl-2 text-[var(--text-primary)]">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal list-inside space-y-1.5 my-3 pl-2 text-[var(--text-primary)]">
                {children}
              </ol>
            ),
            li: ({ children }) => <li className="leading-relaxed">{children}</li>,
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-[var(--accent)] pl-4 py-2 my-3 italic bg-[var(--bg-subtle)]/50 rounded-r-xl text-[var(--text-secondary)]">
                {children}
              </blockquote>
            ),
            a: ({ href, children }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent)] underline hover:text-[var(--accent-hover)] transition-colors font-medium"
              >
                {children}
              </a>
            ),
            img: ({ src, alt }) => {
              if (!src) return null;
              let imageSrc = typeof src === "string" ? src.trim() : "";
              imageSrc = imageSrc.replace(/^(\.\.\/)+/, "").replace(/^\/?public\//, "/");
              if (!imageSrc.startsWith("http://") && !imageSrc.startsWith("https://") && !imageSrc.startsWith("/")) {
                imageSrc = "/" + imageSrc;
              }

              return (
                <span className="block my-4 rounded-xl border border-[var(--border-strong)] overflow-hidden bg-[var(--bg-surface)] shadow-md group">
                  <img
                    src={imageSrc}
                    alt={alt || "Content image"}
                    className="max-w-full max-h-[45vh] w-auto h-auto mx-auto object-contain cursor-zoom-in group-hover:scale-[1.01] transition-transform duration-300"
                    onClick={() => imageSrc && onImageClick?.(imageSrc)}
                  />
                </span>
              );
            },
            code: ({ className, children }) => {
              const isBlock = Boolean(className);
              if (isBlock) {
                return (
                  <pre className="bg-[#0f0f0f] p-4 sm:p-5 rounded-xl text-[13px] sm:text-[14px] border border-[var(--border)] font-mono overflow-x-auto text-gray-200 shadow-lg my-4 leading-relaxed">
                    <code>{children}</code>
                  </pre>
                );
              }
              return (
                <code className="bg-[var(--bg-subtle)] px-1.5 py-0.5 rounded text-xs font-mono text-[var(--accent)] border border-[var(--border)]">
                  {children}
                </code>
              );
            },
          }}
        >
          {processedContent}
        </ReactMarkdown>
      </div>

      {/* Legacy Fallback for images */}
      {!content.includes("${image(") && (image || image2) && (
        <div className="flex flex-col gap-4 pt-4 border-t border-[var(--border)] border-dashed items-center">
          {image && (
            <div
              className="w-full max-w-2xl rounded-xl border border-[var(--border)] overflow-hidden bg-[var(--bg-surface)] cursor-zoom-in shadow-sm hover:border-[var(--accent)] transition-all flex justify-center"
              onClick={() => onImageClick?.(image)}
            >
              <img src={image} className="max-w-full max-h-[40vh] object-contain" alt="Reference" />
            </div>
          )}
          {image2 && (
            <div
              className="w-full max-w-2xl rounded-xl border border-[var(--border)] overflow-hidden bg-[var(--bg-surface)] cursor-zoom-in shadow-sm hover:border-[var(--accent)] transition-all flex justify-center"
              onClick={() => onImageClick?.(image2)}
            >
              <img src={image2} className="max-w-full max-h-[40vh] object-contain" alt="Reference" />
            </div>
          )}
        </div>
      )}

      {/* Additional Code Snippet */}
      {code && (
        <div className="space-y-2 pt-4">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
            <span className="text-[11px] font-black text-[var(--text-muted)] uppercase tracking-widest">
              Code Implementation
            </span>
          </div>
          <pre className="bg-[#0f0f0f] p-4 rounded-xl text-xs sm:text-sm border border-[var(--border)] font-mono overflow-x-auto text-gray-200">
            <code>{code}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
