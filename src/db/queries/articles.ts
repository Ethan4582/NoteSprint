import { asc, eq, or } from "drizzle-orm";
import { getDb, AppDb } from "../index";
import { articles, Article, NewArticle } from "../schema";

export async function getAllArticles(category?: string, dbInstance?: AppDb): Promise<Article[]> {
  const db = dbInstance || getDb();
  let query = db.select().from(articles);

  if (category && category !== "all") {
    query = query.where(eq(articles.category, category)) as typeof query;
  }

  return query.orderBy(asc(articles.title));
}

export async function getArticleBySlug(slug: string, dbInstance?: AppDb): Promise<Article | null> {
  const db = dbInstance || getDb();
  const rows = await db
    .select()
    .from(articles)
    .where(eq(articles.slug, slug))
    .limit(1);

  return rows[0] || null;
}

export async function insertArticle(data: NewArticle, dbInstance?: AppDb) {
  const db = dbInstance || getDb();
  return db.insert(articles).values(data).returning();
}

export async function updateArticle(
  slug: string,
  data: Partial<NewArticle>,
  altSlug?: string,
  dbInstance?: AppDb
) {
  const db = dbInstance || getDb();
  const condition = altSlug ? or(eq(articles.slug, slug), eq(articles.slug, altSlug)) : eq(articles.slug, slug);
  return db
    .update(articles)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(condition)
    .returning();
}

export async function deleteArticle(slug: string, dbInstance?: AppDb) {
  const db = dbInstance || getDb();
  return db.delete(articles).where(eq(articles.slug, slug)).returning();
}
