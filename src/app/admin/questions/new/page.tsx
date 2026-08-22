"use client";

import { useState, useEffect, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetchTopics } from "@/src/lib/api";
import { createQuestion } from "@/src/lib/admin-api";
import type { Topic } from "@/src/db/schema";
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

export default function NewQuestionPage() {
  const router = useRouter();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [topicId, setTopicId] = useState<string>("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sessionImages, setSessionImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTopics().then((res) => {
      setTopics(res);
      if (res.length > 0) setTopicId(String(res[0].id));
    });
  }, []);

  const handleImageUploaded = (url: string) => {
    setSessionImages((prev) => (prev.includes(url) ? prev : [...prev, url]));
  };

  const handleRemoveFromContent = (imageUrl: string) => {
    const escaped = imageUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`!\\[.*?\\]\\(${escaped}\\)\\n?`, "g");
    setAnswer((prev) => prev.replace(regex, ""));
    setSessionImages((prev) => prev.filter((u) => u !== imageUrl));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) {
      setError("Please provide both question and answer");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await createQuestion({
        topicId: parseInt(topicId, 10),
        question: question.trim(),
        answer: answer.trim(),
      });
      toast.success("Question created successfully");
      router.push("/admin/questions");
    } catch (err) {
      const msg = (err as Error).message;
      setError(msg);
      toast.error(`Failed to create question: ${msg}`);
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6 pb-16">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/questions">
            <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[var(--text-primary)]">
              Create Question
            </h1>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Add a new flashcard to your topic library.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/questions">
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
                Topic
              </label>
              <Select value={topicId} onValueChange={setTopicId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select topic" />
                </SelectTrigger>
                <SelectContent>
                  {topics.map((t) => (
                    <SelectItem key={t.id} value={String(t.id)}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase tracking-wider text-[var(--text-secondary)]">
                Question Title
              </label>
              <Input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g. What is the difference between supervised and unsupervised learning?"
                required
              />
            </div>
          </div>

          <UploadedMediaManager
            content={answer}
            sessionImages={sessionImages}
            onRemoveFromContent={handleRemoveFromContent}
          />
        </div>

        {/* Right Column: Main Editor */}
        <div className="lg:col-span-8 space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-black uppercase tracking-wider text-[var(--text-secondary)]">
              Answer & Explanation
            </label>
            <RichMarkdownEditor
              value={answer}
              onChange={setAnswer}
              size="large"
              onImageUploaded={handleImageUploaded}
              placeholder="Write the answer in markdown..."
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
