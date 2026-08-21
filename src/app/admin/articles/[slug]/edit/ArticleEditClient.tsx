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
import { Loader2 } from "lucide-react";

export default function ArticleEditClient({ slug }: { slug: string }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("lld");
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");
  const [readingTime, setReadingTime] = useState<number>(5);
  const [tags, setTags] = useState("");
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
      <div className="py-24 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--accent)]" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
            Edit Article: {title || slug}
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Slug: <span className="font-mono text-[var(--text-muted)]">{slug}</span>
          </p>
        </div>
        <Link href="/admin/articles">
          <Button variant="ghost" size="sm">Cancel</Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-[var(--error)] font-medium">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              Article Title
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Article title..."
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            placeholder="redis, cache, scaling"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
            Article Notes & Content
          </label>
          <RichMarkdownEditor
            value={content}
            onChange={setContent}
            size="large"
            placeholder="Write your article in markdown..."
          />
        </div>

        <Button type="submit" disabled={loading} className="w-full h-12 text-base font-bold">
          {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : "Save Changes"}
        </Button>
      </form>
    </div>
  );
}
