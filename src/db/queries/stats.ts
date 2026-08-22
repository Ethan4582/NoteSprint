import { sql } from "drizzle-orm";
import { getDb, AppDb } from "../index";
import { topics, questions, articles } from "../schema";

export async function getDbStats(dbInstance?: AppDb) {
  const db = dbInstance || getDb();
  const [topicRes] = await db.select({ count: sql<number>`count(*)`.mapWith(Number) }).from(topics);
  const [questionRes] = await db.select({ count: sql<number>`count(*)`.mapWith(Number) }).from(questions);
  const [articleRes] = await db.select({ count: sql<number>`count(*)`.mapWith(Number) }).from(articles);

  return {
    totalTopics: topicRes?.count || 0,
    totalQuestions: questionRes?.count || 0,
    totalArticles: articleRes?.count || 0,
  };
}
