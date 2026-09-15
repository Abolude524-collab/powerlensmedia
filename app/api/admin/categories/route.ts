import { NextResponse } from "next/server";
import { requireOwner } from "../../../../lib/auth";
import { getDb } from "../../../../lib/db";
import { normalizeCategory } from "../../../../lib/normalize";
import { FALLBACK_PHOTOS, FALLBACK_SERVICES } from "../../../../lib/content-fallback";

const DEFAULT_CATEGORIES = Array.from(
  new Set([
    ...FALLBACK_PHOTOS.map((p) => p.category),
    ...FALLBACK_SERVICES.map((s) => s.category),
    "Wedding", "Portraits", "Events", "Graduation", "Commercial", "Documentary", "Landscape", "Street"
  ].map((c) => normalizeCategory(c)).filter(Boolean))
);

export async function GET() {
  try {
    await requireOwner();
    const db = getDb();
    if (!db) return NextResponse.json({ categories: DEFAULT_CATEGORIES.sort() });

    const workRows = (await db`
      SELECT DISTINCT category
      FROM works
      WHERE category IS NOT NULL AND BTRIM(category) <> ''
    `) as unknown as Array<{ category: string }>;

    const serviceRows = (await db`
      SELECT DISTINCT category
      FROM services
      WHERE category IS NOT NULL AND BTRIM(category) <> ''
    `) as unknown as Array<{ category: string }>;

    const dbCategories = [
      ...workRows.map((row) => normalizeCategory(row.category)),
      ...serviceRows.map((row) => normalizeCategory(row.category)),
    ];

    const allCategories = Array.from(new Set([...DEFAULT_CATEGORIES, ...dbCategories].filter(Boolean))).sort();

    return NextResponse.json({ categories: allCategories });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    return NextResponse.json({ categories: DEFAULT_CATEGORIES.sort() });
  }
}