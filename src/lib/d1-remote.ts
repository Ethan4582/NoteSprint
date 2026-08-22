import { executeD1Remote } from "@/src/db";

export async function queryD1<T = unknown>(sql: string, params: unknown[] = []): Promise<T[]> {
  const { rows } = await executeD1Remote(sql, params);
  return rows as T[];
}
