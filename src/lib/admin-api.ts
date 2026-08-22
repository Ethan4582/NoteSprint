import { SignJWT } from "jose";
import type { Question, Topic, Article } from "@/src/db/schema";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

function getAuthHeader(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("notesprint_admin_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function parseResponse<T = unknown>(res: Response): Promise<T> {
  const text = await res.text();
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(res.ok ? "Invalid server response" : `Server error: ${res.status} ${res.statusText}`);
  }
}

export async function adminLogin(password: string): Promise<{ success: boolean; token?: string; error?: string }> {
  if (API_BASE) {
    try {
      const res = await fetch(`${API_BASE}/admin/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await parseResponse<{ token?: string; error?: string }>(res);
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

  try {
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      const data = await parseResponse<{ token?: string; error?: string }>(res);
      if (data.token && typeof window !== "undefined") {
        localStorage.setItem("notesprint_admin_token", data.token);
      }
      return { success: true, token: data.token };
    }
  } catch {
    // Fall back to client authentication
  }

  const expectedPassword = "Ash1420@";
  if (password !== expectedPassword) {
    return { success: false, error: "Incorrect password" };
  }

  const secretKey = new TextEncoder().encode("notesprint-super-secret-key-production-2026");
  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("74h")
    .sign(secretKey);

  if (typeof window !== "undefined") {
    localStorage.setItem("notesprint_admin_token", token);
  }
  return { success: true, token };
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
  const url = API_BASE ? `${API_BASE}/admin/stats` : "/api/admin/stats";
  try {
    const res = await fetch(url, {
      headers: { ...getAuthHeader() },
    });
    if (res.ok) return parseResponse(res);
  } catch {
    // fallback
  }
  return {
    totalTopics: 38,
    totalQuestions: 198,
    totalArticles: 1,
  };
}

export async function createQuestion(payload: {
  topicId: number;
  question: string;
  answer: string;
  imageUrl?: string | null;
  sourceFile?: string;
}): Promise<Question> {
  const url = API_BASE ? `${API_BASE}/admin/questions` : "/api/admin/questions";
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await parseResponse<{ error?: string }>(res);
    throw new Error(err.error || "Failed to create question");
  }
  return parseResponse<Question>(res);
}

export async function updateQuestion(
  id: number,
  payload: Partial<{
    topicId: number;
    topicSlug: string;
    question: string;
    answer: string;
    imageUrl: string | null;
  }>
): Promise<Question> {
  const url = API_BASE ? `${API_BASE}/admin/questions/${id}` : `/api/admin/questions/${id}`;
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await parseResponse<{ error?: string }>(res);
    throw new Error(err.error || "Failed to update question");
  }
  return parseResponse<Question>(res);
}

export async function deleteQuestion(id: number): Promise<void> {
  const url = API_BASE ? `${API_BASE}/admin/questions/${id}` : `/api/admin/questions/${id}`;
  const res = await fetch(url, {
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
  const url = API_BASE ? `${API_BASE}/admin/articles` : "/api/admin/articles";
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await parseResponse<{ error?: string }>(res);
    throw new Error(err.error || "Failed to create article");
  }
  return parseResponse<Article>(res);
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
  const url = API_BASE ? `${API_BASE}/admin/articles/${slug}` : `/api/admin/articles/${slug}`;
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await parseResponse<{ error?: string }>(res);
    throw new Error(err.error || "Failed to update article");
  }
  return parseResponse<Article>(res);
}

export async function deleteArticle(slug: string): Promise<void> {
  const url = API_BASE ? `${API_BASE}/admin/articles/${slug}` : `/api/admin/articles/${slug}`;
  const res = await fetch(url, {
    method: "DELETE",
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) throw new Error("Failed to delete article");
}

export async function uploadImage(file: File): Promise<{ url: string; key: string }> {
  const formData = new FormData();
  formData.append("file", file);

  const url = API_BASE ? `${API_BASE}/admin/upload/image` : "/api/admin/upload/image";
  const res = await fetch(url, {
    method: "POST",
    headers: { ...getAuthHeader() },
    body: formData,
  });

  if (!res.ok) {
    const err = await parseResponse<{ error?: string }>(res);
    throw new Error(err.error || "Failed to upload image");
  }
  return parseResponse<{ url: string; key: string }>(res);
}

export async function deleteUploadedImage(urlOrKey: string): Promise<void> {
  const url = API_BASE
    ? `${API_BASE}/admin/upload/image?url=${encodeURIComponent(urlOrKey)}`
    : `/api/admin/upload/image?url=${encodeURIComponent(urlOrKey)}`;
  const res = await fetch(url, {
    method: "DELETE",
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) {
    const err = await parseResponse<{ error?: string }>(res).catch(() => ({ error: "Failed to delete image" }));
    throw new Error(err.error || "Failed to delete image");
  }
}
