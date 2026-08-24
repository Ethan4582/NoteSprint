import { drizzle as drizzleD1 } from "drizzle-orm/d1";
import { drizzle as drizzleProxy } from "drizzle-orm/sqlite-proxy";
import type { BaseSQLiteDatabase } from "drizzle-orm/sqlite-core";
import type { D1Database } from "@cloudflare/workers-types";
import { getRequestContext } from "@cloudflare/next-on-pages";
import * as schema from "./schema";

function getEnvVar(key: string): string {
  if (typeof process !== "undefined" && process.env) {
    return process.env[key] || "";
  }
  return "";
}

const defaultAccountId = "39c549d629e751c6bd6195081b2a88b8";
const databaseId = "e867079a-d387-4c77-9304-4210a3f60fd4";

interface CloudflareEnv {
  DB?: D1Database;
  IMAGES?: unknown;
  R2_PUBLIC_URL?: string;
  PASSWORD?: string;
  JWT_SECRET?: string;
}

interface D1ApiResponse {
  success: boolean;
  errors?: Array<{ message: string }>;
  result?: Array<{
    results?: Array<Record<string, unknown> | unknown[]>;
  }>;
}

export async function executeD1Remote(
  sql: string,
  params: unknown[] = [],
  _method: "run" | "all" | "values" | "get" = "all"
) {
  void _method;
  const accountId = getEnvVar("CLOUDFLARE_ACCOUNT_ID") || defaultAccountId;
  const apiToken = getEnvVar("CLOUDFLARE_API_TOKEN");

  if (!apiToken) {
    return { rows: [] };
  }

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

    const json = (await res.json()) as D1ApiResponse;
    if (!json.success || !json.result || !json.result[0]) {
      return { rows: [] };
    }

    const rawResults = json.result[0].results || [];
    const rows = rawResults.map((row: unknown) => {
      if (Array.isArray(row)) return row;
      if (row && typeof row === "object") return Object.values(row);
      return row;
    });

    return { rows };
  } catch {
    return { rows: [] };
  } finally {
    clearTimeout(timeout);
  }
}

export type AppDb = BaseSQLiteDatabase<"async", unknown, typeof schema>;

export function createDb(d1?: D1Database): AppDb {
  let targetD1 = d1;

  if (!targetD1) {
    try {
      const ctx = getRequestContext();
      const env = ctx?.env as CloudflareEnv | undefined;
      if (env?.DB) {
        targetD1 = env.DB;
      }
    } catch {
      // not in cloudflare pages context
    }
  }

  if (targetD1) {
    return drizzleD1(targetD1, { schema }) as unknown as AppDb;
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
