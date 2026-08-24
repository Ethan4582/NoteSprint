"use client";

import Link from "next/link";
import type { Article } from "@/src/db/schema";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { Edit2, Trash2, Clock, MoreVertical, ExternalLink } from "lucide-react";

interface AdminArticleCardProps {
  article: Article;
  onDelete: (slug: string) => void;
}

export default function AdminArticleCard({ article, onDelete }: AdminArticleCardProps) {
  let tags: string[] = [];
  try {
    if (article.tags) tags = Array.isArray(article.tags) ? article.tags : JSON.parse(article.tags);
  } catch {
    tags = article.tags ? article.tags.split(",").map((t) => t.trim()) : [];
  }

  return (
    <div className="rounded-lg border border-[var(--border)] bg-white p-4 shadow-sm flex flex-col justify-between hover:border-[var(--accent)]/40 hover:shadow-md transition-all group">
      <div>
        <div className="flex items-start justify-between gap-3">
          <span className="text-[10px] font-bold text-[var(--accent)] uppercase tracking-wider bg-[var(--bg-subtle)] px-2 py-0.5 rounded border border-[var(--border)]">
            {article.category}
          </span>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="h-7 w-7 rounded-md flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors flex-shrink-0"
              >
                <MoreVertical className="h-3.5 w-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32 bg-white border-[var(--border)] rounded-md shadow-xl">
              <DropdownMenuItem asChild>
                <Link href={`/admin/articles/${article.slug}/edit`} className="cursor-pointer">
                  <Edit2 className="h-3.5 w-3.5 mr-2" /> Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/system-design/${article.category || "articles"}/${article.slug}`} target="_blank" className="cursor-pointer">
                  <ExternalLink className="h-3.5 w-3.5 mr-2" /> View Public
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => onDelete(article.slug)}
                className="cursor-pointer text-red-600 focus:text-red-600"
              >
                <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <h3 className="text-sm font-semibold text-[var(--text-primary)] mt-2 line-clamp-2 leading-snug">
          {article.title}
        </h3>

        <p className="text-xs text-[var(--text-muted)] mt-1 font-mono">
          /{article.slug}
        </p>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2.5">
            {tags.slice(0, 3).map((tag, idx) => (
              <span key={idx} className="text-[9px] font-semibold text-[var(--text-muted)] bg-[var(--bg-subtle)] px-1.5 py-0.5 rounded border border-[var(--border)]">
                #{tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="text-[9px] text-[var(--text-muted)] pt-0.5">+{tags.length - 3}</span>
            )}
          </div>
        )}
      </div>

      <div className="mt-4 pt-2.5 border-t border-[var(--border)] flex items-center justify-between text-[11px] text-[var(--text-muted)]">
        <span className="flex items-center gap-1">
          <Clock size={11} /> {article.readingTime || 5} min read
        </span>
        <span className="font-semibold text-[var(--text-secondary)]">
          {article.difficulty || "Medium"}
        </span>
      </div>
    </div>
  );
}
