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
  ExternalLink,
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
    <div className="space-y-6">
      {/* Header Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-normal font-serif tracking-tight text-[var(--text-primary)]">
            Articles Manager
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Create, edit, and publish System Design, HLD, and LLD articles.
          </p>
        </div>

        <Link href="/admin/articles/new">
          <Button size="sm" className="h-10 px-5 rounded-md font-bold bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white shadow-sm">
            <Plus className="h-4 w-4 mr-1.5" /> Add Article
          </Button>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-row items-center gap-2 sm:gap-3 w-full">
        <div className="w-36 sm:w-56 shrink-0">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="h-10 rounded-md bg-white border-[var(--border)] text-xs font-semibold px-3 shadow-xs">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent className="bg-white border-[var(--border)] rounded-md shadow-xl">
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="lld">Low Level Design (LLD)</SelectItem>
              <SelectItem value="hld">High Level Design (HLD)</SelectItem>
              <SelectItem value="system_design">System Design</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="relative flex-1 min-w-0">
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search articles by title or slug..."
            className="h-10 pl-9 pr-3 rounded-md bg-white border-[var(--border)] text-xs truncate shadow-xs focus:ring-2 focus:ring-[var(--accent)]/15"
          />
          <Search className="absolute left-3 top-3 h-4 w-4 text-[var(--text-muted)]" />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="h-10 px-3.5 flex items-center gap-1.5 rounded-md bg-white border border-[var(--border)] text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors shrink-0 shadow-xs"
              title="Filter and Sort"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span className="capitalize hidden sm:inline">{sortOrder}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36 p-1 bg-white border-[var(--border)] rounded-md shadow-xl">
            <DropdownMenuItem
              onClick={() => setSortOrder("oldest")}
              className={`text-xs font-semibold cursor-pointer rounded ${sortOrder === "oldest" ? "text-[var(--accent)] bg-[var(--bg-subtle)] font-bold" : ""}`}
            >
              Oldest First
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setSortOrder("newest")}
              className={`text-xs font-semibold cursor-pointer rounded ${sortOrder === "newest" ? "text-[var(--accent)] bg-[var(--bg-subtle)] font-bold" : ""}`}
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
        <Card className="py-16 text-center text-xs text-[var(--text-muted)] bg-white border-[var(--border)] rounded-lg shadow-sm">
          <FileText className="h-8 w-8 mx-auto mb-2 opacity-40 text-[var(--accent)]" />
          No articles found. Click &quot;Add Article&quot; to write a new one.
        </Card>
      ) : (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {paginatedArticles.map((a, idx) => (
              <div
                key={a.slug}
                className="rounded-lg border border-[var(--border)] bg-white p-4 shadow-sm flex flex-col justify-between hover:border-[var(--accent)]/40 hover:shadow-md transition-all group"
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
                        className="h-7 w-7 rounded-md flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors flex-shrink-0"
                      >
                        <MoreVertical className="h-3.5 w-3.5" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-32 bg-white border-[var(--border)] rounded-md shadow-xl">
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/articles/${a.slug}/edit`} className="cursor-pointer">
                          <Edit2 className="h-3.5 w-3.5 mr-2" /> Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/system-design/${a.category || "articles"}/${a.slug}`} target="_blank" className="cursor-pointer">
                          <ExternalLink className="h-3.5 w-3.5 mr-2" /> View Live
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => setDeletingSlug(a.slug)}
                        className="cursor-pointer text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="mt-3 pt-2.5 border-t border-[var(--border)] flex items-center justify-between text-[11px] text-[var(--text-muted)]">
                  <span className="uppercase font-bold text-[9px] px-2 py-0.5 rounded-md bg-[var(--bg-subtle)] text-[var(--text-secondary)] border border-[var(--border)]">
                    {a.category || "General"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={11} /> {a.readingTime || 5} min read
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
              <span className="text-xs text-[var(--text-secondary)]">
                Showing {startIndex + 1}-{Math.min(startIndex + PAGE_SIZE, processedArticles.length)} of {processedArticles.length}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="p-2 rounded-md border border-[var(--border)] bg-white hover:bg-[var(--bg-subtle)] disabled:opacity-40 text-[var(--text-secondary)] transition-all shadow-xs"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-xs font-bold px-3 py-1 text-[var(--text-primary)]">
                  {currentPage} / {totalPages}
                </span>
                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="p-2 rounded-md border border-[var(--border)] bg-white hover:bg-[var(--bg-subtle)] disabled:opacity-40 text-[var(--text-secondary)] transition-all shadow-xs"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Delete Dialog */}
      <Dialog open={!!deletingSlug} onOpenChange={(open) => !open && setDeletingSlug(null)}>
        <DialogContent className="bg-white border-[var(--border)] rounded-[12px] shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-lg font-normal">Delete Article</DialogTitle>
          </DialogHeader>
          <p className="text-xs text-[var(--text-secondary)]">
            Are you sure you want to delete <span className="font-bold text-[var(--text-primary)]">&quot;{deletingSlug}&quot;</span>? This cannot be undone.
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
              onClick={handleDelete}
              className="rounded-[10px] text-xs font-bold bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white"
            >
              {actionLoading ? "Deleting..." : "Confirm Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
