"use client";

import { useState, useEffect } from "react";
import { deleteUploadedImage } from "@/src/lib/admin-api";
import { Trash2, Copy, Check, ImageIcon, ExternalLink, Loader2, AlertTriangle } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/src/components/ui/popover";
import { Button } from "@/src/components/ui/button";

interface UploadedMediaManagerProps {
  content: string;
  onInsertImage?: (markdownTag: string) => void;
  onRemoveFromContent?: (imageUrl: string) => void;
  sessionImages?: string[];
}

export default function UploadedMediaManager({
  content,
  onInsertImage,
  onRemoveFromContent,
  sessionImages = [],
}: UploadedMediaManagerProps) {
  const [allImages, setAllImages] = useState<string[]>([]);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [deletingUrl, setDeletingUrl] = useState<string | null>(null);
  const [openPopoverUrl, setOpenPopoverUrl] = useState<string | null>(null);

  // Extract all markdown images from content + session uploads
  useEffect(() => {
    const regex = /!\[.*?\]\(([^)]+)\)/g;
    const matches: string[] = [];
    let match;
    while ((match = regex.exec(content)) !== null) {
      let rawUrl = match[1].trim();
      let cleanUrl = rawUrl.replace(/^(\.\.\/)+/, "").replace(/^\/?public\//, "/");
      if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://") && !cleanUrl.startsWith("/")) {
        cleanUrl = "/" + cleanUrl;
      }
      if (cleanUrl && !matches.includes(cleanUrl)) {
        matches.push(cleanUrl);
      }
    }
    for (const img of sessionImages) {
      let clean = (img || "").trim().replace(/^(\.\.\/)+/, "").replace(/^\/?public\//, "/");
      if (clean && !clean.startsWith("http://") && !clean.startsWith("https://") && !clean.startsWith("/")) {
        clean = "/" + clean;
      }
      if (clean && !matches.includes(clean)) {
        matches.push(clean);
      }
    }
    setAllImages(matches);
  }, [content, sessionImages]);

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const handleDelete = async (url: string) => {
    setDeletingUrl(url);
    try {
      await deleteUploadedImage(url);
      setAllImages((prev) => prev.filter((u) => u !== url));
      onRemoveFromContent?.(url);
      setOpenPopoverUrl(null);
    } catch (err) {
      alert(`Failed to delete image: ${(err as Error).message}`);
    } finally {
      setDeletingUrl(null);
    }
  };

  return (
    <div className="rounded-2xl border border-[var(--border-strong)] bg-raised p-5 shadow-raised-crisp space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <ImageIcon className="h-4 w-4 text-[var(--accent)]" />
          <span className="text-[11px] font-black uppercase tracking-wider text-[var(--text-secondary)]">
            Attached Media {allImages.length > 0 && `(${allImages.length})`}
          </span>
        </div>
      </div>

      {allImages.length === 0 ? (
        <p className="text-xs text-[var(--text-muted)] py-3 text-center">
          No images uploaded yet.
        </p>
      ) : (
        <div className="space-y-2 max-h-[260px] overflow-y-auto custom-scrollbar pr-1">
          {allImages.map((url, idx) => {
            const fileName = url.split("/").pop() || `image-${idx + 1}`;
            const isDeleting = deletingUrl === url;

            return (
              <div
                key={url}
                className="flex items-center gap-3 p-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] group hover:border-[var(--border-strong)] transition-all"
              >
                <div className="h-10 w-10 rounded-lg overflow-hidden bg-black/40 border border-[var(--border)] flex-shrink-0 flex items-center justify-center">
                  <img
                    src={url}
                    alt={fileName}
                    className="h-full w-full object-cover"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[var(--text-primary)] truncate" title={fileName}>
                    {fileName}
                  </p>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-[var(--accent)] hover:underline inline-flex items-center gap-0.5 mt-0.5"
                  >
                    Preview <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => handleCopy(url)}
                    className="h-7 w-7 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors"
                    title="Copy URL"
                  >
                    {copiedUrl === url ? (
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>

                  <Popover
                    open={openPopoverUrl === url}
                    onOpenChange={(isOpen) => setOpenPopoverUrl(isOpen ? url : null)}
                  >
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="h-7 w-7 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--error)] hover:bg-rose-500/10 transition-colors"
                        title="Delete from storage"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent align="end" className="w-64 space-y-3 p-4">
                      <div className="flex items-center gap-2 text-rose-500">
                        <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                        <span className="text-xs font-bold text-[var(--text-primary)]">Delete Image?</span>
                      </div>
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                        Are you sure about deleting this image from storage?
                      </p>
                      <div className="flex items-center justify-end gap-2 pt-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setOpenPopoverUrl(null)}
                          className="h-7 text-xs px-2.5"
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(url)}
                          disabled={isDeleting}
                          className="h-7 text-xs px-3"
                        >
                          {isDeleting ? <Loader2 className="h-3 w-3 animate-spin" /> : "Delete"}
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
