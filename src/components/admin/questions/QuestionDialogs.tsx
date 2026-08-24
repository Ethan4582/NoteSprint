"use client";

import type { Question } from "@/src/db/schema";
import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import ContentRenderer from "@/src/components/ContentRenderer";

interface QuestionDialogsProps {
  deletingId: number | null;
  setDeletingId: (id: number | null) => void;
  actionLoading: boolean;
  onConfirmDelete: () => void;
  previewQuestion: Question | null;
  setPreviewQuestion: (q: Question | null) => void;
}

export default function QuestionDialogs({
  deletingId,
  setDeletingId,
  actionLoading,
  onConfirmDelete,
  previewQuestion,
  setPreviewQuestion,
}: QuestionDialogsProps) {
  return (
    <>
      {/* Delete Dialog */}
      <Dialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <DialogContent className="bg-white border-[var(--border)] rounded-[12px] shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-lg font-normal">Delete Question #{deletingId}</DialogTitle>
          </DialogHeader>
          <p className="text-xs text-[var(--text-secondary)]">
            Are you sure you want to permanently delete this question? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeletingId(null)}
              className="rounded-[10px] text-xs font-bold"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              disabled={actionLoading}
              onClick={onConfirmDelete}
              className="rounded-[10px] text-xs font-bold bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white"
            >
              {actionLoading ? "Deleting..." : "Confirm Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={!!previewQuestion} onOpenChange={(open) => !open && setPreviewQuestion(null)}>
        <DialogContent className="max-w-2xl bg-white border-[var(--border)] rounded-[12px] shadow-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-lg font-normal text-[var(--text-primary)]">
              {previewQuestion?.question}
            </DialogTitle>
          </DialogHeader>
          {previewQuestion && (
            <div className="space-y-4 pt-2">
              <ContentRenderer
                content={previewQuestion.answer}
                image={previewQuestion.imageUrl || undefined}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
