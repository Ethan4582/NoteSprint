import { Hono } from "hono";
import { eq, sql } from "drizzle-orm";
import { createDb } from "../../db";
import { topics, questions } from "../../db/schema";
import type { Env, Variables } from "../types";

export const topicsRouter = new Hono<{
  Bindings: Env;
  Variables: Variables;
}>();

topicsRouter.get("/", async (c) => {
  const db = createDb(c.env.DB);
  const result = await db
    .select({
      id: topics.id,
      slug: topics.slug,
      name: topics.name,
      category: topics.category,
      createdAt: topics.createdAt,
      questionCount: sql<number>`count(${questions.id})`.mapWith(Number),
    })
    .from(topics)
    .leftJoin(questions, eq(questions.topicId, topics.id))
    .groupBy(topics.id)
    .orderBy(topics.name);

  return c.json(result);
});
