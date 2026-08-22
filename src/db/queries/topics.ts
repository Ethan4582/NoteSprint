import { asc, desc, eq, sql } from "drizzle-orm";
import { getDb, AppDb } from "../index";
import { topics, questions, Topic } from "../schema";

export interface TopicWithCount extends Topic {
  questionCount: number;
}

export async function getAllTopics(dbInstance?: AppDb): Promise<TopicWithCount[]> {
  const db = dbInstance || getDb();
  return db
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
    .orderBy(asc(topics.name));
}

export async function getTopicBySlug(slug: string, dbInstance?: AppDb): Promise<Topic | null> {
  const db = dbInstance || getDb();
  const rows = await db
    .select()
    .from(topics)
    .where(eq(topics.slug, slug))
    .limit(1);

  return rows[0] || null;
}

export async function getTopTopics(limitCount = 5, dbInstance?: AppDb) {
  const db = dbInstance || getDb();
  return db
    .select({
      slug: topics.slug,
      name: topics.name,
      q_count: sql<number>`count(${questions.id})`.mapWith(Number),
    })
    .from(topics)
    .leftJoin(questions, eq(questions.topicId, topics.id))
    .groupBy(topics.id)
    .orderBy(desc(sql`count(${questions.id})`))
    .limit(limitCount);
}
