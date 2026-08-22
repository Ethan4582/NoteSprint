import type { Topic, Question, Article } from "@/src/db/schema";

const API_BASE = (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_API_URL) || "";

export interface TopicWithCount extends Topic {
  questionCount: number;
}

export async function fetchTopics(): Promise<TopicWithCount[]> {
  try {
    const res = await fetch(`${API_BASE}/api/topics`);
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function fetchTopicQuestions(slug: string): Promise<{ topic: Topic; questions: Question[] } | null> {
  try {
    const res = await fetch(`${API_BASE}/api/topics/${slug}/questions`);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function fetchQuestion(id: number): Promise<(Question & { topicSlug: string; topicName: string; category: string }) | null> {
  try {
    const res = await fetch(`${API_BASE}/api/questions/${id}`);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function fetchQuestionByTopic(
  slug: string,
  id: number
): Promise<(Question & { topicSlug: string; topicName: string; category: string }) | null> {
  try {
    const topicData = await fetchTopicQuestions(slug);
    if (topicData && topicData.questions) {
      const found = topicData.questions.find((q, idx) => q.id === id || idx + 1 === id);
      if (found) {
        return {
          ...found,
          topicSlug: slug,
          topicName: topicData.topic?.name || slug.replace(/_/g, " "),
          category: topicData.topic?.category || "tech",
        };
      }
    }
  } catch {
    // fallback
  }

  try {
    const res = await fetch(`${API_BASE}/api/topics/${slug}/questions/${id}`);
    if (res.ok) return res.json();
  } catch {
    // fallback
  }

  return null;
}

export async function fetchArticles(category?: string): Promise<Article[]> {
  try {
    const res = await fetch(`${API_BASE}/api/articles`);
    if (!res.ok) return [];
    const list: Article[] = await res.json();
    if (category && category !== "all") {
      return list.filter((a) => a.category === category);
    }
    return list;
  } catch {
    return [];
  }
}

export async function fetchArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const res = await fetch(`${API_BASE}/api/articles/${slug}`);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}
