"use client";

import { useEffect, useState } from "react";
import { fetchTopics, fetchTopicQuestions } from "@/src/lib/api";
import { createQuestion, updateQuestion, deleteQuestion } from "@/src/lib/admin-api";
import type { Topic, Question } from "@/src/db/schema";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";
import { Card } from "@/src/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import QuestionEditor from "@/src/components/admin/QuestionEditor";
import { Plus, Search, Edit2, Trash2, ImageIcon, HelpCircle, Loader2, ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 10;

export default function AdminQuestionsPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchTopics().then((res) => {
      setTopics(res);
      if (res.length > 0) {
        setSelectedTopic(res[0].slug);
      }
    });
  }, []);

  useEffect(() => {
    if (!selectedTopic) return;
    setLoading(true);
    setCurrentPage(1);
    fetchTopicQuestions(selectedTopic)
      .then((res) => {
        setQuestions(res?.questions || []);
      })
      .finally(() => setLoading(false));
  }, [selectedTopic]);

  const handleRefresh = async () => {
    if (selectedTopic) {
      const res = await fetchTopicQuestions(selectedTopic);
      setQuestions(res?.questions || []);
    }
  };

  const handleCreate = async (data: {
    topicId: number;
    question: string;
    answer: string;
    imageUrl?: string | null;
  }) => {
    await createQuestion(data);
    setIsCreateOpen(false);
    await handleRefresh();
  };

  const handleUpdate = async (data: {
    topicId: number;
    question: string;
    answer: string;
    imageUrl?: string | null;
  }) => {
    if (!editingQuestion) return;
    await updateQuestion(editingQuestion.id, data);
    setEditingQuestion(null);
    await handleRefresh();
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setActionLoading(true);
    try {
      await deleteQuestion(deletingId);
      setQuestions((prev) => prev.filter((q) => q.id !== deletingId));
      setDeletingId(null);
    } catch (err) {
      alert((err as Error).message);
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
            Questions Manager
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Manage questions with topic filtering and pagination.
          </p>
        </div>

        <Button onClick={() => setIsCreateOpen(true)} size="sm">
          <Plus className="h-4 w-4 mr-1" /> Add Question
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="w-full sm:w-72">
          <Select value={selectedTopic} onValueChange={setSelectedTopic}>
            <SelectTrigger>
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
            className="pl-9 text-xs"
          />
          <Search className="absolute left-3 top-3 h-3.5 w-3.5 text-[var(--text-muted)]" />
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center items-center">
          <Loader2 className="h-6 w-6 animate-spin text-[var(--accent)]" />
        </div>
      ) : filtered.length === 0 ? (
        <Card className="py-16 text-center text-xs text-[var(--text-muted)]">
          <HelpCircle className="h-8 w-8 mx-auto mb-2 opacity-40 text-[var(--accent)]" />
          No questions found. Click &quot;Add Question&quot; to create one.
        </Card>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-2.5">
            {paginatedQuestions.map((q) => (
              <Card key={q.id} className="p-3.5 flex items-center justify-between gap-4 hover:border-[var(--border-strong)] transition-all">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className="text-xs font-mono font-bold text-[var(--text-muted)] w-8 flex-shrink-0">
                    #{q.id}
                  </span>
                  <span className="text-sm font-semibold text-[var(--text-primary)] truncate flex-1">
                    {q.question}
                  </span>
                  {q.imageUrl && (
                    <Badge variant="outline" className="text-[10px] gap-1 py-0 text-[var(--accent)] border-[var(--accent)]/30 flex-shrink-0">
                      <ImageIcon className="h-3 w-3" /> Image
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingQuestion(q)}
                    className="h-8 w-8 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeletingId(q.id)}
                    className="h-8 w-8 text-[var(--text-muted)] hover:text-[var(--error)]"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-[var(--border)] text-xs text-[var(--text-secondary)]">
              <span>
                Showing {startIndex + 1} - {Math.min(startIndex + PAGE_SIZE, filtered.length)} of {filtered.length}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="h-8 px-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="font-mono font-bold px-2">
                  {currentPage} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="h-8 px-2"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Question</DialogTitle>
          </DialogHeader>
          <QuestionEditor
            topics={topics}
            onSave={handleCreate}
            onCancel={() => setIsCreateOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={Boolean(editingQuestion)} onOpenChange={(open) => !open && setEditingQuestion(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Question #{editingQuestion?.id}</DialogTitle>
          </DialogHeader>
          {editingQuestion && (
            <QuestionEditor
              initialData={editingQuestion}
              topics={topics}
              onSave={handleUpdate}
              onCancel={() => setEditingQuestion(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={Boolean(deletingId)} onOpenChange={(open) => !open && setDeletingId(null)}>
        <DialogContent className="max-w-sm text-center">
          <DialogHeader>
            <DialogTitle>Delete Question?</DialogTitle>
          </DialogHeader>
          <p className="text-xs text-[var(--text-secondary)] py-2">
            Are you sure you want to delete this question?
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
    </div>
  );
}
