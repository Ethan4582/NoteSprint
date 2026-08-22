import { createMiddleware } from "hono/factory";
import { jwtVerify, SignJWT } from "jose";
import type { Env, Variables } from "../types";

const DEFAULT_SECRET = "notesprint-super-secret-key-production-2026";

function getSecretKey(env: Env): Uint8Array {
  const secret = env.JWT_SECRET || env.PASSWORD || DEFAULT_SECRET;
  return new TextEncoder().encode(secret);
}

export async function signToken(env: Env): Promise<string> {
  const secretKey = getSecretKey(env);
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("74h")
    .sign(secretKey);
}

export const authMiddleware = createMiddleware<{
  Bindings: Env;
  Variables: Variables;
}>(async (c, next) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({ error: "Unauthorized: Missing or invalid token" }, 401);
  }

  const token = authHeader.substring(7).trim();
  try {
    const secretKey = getSecretKey(c.env);
    const { payload } = await jwtVerify(token, secretKey);
    c.set("userId", payload.role as string);
    await next();
  } catch {
    return c.json({ error: "Unauthorized: Token verification failed" }, 401);
  }
});
