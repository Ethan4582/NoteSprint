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
import { toast } from "sonner";

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
      toast.success("Article updated successfully");
      router.push("/admin/articles");
    } catch (err) {
      const msg = (err as Error).message;
      setError(msg);
      toast.error(`Failed to update article: ${msg}`);
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
        <div className="flex items-center gap-3">
          <Link href="/admin/articles">
            <Button variant="outline" size="icon" className="h-9 w-9 rounded-full bg-white border-[var(--border)] shadow-xs">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-normal font-serif tracking-tight text-[var(--text-primary)]">
              Edit Article
            </h1>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Editing <span className="font-mono text-[var(--text-primary)] font-bold">{slug}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/articles">
            <Button variant="ghost" size="sm" className="rounded-full text-xs font-bold">Cancel</Button>
          </Link>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            size="sm"
            className="rounded-full px-5 font-bold text-xs bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white shadow-sm"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> : <Save className="h-4 w-4 mr-1.5" />}
            Save Changes
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-rose-50 border border-rose-200 p-3.5 text-xs text-rose-600 font-medium">
          {error}
        </div>
      )}

      {/* 2-Column Full Width Layout */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Metadata & Media */}
        <div className="lg:col-span-4 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto space-y-5 pr-1">
          <div className="rounded-lg border border-[var(--border)] bg-white p-5 shadow-sm space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                Title
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Article title..."
                required
                className="h-10 rounded-md bg-white border-[var(--border)] text-xs shadow-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                  Category
                </label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="h-10 rounded-md bg-white border-[var(--border)] text-xs">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-[var(--border)] rounded-md shadow-xl">
                    <SelectItem value="lld">LLD</SelectItem>
                    <SelectItem value="hld">HLD</SelectItem>
                    <SelectItem value="system_design">System Design</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                  Difficulty
                </label>
                <Select value={difficulty} onValueChange={(v) => setDifficulty(v as "Easy" | "Medium" | "Hard")}>
                  <SelectTrigger className="h-10 rounded-md bg-white border-[var(--border)] text-xs">
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-[var(--border)] rounded-md shadow-xl">
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                  Reading Time (Mins)
                </label>
                <Input
                  type="number"
                  min="1"
                  value={readingTime}
                  onChange={(e) => setReadingTime(Number(e.target.value))}
                  className="h-10 rounded-md bg-white border-[var(--border)] text-xs font-mono shadow-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                  Tags (Comma separated)
                </label>
                <Input
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="redis, cache, scale"
                  className="h-10 rounded-md bg-white border-[var(--border)] text-xs shadow-xs"
                />
              </div>
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
            <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              Article Content (Markdown)
            </label>
            <RichMarkdownEditor
              value={content}
              onChange={setContent}
              size="large"
              onImageUploaded={handleImageUploaded}
              placeholder="Write the article in markdown..."
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-md text-xs font-bold uppercase tracking-wider bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white shadow-md"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
