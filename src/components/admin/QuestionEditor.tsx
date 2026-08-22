"use client";

import { useState, useEffect, type FormEvent } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/src/components/ui/tabs";
import ImageUploader from "./ImageUploader";
import ContentRenderer from "@/src/components/ContentRenderer";
import type { Question, Topic } from "@/src/db/schema";
import { insertQuestionSchema } from "@/src/db/schema";
import { Loader2 } from "lucide-react";

interface QuestionEditorProps {
  initialData?: Question | null;
  topics: Topic[];
  onSave: (data: {
    topicId: number;
    question: string;
    answer: string;
    imageUrl?: string | null;
  }) => Promise<void>;
  onCancel: () => void;
}

export default function QuestionEditor({
  initialData,
  topics,
  onSave,
  onCancel,
}: QuestionEditorProps) {
  const [topicId, setTopicId] = useState<string>(
    initialData ? String(initialData.topicId) : topics[0] ? String(topics[0].id) : ""
  );
  const [question, setQuestion] = useState(initialData?.question || "");
  const [answer, setAnswer] = useState(initialData?.answer || "");
  const [imageUrl, setImageUrl] = useState<string | null>(initialData?.imageUrl || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setTopicId(String(initialData.topicId));
      setQuestion(initialData.question);
      setAnswer(initialData.answer);
      setImageUrl(initialData.imageUrl || null);
    }
  }, [initialData]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsedTopicId = parseInt(topicId, 10);
    const result = insertQuestionSchema.safeParse({
      topicId: parsedTopicId,
      question: question.trim(),
      answer: answer.trim(),
      imageUrl: imageUrl || null,
    });

    if (!result.success) {
      setError(result.error.issues[0]?.message || "Validation failed");
      return;
    }

    setLoading(true);
    try {
      await onSave({
        topicId: parsedTopicId,
        question: question.trim(),
        answer: answer.trim(),
        imageUrl: imageUrl || null,
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

      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
          Topic
        </label>
        <Select value={topicId} onValueChange={setTopicId}>
          <SelectTrigger>
            <SelectValue placeholder="Select a topic" />
          </SelectTrigger>
          <SelectContent>
            {topics.map((t) => (
              <SelectItem key={t.id} value={String(t.id)}>
                {t.name} ({t.category})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
          Question
        </label>
        <Textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Enter the question..."
          rows={3}
          required
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
          Answer (Markdown)
        </label>
        <Tabs defaultValue="write" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="write">Write</TabsTrigger>
            <TabsTrigger value="preview">Live Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="write">
            <Textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Enter the answer with optional markdown..."
              rows={6}
              required
            />
          </TabsContent>
          <TabsContent value="preview">
            <div className="min-h-[140px] rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)] p-4">
              <ContentRenderer content={answer || "*Nothing to preview*"} />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
          Image (Optional)
        </label>
        <ImageUploader value={imageUrl} onChange={setImageUrl} />
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border)]">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          {initialData ? "Update Question" : "Create Question"}
        </Button>
      </div>
    </form>
  );
}
