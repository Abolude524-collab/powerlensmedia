import { NextResponse } from "next/server";
import { requireOwner } from "../../../../lib/auth";
import { getDb } from "../../../../lib/db";
import { normalizeCategory } from "../../../../lib/normalize";

export async function GET() {
  try {
    await requireOwner();
    const db = getDb();
    if (!db) return NextResponse.json({ categories: [] });
    const rows = (await db`
      SELECT DISTINCT category
      FROM works
      WHERE category IS NOT NULL AND BTRIM(category) <> ''
      ORDER BY category ASC
    `) as unknown as Array<{ category: string }>;
    return NextResponse.json({ categories: Array.from(new Set(rows.map((row) => normalizeCategory(row.category)).filter(Boolean))).sort() });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    return NextResponse.json({ error: "Unable to load categories." }, { status: 500 });
  }
}