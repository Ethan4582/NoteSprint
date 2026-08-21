import type { D1Database, R2Bucket } from "@cloudflare/workers-types";

export interface Env {
  DB: D1Database;
  IMAGES: R2Bucket;
  JWT_SECRET?: string;
  PASSWORD?: string;
  R2_PUBLIC_URL?: string;
}

export interface Variables {
  userId?: string;
}
