import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "../../../lib/db";

const eventSchema = z.object({
  eventName: z.enum(["gallery_open", "contact_click", "whatsapp_click", "social_click"]),
  target: z.string().trim().max(120).optional(),
});

const recentRequests = new Map<string, number>();

export async function POST(request: Request) {
  const parsed = eventSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false }, { status: 400 });

  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anonymous";
  const throttleKey = `${forwarded}:${parsed.data.eventName}:${parsed.data.target || ""}`;
  const now = Date.now();
  const previous = recentRequests.get(throttleKey) || 0;
  if (now - previous < 1500) return NextResponse.json({ ok: true });
  recentRequests.set(throttleKey, now);

  const db = getDb();
  if (db) await db`INSERT INTO analytics_events (event_name, target) VALUES (${parsed.data.eventName}, ${parsed.data.target || null})`;
  return NextResponse.json({ ok: true });
}