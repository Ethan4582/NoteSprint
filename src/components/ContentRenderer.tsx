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
  // Regex to match ${image("path")} pattern
  const imageRegex = /\${image\("([^"]+)"\)}/g;

  // Split content by image tags and <br> tags
  // We'll treat <br> as part of text chunks and let browser handle it via dangerouslySetInnerHTML
  const parts = content.split(imageRegex);
  
  // Extract all image paths found by the regex
  const inlineImages: string[] = [];
  let match;
  while ((match = imageRegex.exec(content)) !== null) {
    inlineImages.push(match[1].trim());
  }

  return (
    <div className="space-y-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-4">
        {parts.map((part, index) => {
          // Even indices are text chunks, odd are image paths (from split)
          if (index % 2 === 0) {
            if (!part.trim() && index !== 0) return null;
            
            // Format points: detect "1. ", "2. " etc or bullet points "• " or "- " 
            // and ensure they start on a new line if they don't already.
            const formattedPart = part
              .replace(/(\d+\.\s+)/g, (match, p1, offset) => {
                return offset > 0 ? `\n${p1}` : p1;
              })
              .replace(/([•\-]\s+)/g, (match, p1, offset) => {
                return offset > 0 ? `\n${p1}` : p1;
              });

            return (
              <div
                key={`text-${index}`}
                className="text-[15px] sm:text-[17px] leading-relaxed text-[var(--text-primary)] whitespace-pre-wrap break-words"
                dangerouslySetInnerHTML={{ __html: formattedPart.replace(/\n/g, '<br/>') }}
              />
            );
          } else {
            const imgPath = part.trim();
            const fullPath = imgPath.startsWith('/') ? imgPath : `/assets/theory/${imgPath}`;
            return (
              <div
                key={`inline-img-${index}`}
                className="my-4 rounded-[8px] border border-[var(--border)] overflow-hidden bg-[var(--bg-base)] cursor-zoom-in hover:opacity-95 transition-all shadow-sm"
                onClick={() => onImageClick?.(fullPath)}
              >
                <img
                  src={fullPath}
                  alt="Content reference"
                  className="w-full h-auto object-contain"
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
              </div>
            );
          }
        })}
      </div>

      {/* Render legacy image properties if they aren't already included in the content */}
      {(image || image2) && (
        <div className="grid grid-cols-1 gap-4 pt-4 border-t border-[var(--border)] border-dashed">
          {image && !content.includes(image) && (
            <div
              className="rounded-[12px] border border-[var(--border)] overflow-hidden bg-[var(--bg-base)] cursor-zoom-in shadow-sm"
              onClick={() => onImageClick?.(image)}
            >
              <img src={image} className="w-full h-auto" alt="Reference" />
            </div>
          )}
          {image2 && !content.includes(image2) && (
            <div
              className="rounded-[12px] border border-[var(--border)] overflow-hidden bg-[var(--bg-base)] cursor-zoom-in shadow-sm"
              onClick={() => onImageClick?.(image2)}
            >
              <img src={image2} className="w-full h-auto" alt="Reference" />
            </div>
          )}
        </div>
      )}

      {code && (
        <div className="space-y-2 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">
              Code Snippet
            </span>
          </div>
          <div className="relative group">
            <pre className="bg-[#1a1a1a] p-4 rounded-[8px] text-[13px] border border-[var(--border)] font-mono overflow-x-auto text-gray-200 shadow-lg scrollbar-thin scrollbar-thumb-[var(--border)]">
              <code className="block min-w-full">{code}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
