import { Hono } from "hono";
import { createDb, getAllArticles, getArticleBySlug } from "../../db";
import type { Env, Variables } from "../types";

export const articlesRouter = new Hono<{
  Bindings: Env;
  Variables: Variables;
}>();

articlesRouter.get("/", async (c) => {
  const category = c.req.query("category");
  const db = createDb(c.env.DB);
  const rows = await getAllArticles(category, db);
  return c.json(rows);
});

articlesRouter.get("/:slug", async (c) => {
  const slug = c.req.param("slug");
  const db = createDb(c.env.DB);
  const article = await getArticleBySlug(slug, db);

  if (!article) {
    return c.json({ error: "Article not found" }, 404);
  }

  return c.json(article);
});
