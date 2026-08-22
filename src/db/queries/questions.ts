import { asc, eq } from "drizzle-orm";
import { getDb, AppDb } from "../index";
import { questions, topics, Question, NewQuestion } from "../schema";

export interface QuestionWithTopic extends Question {
  topicSlug: string;
  topicName: string;
  category: string;
}

export async function getQuestionsByTopicId(topicId: number, dbInstance?: AppDb): Promise<Question[]> {
  const db = dbInstance || getDb();
  return db
    .select()
    .from(questions)
    .where(eq(questions.topicId, topicId))
    .orderBy(asc(questions.id));
}

export async function getQuestionById(id: number, dbInstance?: AppDb): Promise<QuestionWithTopic | null> {
  const db = dbInstance || getDb();
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

  return rows[0] || null;
}

export async function updateQuestion(
  id: number,
  data: Partial<NewQuestion>,
  dbInstance?: AppDb
) {
  const db = dbInstance || getDb();
  return db
    .update(questions)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(questions.id, id))
    .returning();
}

export async function insertQuestion(
  data: NewQuestion,
  dbInstance?: AppDb
) {
  const db = dbInstance || getDb();
  return db.insert(questions).values(data).returning();
}

export async function deleteQuestion(
  id: number,
  dbInstance?: AppDb
) {
  const db = dbInstance || getDb();
  return db.delete(questions).where(eq(questions.id, id)).returning();
}
