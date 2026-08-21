import type { Topic, Question, Article } from "@/src/db/schema";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

export interface TopicWithCount extends Topic {
  questionCount: number;
}

export async function fetchTopics(): Promise<TopicWithCount[]> {
  try {
    const res = await fetch(`${API_BASE}/api/topics`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function fetchTopicQuestions(slug: string): Promise<{ topic: Topic; questions: Question[] } | null> {
  try {
    const res = await fetch(`${API_BASE}/api/topics/${slug}/questions`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function fetchQuestion(id: number): Promise<(Question & { topicSlug: string; topicName: string; category: string }) | null> {
  try {
    const res = await fetch(`${API_BASE}/api/questions/${id}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function fetchArticles(category?: string): Promise<Article[]> {
  try {
    const url = category ? `${API_BASE}/api/articles?category=${encodeURIComponent(category)}` : `${API_BASE}/api/articles`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function fetchArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const res = await fetch(`${API_BASE}/api/articles/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}
