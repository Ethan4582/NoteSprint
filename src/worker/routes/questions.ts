import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { createDb } from "../../db";
import { topics, questions } from "../../db/schema";
import type { Env, Variables } from "../types";

export const questionsRouter = new Hono<{
  Bindings: Env;
  Variables: Variables;
}>();

questionsRouter.get("/topics/:slug/questions", async (c) => {
  const slug = c.req.param("slug");
  const db = createDb(c.env.DB);

  const topicRows = await db
    .select()
    .from(topics)
    .where(eq(topics.slug, slug))
    .limit(1);

  if (topicRows.length === 0) {
    return c.json({ error: "Topic not found" }, 404);
  }

  const topic = topicRows[0];
  const questionRows = await db
    .select()
    .from(questions)
    .where(eq(questions.topicId, topic.id))
    .orderBy(questions.id);

  return c.json({
    topic,
    questions: questionRows,
  });
});

questionsRouter.get("/questions/:id", async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  if (isNaN(id)) {
    return c.json({ error: "Invalid question id" }, 400);
  }

  const db = createDb(c.env.DB);
  const rows = await db
    .select({
      id: questions.id,
      topicId: questions.topicId,
      question: questions.question,
      answer: questions.answer,
      imageUrl: questions.imageUrl,
      sourceFile: questions.sourceFile,
      createdAt: questions.createdAt,
      updatedAt: questions.updatedAt,
      topicSlug: topics.slug,
      topicName: topics.name,
      category: topics.category,
    })
    .from(questions)
    .innerJoin(topics, eq(topics.id, questions.topicId))
    .where(eq(questions.id, id))
    .limit(1);

  if (rows.length === 0) {
    return c.json({ error: "Question not found" }, 404);
  }

  return c.json(rows[0]);
});
