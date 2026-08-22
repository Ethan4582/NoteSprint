"use client";

import { useState, useEffect, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetchTopics, fetchQuestion } from "@/src/lib/api";
import { updateQuestion } from "@/src/lib/admin-api";
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
import { Loader2 } from "lucide-react";

export default function QuestionEditClient({ id }: { id: number }) {
  const router = useRouter();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [topicId, setTopicId] = useState<string>("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([fetchTopics(), fetchQuestion(id)])
      .then(([topicsRes, qRes]) => {
        setTopics(topicsRes);
        if (qRes) {
          setTopicId(String(qRes.topicId));
          setQuestion(qRes.question);
          setAnswer(qRes.answer);
        }
      })
      .finally(() => setInitialLoading(false));
  }, [id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) {
      setError("Please provide both question and answer");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await updateQuestion(id, {
        topicId: parseInt(topicId, 10),
        question: question.trim(),
        answer: answer.trim(),
      });
      router.push("/admin/questions");
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
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
            Edit Question #{id}
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Modify question title and answer content.
          </p>
        </div>
        <Link href="/admin/questions">
          <Button variant="ghost" size="sm">Cancel</Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-[var(--error)] font-medium">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
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

          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              Question Title
            </label>
            <Input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="What is..."
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
            Answer & Explanation
          </label>
          <RichMarkdownEditor
            value={answer}
            onChange={setAnswer}
            size="small"
            placeholder="Write the explanation in markdown..."
          />
        </div>

        <Button type="submit" disabled={loading} className="w-full h-12 text-base font-bold">
          {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : "Save Changes"}
        </Button>
      </form>
    </div>
  );
}
