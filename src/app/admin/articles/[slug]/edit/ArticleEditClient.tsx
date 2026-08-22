"use client";

import { useState, useEffect, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetchArticleBySlug } from "@/src/lib/api";
import { updateArticle } from "@/src/lib/admin-api";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import RichMarkdownEditor from "@/src/components/admin/RichMarkdownEditor";
import UploadedMediaManager from "@/src/components/admin/UploadedMediaManager";
import { Loader2, ArrowLeft, Save } from "lucide-react";

export default function ArticleEditClient({ slug }: { slug: string }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("lld");
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");
  const [readingTime, setReadingTime] = useState<number>(5);
  const [tags, setTags] = useState("");
  const [sessionImages, setSessionImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchArticleBySlug(slug)
      .then((a) => {
        if (a) {
          setTitle(a.title);
          setContent(a.content);
          setCategory(a.category);
          setDifficulty(a.difficulty as "Easy" | "Medium" | "Hard");
          setReadingTime(a.readingTime);
          if (a.tags) {
            try {
              const parsed = JSON.parse(a.tags);
              setTags(Array.isArray(parsed) ? parsed.join(", ") : a.tags);
            } catch {
              setTags(a.tags);
            }
          }
        }
      })
      .finally(() => setInitialLoading(false));
  }, [slug]);

  const handleImageUploaded = (url: string) => {
    setSessionImages((prev) => (prev.includes(url) ? prev : [...prev, url]));
  };

  const handleRemoveFromContent = (imageUrl: string) => {
    const escaped = imageUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`!\\[.*?\\]\\(${escaped}\\)\\n?`, "g");
    setContent((prev) => prev.replace(regex, ""));
    setSessionImages((prev) => prev.filter((u) => u !== imageUrl));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError("Please fill in the title and content");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const tagArray = tags.split(",").map((t) => t.trim()).filter(Boolean);
      await updateArticle(slug, {
        title: title.trim(),
        content: content.trim(),
        category,
        readingTime: Number(readingTime) || 1,
        difficulty,
        tags: JSON.stringify(tagArray),
      });
      router.push("/admin/articles");
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="py-32 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--accent)]" />
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 pb-16">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/admin/articles">
            <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl flex-shrink-0">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[var(--text-primary)] truncate">
              {title || slug}
            </h1>
            <p className="text-xs text-[var(--text-muted)] mt-0.5 font-mono">
              {slug}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <Link href="/admin/articles">
            <Button variant="ghost" size="sm">Cancel</Button>
          </Link>
          <Button onClick={handleSubmit} disabled={loading} size="sm">
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> : <Save className="h-4 w-4 mr-1.5" />}
            Save Changes
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-3.5 text-xs text-[var(--error)] font-medium">
          {error}
        </div>
      )}

      {/* 2-Column Full Width Layout */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Sticky & Scrollable Metadata & Media */}
        <div className="lg:col-span-4 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto custom-scrollbar space-y-5 pr-1">
          <div className="rounded-2xl border border-[var(--border-strong)] bg-raised p-5 shadow-raised-crisp space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase tracking-wider text-[var(--text-secondary)]">
                Category
              </label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lld">Low Level Design (LLD)</SelectItem>
                  <SelectItem value="hld">High Level Design (HLD)</SelectItem>
                  <SelectItem value="system_design">System Design</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase tracking-wider text-[var(--text-secondary)]">
                Article Title
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Article title..."
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-wider text-[var(--text-secondary)]">
                  Difficulty
                </label>
                <Select
                  value={difficulty}
                  onValueChange={(val: "Easy" | "Medium" | "Hard") => setDifficulty(val)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-wider text-[var(--text-secondary)]">
                  Read Time (min)
                </label>
                <Input
                  type="number"
                  min={1}
                  value={readingTime}
                  onChange={(e) => setReadingTime(parseInt(e.target.value, 10) || 1)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase tracking-wider text-[var(--text-secondary)]">
                Tags (comma separated)
              </label>
              <Input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="redis, cache, scaling"
              />
            </div>
          </div>

          <UploadedMediaManager
            content={content}
            sessionImages={sessionImages}
            onRemoveFromContent={handleRemoveFromContent}
          />
        </div>

        {/* Right Column: Main Editor */}
        <div className="lg:col-span-8 space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-black uppercase tracking-wider text-[var(--text-secondary)]">
              Article Content
            </label>
            <RichMarkdownEditor
              value={content}
              onChange={setContent}
              size="large"
              onImageUploaded={handleImageUploaded}
              placeholder="Write your article in markdown..."
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full h-11 text-sm font-bold">
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
