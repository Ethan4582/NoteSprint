import type { Topic, Question, Article } from "@/src/db/schema";

const API_BASE = (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_API_URL) || "";

export interface TopicWithCount extends Topic {
  questionCount: number;
}

export type EnrichedQuestion = Question & { topicSlug: string; topicName: string; category: string };

let topicsCache: Promise<TopicWithCount[]> | null = null;
let articlesCache: Promise<Article[]> | null = null;
const topicQuestionsCache = new Map<string, Promise<{ topic: Topic; questions: Question[] } | null>>();
const singleQuestionCache = new Map<number, Promise<EnrichedQuestion | null>>();

export async function fetchTopics(): Promise<TopicWithCount[]> {
  if (topicsCache) return topicsCache;
  topicsCache = (async () => {
    try {
      const res = await fetch(`${API_BASE}/api/topics`);
      if (!res.ok) {
        topicsCache = null;
        return [];
      }
      return await res.json();
    } catch {
      topicsCache = null;
      return [];
    }
  })();
  return topicsCache;
}

export async function fetchTopicQuestions(slug: string): Promise<{ topic: Topic; questions: Question[] } | null> {
  const cached = topicQuestionsCache.get(slug);
  if (cached) return cached;

  const promise = (async () => {
    try {
      const res = await fetch(`${API_BASE}/api/topics/${slug}/questions`);
      if (!res.ok) {
        topicQuestionsCache.delete(slug);
        return null;
      }
      const data = await res.json();
      if (data?.questions) {
        // Pre-populate single questions cache
        data.questions.forEach((q: Question) => {
          singleQuestionCache.set(
            q.id,
            Promise.resolve({
              ...q,
              topicSlug: slug,
              topicName: data.topic?.name || slug.replace(/_/g, " "),
              category: data.topic?.category || "tech",
            })
          );
        });
      }
      return data;
    } catch {
      topicQuestionsCache.delete(slug);
      return null;
    }
  })();

  topicQuestionsCache.set(slug, promise);
  return promise;
}

export async function fetchQuestion(id: number): Promise<EnrichedQuestion | null> {
  const cached = singleQuestionCache.get(id);
  if (cached) return cached;

  const promise = (async () => {
    try {
      const res = await fetch(`${API_BASE}/api/questions/${id}`);
      if (!res.ok) {
        singleQuestionCache.delete(id);
        return null;
      }
      return await res.json();
    } catch {
      singleQuestionCache.delete(id);
      return null;
    }
  })();

  singleQuestionCache.set(id, promise);
  return promise;
}

export async function fetchQuestions(ids: number[]): Promise<EnrichedQuestion[]> {
  if (!ids.length) return [];

  // Check what's already cached
  const missingIds: number[] = [];
  const results: EnrichedQuestion[] = [];

  for (const id of ids) {
    if (singleQuestionCache.has(id)) {
      const item = await singleQuestionCache.get(id);
      if (item) results.push(item);
    } else {
      missingIds.push(id);
    }
  }

  if (missingIds.length === 0) {
    return results;
  }

  try {
    const res = await fetch(`${API_BASE}/api/questions?ids=${missingIds.join(",")}`);
    if (res.ok) {
      const fetched: EnrichedQuestion[] = await res.json();
      fetched.forEach((q) => {
        singleQuestionCache.set(q.id, Promise.resolve(q));
        results.push(q);
      });
    }
  } catch {
    // fallback
  }

  return results;
}

export async function fetchQuestionByTopic(
  slug: string,
  id: number
): Promise<EnrichedQuestion | null> {
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

  return fetchQuestion(id);
}

export async function fetchArticles(category?: string): Promise<Article[]> {
  if (!articlesCache) {
    articlesCache = (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/articles`);
        if (!res.ok) {
          articlesCache = null;
          return [];
        }
        return await res.json();
      } catch {
        articlesCache = null;
        return [];
      }
    })();
  }

  const list = await articlesCache;
  if (category && category !== "all") {
    return list.filter((a) => a.category === category);
  }
  return list;
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
