import { Hono } from "hono";
import { insertArticle, updateArticle, deleteArticle } from "@/src/db";

const adminArticlesRoute = new Hono();

adminArticlesRoute.post("/", async (c) => {
  try {
    const body = await c.req.json();
    const category = body.category || "lld";
    const slug = (body.slug || "new-article")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const tagsJson = typeof body.tags === "string" ? body.tags : JSON.stringify(body.tags || []);
    const result = await insertArticle({
      slug,
      title: body.title || slug,
      content: body.content || "",
      category,
      readingTime: Number(body.readingTime) || 5,
      difficulty: body.difficulty || "Medium",
      tags: tagsJson,
    });

    return c.json(
      result[0] || {
        slug,
        title: body.title,
        content: body.content,
        category,
        readingTime: body.readingTime || 5,
        difficulty: body.difficulty || "Medium",
        tags: tagsJson,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      201
    );
  } catch (err) {
    return c.json({ error: (err as Error).message }, 500);
  }
});

adminArticlesRoute.put("/:slug", async (c) => {
  try {
    const slug = c.req.param("slug");
    const body = await c.req.json();
    const tagsJson = typeof body.tags === "string" ? body.tags : JSON.stringify(body.tags || []);

    const updated = await updateArticle(slug, {
      title: body.title,
      content: body.content,
      category: body.category || "lld",
      readingTime: body.readingTime ? Number(body.readingTime) : undefined,
      difficulty: body.difficulty,
      tags: tagsJson,
    });

    if (!updated || updated.length === 0) {
      return c.json({ error: "Article not found" }, 404);
    }

    return c.json(updated[0]);
  } catch (err) {
    return c.json({ error: (err as Error).message }, 500);
  }
});

adminArticlesRoute.delete("/:slug", async (c) => {
  try {
    const slug = c.req.param("slug");
    const deleted = await deleteArticle(slug);

    if (!deleted || deleted.length === 0) {
      return c.json({ error: "Article not found" }, 404);
    }

    return c.json({ success: true, deleted: deleted[0] });
  } catch (err) {
    return c.json({ error: (err as Error).message }, 500);
  }
});

export default adminArticlesRoute;
