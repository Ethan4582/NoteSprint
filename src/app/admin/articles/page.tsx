"use client";

import { useEffect, useState } from "react";
import { fetchArticles, fetchArticleBySlug } from "@/src/lib/api";
import { createArticle, updateArticle, deleteArticle } from "@/src/lib/admin-api";
import type { Article } from "@/src/db/schema";
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
import ArticleEditor from "@/src/components/admin/ArticleEditor";
import { Plus, Search, Edit2, Trash2, FileText, Clock, Loader2 } from "lucide-react";

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [category, setCategory] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const loadArticles = async () => {
    setLoading(true);
    try {
      const res = await fetchArticles(category === "all" ? undefined : category);
      setArticles(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, [category]);

  const handleEditClick = async (slug: string) => {
    const fullArticle = await fetchArticleBySlug(slug);
    if (fullArticle) {
      setEditingArticle(fullArticle);
    }
  };

  const handleCreate = async (data: {
    slug: string;
    title: string;
    content: string;
    category: string;
    readingTime: number;
    difficulty: "Easy" | "Medium" | "Hard";
    tags?: string;
  }) => {
    await createArticle(data);
    setIsCreateOpen(false);
    await loadArticles();
  };

  const handleUpdate = async (data: {
    slug: string;
    title: string;
    content: string;
    category: string;
    readingTime: number;
    difficulty: "Easy" | "Medium" | "Hard";
    tags?: string;
  }) => {
    if (!editingArticle) return;
    await updateArticle(editingArticle.slug, data);
    setEditingArticle(null);
    await loadArticles();
  };

  const handleDelete = async () => {
    if (!deletingSlug) return;
    setActionLoading(true);
    try {
      await deleteArticle(deletingSlug);
      setArticles((prev) => prev.filter((a) => a.slug !== deletingSlug));
      setDeletingSlug(null);
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setActionLoading(false);
    }
  };

  const filtered = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
            Articles Manager
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Create, edit, and publish System Design, HLD, and LLD articles.
          </p>
        </div>

        <Button onClick={() => setIsCreateOpen(true)} size="sm">
          <Plus className="h-4 w-4 mr-1" /> Add Article
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="w-full sm:w-60">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="lld">Low Level Design (LLD)</SelectItem>
              <SelectItem value="hld">High Level Design (HLD)</SelectItem>
              <SelectItem value="system_design">System Design</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="relative w-full flex-1">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles by title or slug..."
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
          <FileText className="h-8 w-8 mx-auto mb-2 opacity-40 text-[var(--accent)]" />
          No articles found. Click &quot;Add Article&quot; to write a new one.
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filtered.map((a) => (
            <Card key={a.id} className="p-4 flex flex-col sm:flex-row items-start justify-between gap-4 hover:border-[var(--border)] transition-all">
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-sm font-bold text-[var(--text-primary)]">{a.title}</h4>
                  <Badge variant="outline" className="text-[10px] uppercase font-bold text-[var(--accent)] border-[var(--accent)]/30">
                    {a.category}
                  </Badge>
                  <Badge variant="secondary" className="text-[10px]">
                    {a.difficulty}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-[var(--text-secondary)]">
                  <span className="font-mono text-[11px] text-[var(--text-muted)]">{a.slug}</span>
                  <span className="flex items-center gap-1 text-[11px]">
                    <Clock className="h-3 w-3" /> {a.readingTime} min read
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 self-end sm:self-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEditClick(a.slug)}
                  className="h-8 w-8 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDeletingSlug(a.slug)}
                  className="h-8 w-8 text-[var(--text-muted)] hover:text-[var(--error)]"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-4xl max-h-[95vh]">
          <DialogHeader>
            <DialogTitle>Create New Article</DialogTitle>
          </DialogHeader>
          <ArticleEditor
            onSave={handleCreate}
            onCancel={() => setIsCreateOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={Boolean(editingArticle)} onOpenChange={(open) => !open && setEditingArticle(null)}>
        <DialogContent className="max-w-4xl max-h-[95vh]">
          <DialogHeader>
            <DialogTitle>Edit Article: {editingArticle?.title}</DialogTitle>
          </DialogHeader>
          {editingArticle && (
            <ArticleEditor
              initialData={editingArticle}
              onSave={handleUpdate}
              onCancel={() => setEditingArticle(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={Boolean(deletingSlug)} onOpenChange={(open) => !open && setDeletingSlug(null)}>
        <DialogContent className="max-w-sm text-center">
          <DialogHeader>
            <DialogTitle>Delete Article?</DialogTitle>
          </DialogHeader>
          <p className="text-xs text-[var(--text-secondary)] py-2">
            Are you sure you want to permanently delete <strong className="text-[var(--text-primary)]">{deletingSlug}</strong>?
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <Button variant="outline" size="sm" onClick={() => setDeletingSlug(null)}>
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
