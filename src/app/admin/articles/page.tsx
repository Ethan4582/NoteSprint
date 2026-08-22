"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchArticles } from "@/src/lib/api";
import { deleteArticle } from "@/src/lib/admin-api";
import type { Article } from "@/src/db/schema";
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
import { toast } from "sonner";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  FileText,
  Clock,
  Loader2,
  MoreVertical,
  BookOpen,
  Filter,
} from "lucide-react";

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [category, setCategory] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
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

  const handleDelete = async () => {
    if (!deletingSlug) return;
    setActionLoading(true);
    try {
      await deleteArticle(deletingSlug);
      setArticles((prev) => prev.filter((a) => a.slug !== deletingSlug));
      toast.success(`Article "${deletingSlug}" deleted successfully`);
      setDeletingSlug(null);
    } catch (err) {
      toast.error(`Delete failed: ${(err as Error).message}`);
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
      {/* Header Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--text-primary)]">
            Articles Manager
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Create, edit, and publish System Design, HLD, and LLD articles.
          </p>
        </div>

        <Link href="/admin/articles/new">
          <Button size="sm" className="h-9 px-4 rounded-xl font-bold bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white shadow-sm">
            <Plus className="h-4 w-4 mr-1.5" /> Add Article
          </Button>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="w-full sm:w-64">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="h-10 rounded-xl bg-raised border-[var(--border-strong)] text-xs font-semibold">
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
            className="h-10 pl-9 rounded-xl bg-raised border-[var(--border-strong)] text-xs"
          />
          <Search className="absolute left-3 top-3 h-4 w-4 text-[var(--text-muted)]" />
        </div>

        <button
          type="button"
          className="hidden sm:flex h-10 w-10 items-center justify-center rounded-xl bg-raised border border-[var(--border-strong)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          title="Filter articles"
        >
          <Filter className="h-4 w-4" />
        </button>
      </div>

      {/* Articles Grid */}
      {loading ? (
        <div className="py-24 flex justify-center items-center">
          <Loader2 className="h-7 w-7 animate-spin text-[var(--accent)]" />
        </div>
      ) : filtered.length === 0 ? (
        <Card className="py-16 text-center text-xs text-[var(--text-muted)]">
          <FileText className="h-8 w-8 mx-auto mb-2 opacity-40 text-[var(--accent)]" />
          No articles found. Click &quot;Add Article&quot; to write a new one.
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filtered.map((a, idx) => {
            const formattedIndex = String(idx + 1).padStart(3, "0");
            return (
              <div
                key={a.slug}
                className="rounded-2xl border border-[var(--border-strong)] bg-raised p-4 shadow-raised-crisp flex flex-col justify-between hover:border-[var(--accent)]/40 transition-all group"
              >
                <div className="flex items-start gap-2.5">
                  <div className="flex items-center gap-1.5 flex-shrink-0 pt-0.5">
                    <span className="font-mono text-xs font-bold text-[var(--text-muted)]">
                      {formattedIndex}
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-[13px] font-semibold text-[var(--text-primary)] line-clamp-2 leading-relaxed">
                      {a.title}
                    </p>
                    <p className="text-[11px] font-mono text-[var(--text-muted)] truncate mt-0.5">
                      {a.slug}
                    </p>
                  </div>

                  <div className="flex items-center gap-0.5 flex-shrink-0">
                    <Link href={`/admin/articles/${a.slug}/edit`}>
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
                          <Link href={`/admin/articles/${a.slug}/edit`}>
                            <Edit2 className="h-3.5 w-3.5 mr-2" /> Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/articles/${a.slug}`} target="_blank">
                            <BookOpen className="h-3.5 w-3.5 mr-2" /> Read/View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => setDeletingSlug(a.slug)}
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 mt-2 border-t border-[var(--border)] text-[10px] text-[var(--text-secondary)] font-bold">
                  <span className="uppercase tracking-wider text-[var(--accent)]">
                    {a.category}
                  </span>
                  <span className="flex items-center gap-1 font-normal text-[var(--text-muted)]">
                    <Clock className="h-3 w-3" /> {a.readingTime} min
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Dialog */}
      <Dialog open={Boolean(deletingSlug)} onOpenChange={(open) => !open && setDeletingSlug(null)}>
        <DialogContent className="max-w-sm text-center">
          <DialogHeader>
            <DialogTitle>Delete Article?</DialogTitle>
          </DialogHeader>
          <p className="text-xs text-[var(--text-secondary)] py-2">
            Are you sure you want to delete <strong className="text-[var(--text-primary)]">{deletingSlug}</strong>?
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
