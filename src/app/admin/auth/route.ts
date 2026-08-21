import { NextResponse } from "next/server";
import { SignJWT } from "jose";

const DEFAULT_SECRET = "notesprint-super-secret-key-production-2026";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const expectedPassword = process.env.PASSWORD;

    if (!body.password || body.password !== expectedPassword) {
      return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
    }

    const secretKey = new TextEncoder().encode(process.env.JWT_SECRET || expectedPassword || DEFAULT_SECRET);
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
