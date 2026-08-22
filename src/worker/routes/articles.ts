import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { createDb } from "../../db";
import { articles } from "../../db/schema";
import type { Env, Variables } from "../types";

export const articlesRouter = new Hono<{
  Bindings: Env;
  Variables: Variables;
}>();

articlesRouter.get("/", async (c) => {
  const category = c.req.query("category");
  const db = createDb(c.env.DB);

  let query = db
    .select({
      id: articles.id,
      slug: articles.slug,
      title: articles.title,
      category: articles.category,
      readingTime: articles.readingTime,
      difficulty: articles.difficulty,
      tags: articles.tags,
      createdAt: articles.createdAt,
      updatedAt: articles.updatedAt,
    })
    .from(articles);

  if (category) {
    query = query.where(eq(articles.category, category)) as typeof query;
  }

  const rows = await query.orderBy(articles.title);
  return c.json(rows);
});

articlesRouter.get("/:slug", async (c) => {
  const slug = c.req.param("slug");
  const db = createDb(c.env.DB);

  const rows = await db
    .select()
    .from(articles)
    .where(eq(articles.slug, slug))
    .limit(1);

  if (rows.length === 0) {
    return c.json({ error: "Article not found" }, 404);
  }

  return c.json(rows[0]);
});
