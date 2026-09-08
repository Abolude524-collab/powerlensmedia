import { NextResponse } from "next/server";
import { z } from "zod";
import { authenticateOwner, createSession } from "../../../../lib/auth";

const attempts = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

const loginSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(1).max(128),
});

export async function POST(request: Request) {
  const parsed = loginSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid email or password." }, { status: 400 });
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const key = `${forwarded || "unknown"}:${parsed.data.email.toLowerCase()}`;
  const now = Date.now();
  const current = attempts.get(key);
  if (current && current.resetAt > now && current.count >= MAX_ATTEMPTS) return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429, headers: { "Retry-After": String(Math.ceil((current.resetAt - now) / 1000)) } });
  const owner = await authenticateOwner(parsed.data.email, parsed.data.password);
  if (!owner) {
    const next = current && current.resetAt > now ? { count: current.count + 1, resetAt: current.resetAt } : { count: 1, resetAt: now + WINDOW_MS };
    attempts.set(key, next);
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }
  attempts.delete(key);
  await createSession(owner.id);
  return NextResponse.json({ ok: true });
}
