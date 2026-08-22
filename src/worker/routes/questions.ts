import { Hono } from "hono";
import { createDb, getTopicBySlug, getQuestionsByTopicId, getQuestionById } from "../../db";
import type { Env, Variables } from "../types";

export const questionsRouter = new Hono<{
  Bindings: Env;
  Variables: Variables;
}>();

questionsRouter.get("/topics/:slug/questions", async (c) => {
  const slug = c.req.param("slug");
  const db = createDb(c.env.DB);

  const topic = await getTopicBySlug(slug, db);

  if (!topic) {
    return c.json({ error: "Topic not found" }, 404);
  }

  const questionRows = await getQuestionsByTopicId(topic.id, db);

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
  const row = await getQuestionById(id, db);

  if (!row) {
    return c.json({ error: "Question not found" }, 404);
  }

  return c.json(row);
});
