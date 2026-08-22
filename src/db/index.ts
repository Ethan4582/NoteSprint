import { drizzle as drizzleD1 } from "drizzle-orm/d1";
import { drizzle as drizzleProxy } from "drizzle-orm/sqlite-proxy";
import type { BaseSQLiteDatabase } from "drizzle-orm/sqlite-core";
import type { D1Database } from "@cloudflare/workers-types";
import * as schema from "./schema";

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID || "";
const apiToken = process.env.CLOUDFLARE_API_TOKEN || "";
const databaseId = "e867079a-d387-4c77-9304-4210a3f60fd4";

export async function executeD1Remote(
  sql: string,
  params: unknown[] = [],
  _method: "run" | "all" | "values" | "get" = "all"
) {
  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sql, params }),
      signal: controller.signal,
    });

    const json = await res.json();
    if (!json.success || !json.result || !json.result[0]) {
      throw new Error(json.errors?.[0]?.message || "D1 Query failed");
    }

    const rawResults = json.result[0].results || [];
    const rows = rawResults.map((row: unknown) => {
      if (Array.isArray(row)) return row;
      if (row && typeof row === "object") return Object.values(row);
      return row;
    });

    return { rows };
  } finally {
    clearTimeout(timeout);
  }
}

export type AppDb = BaseSQLiteDatabase<"async", any, typeof schema>;

export function createDb(d1?: D1Database): AppDb {
  if (d1) {
    return drizzleD1(d1, { schema }) as unknown as AppDb;
  }

  return drizzleProxy(
    async (sql, params, method) => {
      return executeD1Remote(sql, params, method);
    },
    { schema }
  ) as unknown as AppDb;
}

export function getDb(d1?: D1Database): AppDb {
  return createDb(d1);
}

export * from "./schema";
export * from "./queries";
