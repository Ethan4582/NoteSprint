"use client";

import { useEffect, useState, useMemo } from "react";
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
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
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
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const PAGE_SIZE = 30;

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [category, setCategory] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"oldest" | "newest">("oldest");
  const [currentPage, setCurrentPage] = useState(1);
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
      toast.success(`Article "${deletingSlug}" deleted`);
      setDeletingSlug(null);
    } catch (err) {
      toast.error(`Delete failed: ${(err as Error).message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const processedArticles = useMemo(() => {
    const list = articles.filter(
      (a) =>
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.slug.toLowerCase().includes(search.toLowerCase())
    );
    return sortOrder === "newest" ? [...list].reverse() : list;
  }, [articles, search, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(processedArticles.length / PAGE_SIZE));
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedArticles = processedArticles.slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <div className="space-y-5">
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
      <div className="flex flex-col sm:flex-row items-center gap-2.5">
        <div className="w-full sm:w-52">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="h-9 rounded-xl bg-raised border-[var(--border-strong)] text-xs font-semibold">
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

        <div className="relative w-full sm:w-80 md:w-96">
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search articles by title or slug..."
            className="h-9 pl-9 rounded-xl bg-raised border-[var(--border-strong)] text-xs"
          />
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[var(--text-muted)]" />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="h-9 px-3 flex items-center gap-1.5 rounded-xl bg-raised border border-[var(--border-strong)] text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              title="Filter and Sort"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span className="capitalize">{sortOrder}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32 p-1">
            <DropdownMenuItem
              onClick={() => setSortOrder("oldest")}
              className={`text-xs font-semibold cursor-pointer ${sortOrder === "oldest" ? "text-[var(--accent)] bg-[var(--bg-subtle)] font-bold" : ""}`}
            >
              Oldest First
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setSortOrder("newest")}
              className={`text-xs font-semibold cursor-pointer ${sortOrder === "newest" ? "text-[var(--accent)] bg-[var(--bg-subtle)] font-bold" : ""}`}
            >
              Newest First
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Articles Grid */}
      {loading ? (
        <div className="py-24 flex justify-center items-center">
          <Loader2 className="h-7 w-7 animate-spin text-[var(--accent)]" />
        </div>
      ) : processedArticles.length === 0 ? (
        <Card className="py-16 text-center text-xs text-[var(--text-muted)]">
          <FileText className="h-8 w-8 mx-auto mb-2 opacity-40 text-[var(--accent)]" />
          No articles found. Click &quot;Add Article&quot; to write a new one.
        </Card>
      ) : (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {paginatedArticles.map((a, idx) => (
              <div
                key={a.slug}
                className="rounded-2xl border border-[var(--border-strong)] bg-raised p-4 shadow-raised-crisp flex flex-col justify-between hover:border-[var(--accent)]/40 transition-all group"
              >
                <div className="flex items-start gap-3">
                  <span className="font-mono text-xs font-bold text-[var(--text-muted)] pt-0.5 min-w-[1.25rem]">
                    {startIndex + idx + 1}
                  </span>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-[13px] font-semibold text-[var(--text-primary)] line-clamp-2 leading-relaxed">
                      {a.title}
                    </p>
                    <p className="text-[11px] font-mono text-[var(--text-muted)] truncate mt-0.5">
                      {a.slug}
                    </p>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className="h-7 w-7 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors flex-shrink-0"
                      >
                        <MoreVertical className="h-3.5 w-3.5" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-32">
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/articles/${a.slug}/edit`}>
                          <Edit2 className="h-3.5 w-3.5 mr-2" /> Edit
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

                <div className="flex items-center justify-between pt-3 mt-2 border-t border-[var(--border)] text-[10px] text-[var(--text-secondary)] font-bold">
                  <span className="uppercase tracking-wider text-[var(--accent)]">
                    {a.category}
                  </span>
                  <span className="flex items-center gap-1 font-normal text-[var(--text-muted)]">
                    <Clock className="h-3 w-3" /> {a.readingTime} min
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination (Only displayed if more than 30 cards) */}
          {processedArticles.length > PAGE_SIZE && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-[var(--border)] text-xs text-[var(--text-secondary)]">
              <span>
                Showing <span className="font-bold text-[var(--text-primary)]">{startIndex + 1}</span> to{" "}
                <span className="font-bold text-[var(--text-primary)]">
                  {Math.min(startIndex + PAGE_SIZE, processedArticles.length)}
                </span>{" "}
                of <span className="font-bold text-[var(--accent)]">{processedArticles.length}</span> articles
              </span>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="h-8 w-8 rounded-lg flex items-center justify-center border border-[var(--border-strong)] bg-raised text-[var(--text-secondary)] disabled:opacity-30 hover:text-[var(--text-primary)]"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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

                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8 rounded-lg flex items-center justify-center border border-[var(--border-strong)] bg-raised text-[var(--text-secondary)] disabled:opacity-30 hover:text-[var(--text-primary)]"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
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
