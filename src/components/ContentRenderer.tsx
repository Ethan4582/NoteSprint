"use client";

import React from "react";

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
  
  const parseContent = (text: string) => {
    // Regex to match ${image("path")} pattern
    const imageRegex = /\$\{image\("([^"]+)"\)\}/gi;
    
    // Split by the regex, capturing the path
    const parts = text.split(imageRegex);
    
    const blocks: { type: 'text' | 'image', value: string }[] = [];
    
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (i % 2 === 0) {
        // Text part (even indices)
        if (part) {
          blocks.push({ type: 'text', value: part });
        }
      } else {
        // Image path part (odd indices)
        if (part) {
          blocks.push({ type: 'image', value: part });
        }
      }
    }

    return blocks;
  };

  const hasInlineImages = content.includes('${image(');
  const blocks = parseContent(content);

  const resolveImagePath = (path: string) => {
    if (path.startsWith('http') || path.startsWith('/')) return path;
    if (path.startsWith('assets/')) return `/${path}`;
    return `/assets/theory/${path}`;
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
      {/* Dynamic Content Rendering */}
      <div className="flex flex-col gap-4">
        {blocks.map((block, index) => {
          if (block.type === 'text') {
            return (
              <div
                key={`text-${index}`}
                className="text-[16px] sm:text-[18px] leading-relaxed text-[var(--text-primary)] font-medium break-words opacity-95"
                dangerouslySetInnerHTML={{ 
                  __html: block.value
                    .replace(/(\d+\.\s+)/g, (match, p1, offset) => {
                      return offset > 0 ? `<br/><strong>${p1}</strong>` : `<strong>${p1}</strong>`;
                    })
                }}
              />
            );
          } else if (block.type === 'image') {
            const fullPath = resolveImagePath(block.value.trim());
            return (
              <div
                key={`img-${index}`}
                className="w-full my-2 rounded-[16px] border-2 border-[var(--border)] overflow-hidden bg-[var(--bg-surface)] cursor-zoom-in hover:border-[var(--accent)] transition-all shadow-md group"
                onClick={() => onImageClick?.(fullPath)}
              >
                <img
                  src={fullPath}
                  alt="Content diagram"
                  className="w-full h-auto object-contain group-hover:scale-[1.01] transition-transform duration-500"
                  onError={(e) => (e.currentTarget.parentElement!.style.display = 'none')}
                />
              </div>
            );
          }
          return null;
        })}
      </div>

      {/* Legacy Fallback for images */}
      {!hasInlineImages && (image || image2) && (
        <div className="grid grid-cols-1 gap-6 pt-6 border-t border-[var(--border)] border-dashed">
          {image && (
            <div
              className="rounded-[16px] border-2 border-[var(--border)] overflow-hidden bg-[var(--bg-surface)] cursor-zoom-in shadow-md hover:border-[var(--accent)] transition-all"
              onClick={() => onImageClick?.(image)}
            >
              <img src={image} className="w-full h-auto" alt="Reference" />
            </div>
          )}
          {image2 && (
            <div
              className="rounded-[16px] border-2 border-[var(--border)] overflow-hidden bg-[var(--bg-surface)] cursor-zoom-in shadow-md hover:border-[var(--accent)] transition-all"
              onClick={() => onImageClick?.(image2)}
            >
              <img src={image2} className="w-full h-auto" alt="Reference" />
            </div>
          )}
        </div>
      )}

      {/* Code Snippet */}
      {code && (
        <div className="space-y-3 pt-6">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]"></div>
            <span className="text-[11px] font-black text-[var(--text-muted)] uppercase tracking-widest">
              Code Implementation
            </span>
          </div>
          <div className="relative group">
            <pre className="bg-[#0f0f0f] p-5 sm:p-6 rounded-[16px] text-[13px] sm:text-[14px] border-2 border-[var(--border)] font-mono overflow-x-auto text-gray-300 shadow-xl scrollbar-thin scrollbar-thumb-[var(--border)]">
              <code className="block min-w-full leading-relaxed">{code}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}


