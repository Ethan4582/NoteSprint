"use client";

import { useState, useEffect, type FormEvent } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import ImageUploader from "./ImageUploader";
import type { Article } from "@/src/db/schema";
import { insertArticleSchema } from "@/src/db/schema";
import { Loader2, ImagePlus } from "lucide-react";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

interface ArticleEditorProps {
  initialData?: Article | null;
  onSave: (data: {
    slug: string;
    title: string;
    content: string;
    category: string;
    readingTime: number;
    difficulty: "Easy" | "Medium" | "Hard";
    tags?: string;
  }) => Promise<void>;
  onCancel: () => void;
}

export default function ArticleEditor({
  initialData,
  onSave,
  onCancel,
}: ArticleEditorProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [category, setCategory] = useState(initialData?.category || "lld");
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">(
    (initialData?.difficulty as "Easy" | "Medium" | "Hard") || "Medium"
  );
  const [readingTime, setReadingTime] = useState<number>(initialData?.readingTime || 5);
  const [tags, setTags] = useState(
    initialData?.tags
      ? (() => {
          try {
            const parsed = JSON.parse(initialData.tags);
            return Array.isArray(parsed) ? parsed.join(", ") : initialData.tags;
          } catch {
            return initialData.tags;
          }
        })()
      : ""
  );
  const [showImageUploader, setShowImageUploader] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!initialData && title) {
      const generated = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setSlug(generated);
    }
  }, [title, initialData]);

  const handleImageUploaded = (url: string | null) => {
    if (url) {
      const markdownImage = `\n\n![Image description](${url})\n\n`;
      setContent((prev) => prev + markdownImage);
      setShowImageUploader(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const tagArray = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const result = insertArticleSchema.safeParse({
      slug: slug.trim(),
      title: title.trim(),
      content: content.trim(),
      category: category.trim(),
      readingTime: Number(readingTime) || 1,
      difficulty,
      tags: JSON.stringify(tagArray),
    });

    if (!result.success) {
      setError(result.error.issues[0]?.message || "Validation failed");
      return;
    }

    setLoading(true);
    try {
      await onSave({
        slug: slug.trim(),
        title: title.trim(),
        content: content.trim(),
        category: category.trim(),
        readingTime: Number(readingTime) || 1,
        difficulty,
        tags: JSON.stringify(tagArray),
      });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-[var(--error)] font-medium">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
            Article Title
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Distributed Rate Limiter Design"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
            Slug
          </label>
          <Input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="e.g. distributed-rate-limiter"
            disabled={Boolean(initialData)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
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
          <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
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
          <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
            Reading Time (mins)
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
        <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
          Tags (comma separated)
        </label>
        <Input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="e.g. redis, architecture, scaling, cache"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
            Article Content (Markdown)
          </label>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setShowImageUploader(!showImageUploader)}
            className="text-xs font-semibold"
          >
            <ImagePlus className="h-3.5 w-3.5 mr-1" />
            {showImageUploader ? "Hide Image Uploader" : "Upload Image to Article"}
          </Button>
        </div>

        {showImageUploader && (
          <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)]">
            <span className="text-xs text-[var(--text-muted)] mb-2 block">
              Uploaded image will be automatically appended to markdown.
            </span>
            <ImageUploader onChange={handleImageUploaded} />
          </div>
        )}

        <div className="rounded-xl overflow-hidden border border-[var(--border)]" data-color-mode="dark">
          <MDEditor
            value={content}
            onChange={(val) => setContent(val || "")}
            height={420}
            preview="live"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border)]">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          {initialData ? "Update Article" : "Create Article"}
        </Button>
      </div>
    </form>
  );
}
