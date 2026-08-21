import type { Question, Topic, Article } from "@/src/db/schema";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

function getAuthHeader(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("notesprint_admin_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function adminLogin(password: string): Promise<{ success: boolean; token?: string; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/admin/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || "Login failed" };
    }
    if (data.token && typeof window !== "undefined") {
      localStorage.setItem("notesprint_admin_token", data.token);
    }
    return { success: true, token: data.token };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

export function adminLogout(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("notesprint_admin_token");
  }
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(localStorage.getItem("notesprint_admin_token"));
}

export async function getAdminStats(): Promise<{
  totalTopics: number;
  totalQuestions: number;
  totalArticles: number;
}> {
  const res = await fetch(`${API_BASE}/admin/stats`, {
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) throw new Error("Failed to fetch admin stats");
  return res.json();
}

export async function createQuestion(payload: {
  topicId: number;
  question: string;
  answer: string;
  imageUrl?: string | null;
  sourceFile?: string;
}): Promise<Question> {
  const res = await fetch(`${API_BASE}/admin/questions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to create question");
  }
  return res.json();
}

export async function updateQuestion(
  id: number,
  payload: Partial<{
    topicId: number;
    question: string;
    answer: string;
    imageUrl: string | null;
  }>
): Promise<Question> {
  const res = await fetch(`${API_BASE}/admin/questions/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to update question");
  }
  return res.json();
}

export async function deleteQuestion(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/admin/questions/${id}`, {
    method: "DELETE",
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) throw new Error("Failed to delete question");
}

export async function createArticle(payload: {
  slug: string;
  title: string;
  content: string;
  category: string;
  readingTime?: number;
  difficulty?: "Easy" | "Medium" | "Hard";
  tags?: string;
}): Promise<Article> {
  const res = await fetch(`${API_BASE}/admin/articles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to create article");
  }
  return res.json();
}

export async function updateArticle(
  slug: string,
  payload: Partial<{
    title: string;
    content: string;
    category: string;
    readingTime: number;
    difficulty: "Easy" | "Medium" | "Hard";
    tags: string;
  }>
): Promise<Article> {
  const res = await fetch(`${API_BASE}/admin/articles/${slug}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to update article");
  }
  return res.json();
}

export async function deleteArticle(slug: string): Promise<void> {
  const res = await fetch(`${API_BASE}/admin/articles/${slug}`, {
    method: "DELETE",
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) throw new Error("Failed to delete article");
}

export async function uploadImage(file: File): Promise<{ url: string; key: string }> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE}/admin/upload/image`, {
    method: "POST",
    headers: { ...getAuthHeader() },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to upload image");
  }
  return res.json();
}
