import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { z } from "zod";

export const topics = sqliteTable(
  "topics",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    category: text("category").notNull(),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  }
);

export const questions = sqliteTable(
  "questions",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    topicId: integer("topic_id")
      .notNull()
      .references(() => topics.id, { onDelete: "cascade" }),
    question: text("question").notNull(),
    answer: text("answer").notNull(),
    imageUrl: text("image_url"),
    sourceFile: text("source_file"),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (table) => [
    index("idx_questions_topic").on(table.topicId),
  ]
);

export const articles = sqliteTable(
  "articles",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    content: text("content").notNull(),
    category: text("category").notNull(),
    readingTime: integer("reading_time").notNull().default(1),
    difficulty: text("difficulty").notNull().default("Medium"),
    tags: text("tags"),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (table) => [
    index("idx_articles_category").on(table.category),
  ]
);

export type Topic = typeof topics.$inferSelect;
export type NewTopic = typeof topics.$inferInsert;

export type Question = typeof questions.$inferSelect;
export type NewQuestion = typeof questions.$inferInsert;

export type Article = typeof articles.$inferSelect;
export type NewArticle = typeof articles.$inferInsert;

export const topicSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  category: z.string().min(1),
});

export const insertQuestionSchema = z.object({
  topicId: z.number().int().positive(),
  question: z.string().min(1),
  answer: z.string().min(1),
  imageUrl: z.string().url().nullable().optional(),
  sourceFile: z.string().nullable().optional(),
});

export const updateQuestionSchema = insertQuestionSchema.partial();

export const insertArticleSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  content: z.string().min(1),
  category: z.string().min(1),
  readingTime: z.number().int().positive().optional().default(1),
  difficulty: z.enum(["Easy", "Medium", "Hard"]).optional().default("Medium"),
  tags: z.string().nullable().optional(),
});

export const updateArticleSchema = insertArticleSchema.partial();

export const authSchema = z.object({
  password: z.string().min(1),
});
