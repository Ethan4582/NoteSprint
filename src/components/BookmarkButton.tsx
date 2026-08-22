"use client";

import { Bookmark } from "lucide-react";
import { useBookmarks } from "@/src/hooks/useBookmarks";
import { cn } from "@/src/lib/utils";

interface BookmarkButtonProps {
  questionId: number;
  className?: string;
  size?: number;
}

export default function BookmarkButton({ questionId, className, size = 16 }: BookmarkButtonProps) {
  const { isBookmarked, toggle } = useBookmarks();
  const bookmarked = isBookmarked(questionId);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        toggle(questionId);
      }}
      className={cn(
        "p-1.5 rounded-lg transition-all active:scale-90 flex items-center justify-center",
        bookmarked
          ? "text-[var(--accent)] bg-[var(--accent)]/15 hover:bg-[var(--accent)]/25"
          : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]",
        className
      )}
      title={bookmarked ? "Remove bookmark" : "Bookmark question"}
      aria-label={bookmarked ? "Remove bookmark" : "Bookmark question"}
    >
      <Bookmark
        size={size}
        className={cn("transition-all", bookmarked && "fill-current scale-110")}
      />
    </button>
  );
}
