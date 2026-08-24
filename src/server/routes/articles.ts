import { Hono } from "hono";
import { getAllArticles, getArticleBySlug } from "@/src/db";

const articlesRoute = new Hono();

articlesRoute.get("/", async (c) => {
  try {
    const category = c.req.query("category") || undefined;
    const articles = await getAllArticles(category);
    return c.json(articles || [], 200, {
      "Cache-Control": "public, max-age=60, s-maxage=3600, stale-while-revalidate=86400",
    });
  } catch (err) {
    console.error("Failed to fetch articles:", err);
    return c.json({ error: "Failed to fetch articles" }, 500);
  }
});

articlesRoute.get("/:slug", async (c) => {
  const slug = c.req.param("slug");
  try {
    const article = await getArticleBySlug(slug);
    if (!article) return c.json({ error: "Article not found" }, 404);

    return c.json(article, 200, {
      "Cache-Control": "public, max-age=60, s-maxage=3600, stale-while-revalidate=86400",
    });
  } catch (err) {
    console.error("Failed to fetch article by slug:", err);
    return c.json({ error: "Failed to fetch article" }, 500);
  }
});

export default articlesRoute;
