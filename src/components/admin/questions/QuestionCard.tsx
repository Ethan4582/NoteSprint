"use client";

import Link from "next/link";
import type { Question } from "@/src/db/schema";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { Edit2, Trash2, MoreVertical, BookOpen } from "lucide-react";

interface QuestionCardProps {
  question: Question;
  selectedTopic: string;
  onPreview: (q: Question) => void;
  onDelete: (id: number) => void;
}

export default function QuestionCard({
  question,
  selectedTopic,
  onPreview,
  onDelete,
}: QuestionCardProps) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-white p-4 shadow-sm flex flex-col justify-between hover:border-[var(--accent)]/40 hover:shadow-md transition-all group">
      <div className="flex items-start gap-3">
        <span className="font-mono text-xs font-bold text-[var(--text-muted)] pt-0.5 min-w-[1.25rem]">
          {question.id}
        </span>

        <p className="text-xs sm:text-[13px] font-semibold text-[var(--text-primary)] line-clamp-2 leading-relaxed flex-1">
          {question.question}
        </p>

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
              <Link href={`/admin/questions/${question.id}/edit?topic=${selectedTopic}`} className="cursor-pointer">
                <Edit2 className="h-3.5 w-3.5 mr-2" /> Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onPreview(question)} className="cursor-pointer">
              <BookOpen className="h-3.5 w-3.5 mr-2" /> View
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => onDelete(question.id)}
              className="cursor-pointer text-red-600 focus:text-red-600"
            >
              <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mt-3 pt-2.5 border-t border-[var(--border)] flex items-center justify-between text-[11px] text-[var(--text-muted)]">
        <span>Question #{question.id}</span>
        <button
          type="button"
          onClick={() => onPreview(question)}
          className="text-[var(--accent)] font-bold hover:underline"
        >
          Preview
        </button>
      </div>
    </div>
  );
}
