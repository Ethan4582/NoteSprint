"use client";

import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";

interface ArticleDeleteDialogProps {
  deletingSlug: string | null;
  setDeletingSlug: (slug: string | null) => void;
  actionLoading: boolean;
  onConfirmDelete: () => void;
}

export default function ArticleDeleteDialog({
  deletingSlug,
  setDeletingSlug,
  actionLoading,
  onConfirmDelete,
}: ArticleDeleteDialogProps) {
  return (
    <Dialog open={!!deletingSlug} onOpenChange={(open) => !open && setDeletingSlug(null)}>
      <DialogContent className="bg-white border-[var(--border)] rounded-[12px] shadow-2xl">
        <DialogHeader>
          <DialogTitle className="font-serif text-lg font-normal">Delete Article</DialogTitle>
        </DialogHeader>
        <p className="text-xs text-[var(--text-secondary)]">
          Are you sure you want to permanently delete article &quot;{deletingSlug}&quot;? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDeletingSlug(null)}
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
  );
}
