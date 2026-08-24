import { Hono } from "hono";
import { SignJWT } from "jose";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { getDbStats } from "@/src/db";

const adminAuthRoute = new Hono();
const DEFAULT_SECRET = "notesprint-super-secret-key-production-2026";

adminAuthRoute.post("/auth", async (c) => {
  try {
    const body = (await c.req.json().catch(() => ({}))) || {};
    let envPassword = "";
    let envSecret = "";

    try {
      const ctx = getRequestContext();
      if (ctx?.env) {
        envPassword = (ctx.env as any).PASSWORD || "";
        envSecret = (ctx.env as any).JWT_SECRET || "";
      }
    } catch {}

    const expectedPassword = envPassword || (typeof process !== "undefined" && process.env?.PASSWORD) || "Ash1420@";

    if (!body.password || body.password !== expectedPassword) {
      return c.json({ error: "Incorrect password" }, 401);
    }

    const secretKey = new TextEncoder().encode(
      envSecret || (typeof process !== "undefined" && process.env?.JWT_SECRET) || expectedPassword || DEFAULT_SECRET
    );
    const token = await new SignJWT({ role: "admin" })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("74h")
      .sign(secretKey);

    return c.json({ token, success: true });
  } catch (err) {
    return c.json({ error: (err as Error).message }, 500);
  }
});

adminAuthRoute.get("/stats", async (c) => {
  let totalTopics = 0;
  let totalQuestions = 0;
  let totalArticles = 0;

  try {
    const stats = await getDbStats();
    totalTopics = stats.totalTopics;
    totalQuestions = stats.totalQuestions;
    totalArticles = stats.totalArticles;
  } catch (err) {
    console.warn("D1 stats fallback:", err);
  }

  return c.json({ totalTopics, totalQuestions, totalArticles });
});

export default adminAuthRoute;
