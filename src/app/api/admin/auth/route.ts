import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import { getRequestContext } from "@cloudflare/next-on-pages";

export const runtime = "edge";

const DEFAULT_SECRET = "notesprint-super-secret-key-production-2026";

export async function POST(req: Request) {
  try {
    const body = ((await req.json().catch(() => ({}))) || {}) as any;
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
      return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
    }

    const secretKey = new TextEncoder().encode(
      envSecret || (typeof process !== "undefined" && process.env?.JWT_SECRET) || expectedPassword || DEFAULT_SECRET
    );
    const token = await new SignJWT({ role: "admin" })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("74h")
      .sign(secretKey);

    return NextResponse.json({ token, success: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
