"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchTopics, fetchTopicQuestions } from "@/src/lib/api";
import { deleteQuestion } from "@/src/lib/admin-api";
import type { Topic, Question } from "@/src/db/schema";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Card } from "@/src/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import ContentRenderer from "@/src/components/ContentRenderer";
import { toast } from "sonner";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ImageIcon,
  HelpCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  BookOpen,
  Filter,
} from "lucide-react";

const PAGE_SIZE = 15;

export default function AdminQuestionsPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [previewQuestion, setPreviewQuestion] = useState<Question | null>(null);

  useEffect(() => {
    fetchTopics().then((res) => {
      setTopics(res);
      if (res.length > 0) setSelectedTopic(res[0].slug);
    });
  }, []);

  useEffect(() => {
    if (!selectedTopic) return;
    setLoading(true);
    setCurrentPage(1);
    fetchTopicQuestions(selectedTopic)
      .then((res) => setQuestions(res?.questions || []))
      .finally(() => setLoading(false));
  }, [selectedTopic]);

  const handleDelete = async () => {
    if (!deletingId) return;
    setActionLoading(true);
    try {
      await deleteQuestion(deletingId);
      setQuestions((prev) => prev.filter((q) => q.id !== deletingId));
      toast.success(`Question #${deletingId} deleted successfully`);
      setDeletingId(null);
    } catch (err) {
      toast.error(`Delete failed: ${(err as Error).message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const filtered = questions.filter(
    (q) =>
      q.question.toLowerCase().includes(search.toLowerCase()) ||
      q.answer.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedQuestions = filtered.slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <div className="space-y-6">
      {/* Header Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--text-primary)]">
            Questions Manager
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Manage flashcards with full-page editing and pagination.
          </p>
        </div>

        <Link href="/admin/questions/new">
          <Button size="sm" className="h-9 px-4 rounded-xl font-bold bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white shadow-sm">
            <Plus className="h-4 w-4 mr-1.5" /> Add Question
          </Button>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="w-full sm:w-64">
          <Select value={selectedTopic} onValueChange={setSelectedTopic}>
            <SelectTrigger className="h-10 rounded-xl bg-raised border-[var(--border-strong)] text-xs font-semibold">
              <SelectValue placeholder="Select topic" />
            </SelectTrigger>
            <SelectContent>
              {topics.map((t) => (
                <SelectItem key={t.id} value={t.slug}>
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="relative w-full flex-1">
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search questions..."
            className="h-10 pl-9 rounded-xl bg-raised border-[var(--border-strong)] text-xs"
          />
          <Search className="absolute left-3 top-3 h-4 w-4 text-[var(--text-muted)]" />
        </div>

        <button
          type="button"
          className="hidden sm:flex h-10 w-10 items-center justify-center rounded-xl bg-raised border border-[var(--border-strong)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          title="Filter options"
        >
          <Filter className="h-4 w-4" />
        </button>
      </div>

      {/* Questions Grid */}
      {loading ? (
        <div className="py-24 flex justify-center items-center">
          <Loader2 className="h-7 w-7 animate-spin text-[var(--accent)]" />
        </div>
      ) : filtered.length === 0 ? (
        <Card className="py-16 text-center text-xs text-[var(--text-muted)]">
          <HelpCircle className="h-8 w-8 mx-auto mb-2 opacity-40 text-[var(--accent)]" />
          No questions found. Click &quot;Add Question&quot; to create one.
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {paginatedQuestions.map((q) => {
              const formattedId = String(q.id).padStart(3, "0");
              return (
                <div
                  key={q.id}
                  className="rounded-2xl border border-[var(--border-strong)] bg-raised p-4 shadow-raised-crisp flex flex-col justify-between hover:border-[var(--accent)]/40 transition-all group"
                >
                  <div className="flex items-start gap-2.5">
                    <div className="flex items-center gap-1.5 flex-shrink-0 pt-0.5">
                      <span className="font-mono text-xs font-bold text-[var(--text-muted)]">
                        {formattedId}
                      </span>
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                    </div>

                    <p className="text-xs sm:text-[13px] font-semibold text-[var(--text-primary)] line-clamp-2 leading-relaxed flex-1">
                      {q.question}
                    </p>

                    <div className="flex items-center gap-0.5 flex-shrink-0">
                      <Link href={`/admin/questions/${q.id}/edit?topic=${selectedTopic}`}>
                        <button
                          type="button"
                          className="h-7 w-7 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors"
                          title="Quick Edit"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                      </Link>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            className="h-7 w-7 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors"
                          >
                            <MoreVertical className="h-3.5 w-3.5" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-36">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/questions/${q.id}/edit?topic=${selectedTopic}`}>
                              <Edit2 className="h-3.5 w-3.5 mr-2" /> Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setPreviewQuestion(q)}>
                            <BookOpen className="h-3.5 w-3.5 mr-2" /> Read/View
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => setDeletingId(q.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {q.imageUrl && (
                    <div className="flex justify-end pt-2">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md border border-[var(--accent)]/30 bg-[var(--accent)]/10 text-[10px] font-bold text-[var(--accent)]">
                        <ImageIcon className="h-2.5 w-2.5" /> Image
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-[var(--border)] text-xs text-[var(--text-secondary)]">
            <span>
              Showing <span className="font-bold text-[var(--text-primary)]">{startIndex + 1}</span> to{" "}
              <span className="font-bold text-[var(--text-primary)]">
                {Math.min(startIndex + PAGE_SIZE, filtered.length)}
              </span>{" "}
              of <span className="font-bold text-[var(--accent)]">{filtered.length}</span> questions
            </span>

            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="h-8 w-8 rounded-lg flex items-center justify-center border border-[var(--border-strong)] bg-raised text-[var(--text-secondary)] disabled:opacity-30 hover:text-[var(--text-primary)]"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`h-8 w-8 rounded-lg font-mono text-xs font-bold transition-all ${
                      currentPage === page
                        ? "bg-[var(--accent)] text-white shadow-sm"
                        : "border border-[var(--border-strong)] bg-raised text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                {totalPages > 5 && (
                  <>
                    <span className="px-1 text-[var(--text-muted)]">...</span>
                    <button
                      type="button"
                      onClick={() => setCurrentPage(totalPages)}
                      className={`h-8 px-2.5 rounded-lg font-mono text-xs font-bold border border-[var(--border-strong)] bg-raised ${
                        currentPage === totalPages ? "bg-[var(--accent)] text-white" : "text-[var(--text-secondary)]"
                      }`}
                    >
                      {totalPages}
                    </button>
                  </>
                )}

                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8 rounded-lg flex items-center justify-center border border-[var(--border-strong)] bg-raised text-[var(--text-secondary)] disabled:opacity-30 hover:text-[var(--text-primary)]"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Dialog */}
      <Dialog open={Boolean(deletingId)} onOpenChange={(open) => !open && setDeletingId(null)}>
        <DialogContent className="max-w-sm text-center">
          <DialogHeader>
            <DialogTitle>Delete Question #{deletingId}?</DialogTitle>
          </DialogHeader>
          <p className="text-xs text-[var(--text-secondary)] py-2">
            Are you sure you want to delete this question? This action cannot be undone.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <Button variant="outline" size="sm" onClick={() => setDeletingId(null)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleDelete} disabled={actionLoading}>
              {actionLoading ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Read / View Preview Dialog */}
      <Dialog open={Boolean(previewQuestion)} onOpenChange={(open) => !open && setPreviewQuestion(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto custom-scrollbar">
          <DialogHeader>
            <DialogTitle className="text-base font-bold pr-6">
              {previewQuestion?.question}
            </DialogTitle>
          </DialogHeader>
          <div className="py-3">
            <ContentRenderer content={previewQuestion?.answer || ""} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
