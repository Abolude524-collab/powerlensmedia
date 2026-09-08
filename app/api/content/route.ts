import { NextResponse } from "next/server";
import { FALLBACK_SETTINGS, FALLBACK_PHOTOS } from "../../../lib/content-fallback";
import { getPublishedWorks, getSiteSettings } from "../../../lib/content-db";
import { normalizeCategory } from "../../../lib/normalize";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const photos = await getPublishedWorks();
    const visiblePhotos = photos.length ? photos : FALLBACK_PHOTOS;
    const categories = Array.from(new Set(visiblePhotos.map((photo) => normalizeCategory(photo.category)).filter(Boolean))).sort((first, second) => first.localeCompare(second));
    return NextResponse.json({ photos: visiblePhotos, categories, settings: await getSiteSettings() });
  } catch (error) {
    console.warn("Neon content warning (using fallback dataset):", error);
    const categories = Array.from(new Set(FALLBACK_PHOTOS.map((photo) => photo.category?.trim()).filter((category): category is string => Boolean(category)))).sort((first, second) => first.localeCompare(second));
    return NextResponse.json({ photos: FALLBACK_PHOTOS, categories, settings: FALLBACK_SETTINGS });
  }
}
