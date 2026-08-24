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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import AdminArticleCard from "@/src/components/admin/articles/AdminArticleCard";
import ArticleDeleteDialog from "@/src/components/admin/articles/ArticleDeleteDialog";
import { Skeleton } from "@/src/components/ui/skeleton";
import { toast } from "sonner";
import {
  Plus,
  Search,
  FileText,
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-normal font-serif tracking-tight text-[var(--text-primary)]">
            Articles Manager
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Create, edit, and organize system design and deep-dive articles.
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
        <div className="w-32 sm:w-44 shrink-0">
          <Select value={category} onValueChange={(val) => { setCategory(val); setCurrentPage(1); }}>
            <SelectTrigger className="h-10 rounded-md bg-white border-[var(--border)] text-xs font-semibold px-3 shadow-xs">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="bg-white border-[var(--border)] rounded-md shadow-xl">
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="lld">LLD</SelectItem>
              <SelectItem value="hld">HLD</SelectItem>
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
            placeholder="Search articles..."
            className="h-10 pl-9 pr-3 rounded-md bg-white border-[var(--border)] text-xs truncate shadow-xs focus:ring-2 focus:ring-[var(--accent)]/15"
          />
          <Search className="absolute left-3 top-3 h-4 w-4 text-[var(--text-muted)]" />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="h-10 px-3.5 flex items-center gap-1.5 rounded-md bg-white border border-[var(--border)] text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors shrink-0 shadow-xs"
              title="Sort articles"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="rounded-lg border border-[var(--border)] bg-white p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-12 rounded" />
                <Skeleton className="h-4 w-4 rounded" />
              </div>
              <Skeleton className="h-5 w-4/5" />
              <Skeleton className="h-3 w-1/2" />
              <div className="flex gap-1 pt-1">
                <Skeleton className="h-4 w-12 rounded" />
                <Skeleton className="h-4 w-14 rounded" />
              </div>
              <div className="pt-2 border-t border-[var(--border)] flex justify-between">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-12" />
              </div>
            </div>
          ))}
        </div>
      ) : processedArticles.length === 0 ? (
        <Card className="py-16 text-center text-xs text-[var(--text-muted)] bg-white border-[var(--border)] rounded-lg shadow-sm">
          <FileText className="h-8 w-8 mx-auto mb-2 opacity-40 text-[var(--accent)]" />
          No articles found. Click &quot;Add Article&quot; to create one.
        </Card>
      ) : (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {paginatedArticles.map((article) => (
              <AdminArticleCard
                key={article.slug}
                article={article}
                onDelete={(slug) => setDeletingSlug(slug)}
              />
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
                  className="p-2 rounded-xl border border-[var(--border)] bg-white hover:bg-[var(--bg-subtle)] disabled:opacity-40 text-[var(--text-secondary)] transition-all shadow-xs"
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
                  className="p-2 rounded-xl border border-[var(--border)] bg-white hover:bg-[var(--bg-subtle)] disabled:opacity-40 text-[var(--text-secondary)] transition-all shadow-xs"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Delete Dialog */}
      <ArticleDeleteDialog
        deletingSlug={deletingSlug}
        setDeletingSlug={setDeletingSlug}
        actionLoading={actionLoading}
        onConfirmDelete={handleDelete}
      />
    </div>
  );
}
