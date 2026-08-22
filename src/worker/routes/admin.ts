import { Hono } from "hono";
import { eq, sql } from "drizzle-orm";
import { createDb } from "../../db";
import { topics, questions, articles, authSchema, insertQuestionSchema, updateQuestionSchema, insertArticleSchema, updateArticleSchema } from "../../db/schema";
import { signToken, authMiddleware } from "../middleware/auth";
import type { Env, Variables } from "../types";

export const adminRouter = new Hono<{
  Bindings: Env;
  Variables: Variables;
}>();

// Auth route
adminRouter.post("/auth", async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const parse = authSchema.safeParse(body);
  if (!parse.success) {
    return c.json({ error: "Invalid password format" }, 400);
  }

  const expectedPassword = c.env.PASSWORD || "Ash1420@";
  if (parse.data.password !== expectedPassword) {
    return c.json({ error: "Incorrect password" }, 401);
  }

  const token = await signToken(c.env);
  return c.json({ token, success: true });
});

// Protect subsequent admin routes
adminRouter.use("/*", authMiddleware);

// Stats overview
adminRouter.get("/stats", async (c) => {
  const db = createDb(c.env.DB);
  const [topicCount] = await db.select({ count: sql<number>`count(*)`.mapWith(Number) }).from(topics);
  const [questionCount] = await db.select({ count: sql<number>`count(*)`.mapWith(Number) }).from(questions);
  const [articleCount] = await db.select({ count: sql<number>`count(*)`.mapWith(Number) }).from(articles);

  return c.json({
    totalTopics: topicCount?.count || 0,
    totalQuestions: questionCount?.count || 0,
    totalArticles: articleCount?.count || 0,
  });
});

// Question management
adminRouter.post("/questions", async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const parse = insertQuestionSchema.safeParse(body);
  if (!parse.success) {
    return c.json({ error: "Validation failed", details: parse.error.format() }, 400);
  }

  const db = createDb(c.env.DB);
  const result = await db.insert(questions).values({
    topicId: parse.data.topicId,
    question: parse.data.question,
    answer: parse.data.answer,
    imageUrl: parse.data.imageUrl || null,
    sourceFile: parse.data.sourceFile || "admin",
  }).returning();

  return c.json(result[0], 201);
});

adminRouter.put("/questions/:id", async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  if (isNaN(id)) return c.json({ error: "Invalid question id" }, 400);

  const body = await c.req.json().catch(() => ({}));
  const parse = updateQuestionSchema.safeParse(body);
  if (!parse.success) {
    return c.json({ error: "Validation failed", details: parse.error.format() }, 400);
  }

  const db = createDb(c.env.DB);
  const updated = await db
    .update(questions)
    .set({
      ...parse.data,
      updatedAt: new Date(),
    })
    .where(eq(questions.id, id))
    .returning();

  if (updated.length === 0) return c.json({ error: "Question not found" }, 404);
  return c.json(updated[0]);
});

adminRouter.delete("/questions/:id", async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  if (isNaN(id)) return c.json({ error: "Invalid question id" }, 400);

  const db = createDb(c.env.DB);
  const deleted = await db.delete(questions).where(eq(questions.id, id)).returning();
  if (deleted.length === 0) return c.json({ error: "Question not found" }, 404);

  return c.json({ success: true, deleted: deleted[0] });
});

// Article management
adminRouter.post("/articles", async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const parse = insertArticleSchema.safeParse(body);
  if (!parse.success) {
    return c.json({ error: "Validation failed", details: parse.error.format() }, 400);
  }

  const db = createDb(c.env.DB);
  const result = await db.insert(articles).values({
    slug: parse.data.slug,
    title: parse.data.title,
    content: parse.data.content,
    category: parse.data.category,
    readingTime: parse.data.readingTime,
    difficulty: parse.data.difficulty,
    tags: parse.data.tags || null,
  }).returning();

  return c.json(result[0], 201);
});

adminRouter.put("/articles/:slug", async (c) => {
  const slug = c.req.param("slug");
  const body = await c.req.json().catch(() => ({}));
  const parse = updateArticleSchema.safeParse(body);
  if (!parse.success) {
    return c.json({ error: "Validation failed", details: parse.error.format() }, 400);
  }

  const db = createDb(c.env.DB);
  const updated = await db
    .update(articles)
    .set({
      ...parse.data,
      updatedAt: new Date(),
    })
    .where(eq(articles.slug, slug))
    .returning();

  if (updated.length === 0) return c.json({ error: "Article not found" }, 404);
  return c.json(updated[0]);
});

adminRouter.delete("/articles/:slug", async (c) => {
  const slug = c.req.param("slug");
  const db = createDb(c.env.DB);
  const deleted = await db.delete(articles).where(eq(articles.slug, slug)).returning();
  if (deleted.length === 0) return c.json({ error: "Article not found" }, 404);

  return c.json({ success: true, deleted: deleted[0] });
});

// Image upload to R2
adminRouter.post("/upload/image", async (c) => {
  const formData = await c.req.parseBody();
  const file = formData.file;

  if (!file || !(file instanceof File)) {
    return c.json({ error: "No image file provided" }, 400);
  }

  const buffer = await file.arrayBuffer();
  const rawExt = file.name.split(".").pop() || "png";
  const uniqueName = `uploads/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${rawExt}`;

  await c.env.IMAGES.put(uniqueName, buffer, {
    httpMetadata: { contentType: file.type || "image/png" },
  });

  const baseUrl = (c.env.R2_PUBLIC_URL || "https://pub-b534e22f723c443c85a87484a6c795cc.r2.dev").replace(/\/$/, "");
  const publicUrl = `${baseUrl}/${uniqueName}`;

  return c.json({ success: true, url: publicUrl, key: uniqueName });
});
