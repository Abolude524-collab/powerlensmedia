import { NextResponse } from "next/server";
import { FALLBACK_SETTINGS, FALLBACK_PHOTOS, FALLBACK_SERVICES } from "../../../lib/content-fallback";
import { getPublishedWorks, getSiteSettings, getPublishedServices } from "../../../lib/content-db";
import { normalizeCategory } from "../../../lib/normalize";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const photos = await getPublishedWorks();
    const visiblePhotos = photos.length ? photos : FALLBACK_PHOTOS;
    const services = await getPublishedServices();
    const visibleServices = services.length ? services : FALLBACK_SERVICES;

    const photoCats = visiblePhotos.map((photo) => normalizeCategory(photo.category)).filter(Boolean);
    const serviceCats = visibleServices.map((service) => normalizeCategory(service.category)).filter(Boolean);
    const categories = Array.from(new Set([...photoCats, ...serviceCats])).sort((first, second) => first.localeCompare(second));

    return NextResponse.json({ photos: visiblePhotos, categories, services: visibleServices, settings: await getSiteSettings() });
  } catch (error) {
    console.warn("Neon content warning (using fallback dataset):", error);
    const photoCats = FALLBACK_PHOTOS.map((photo) => normalizeCategory(photo.category)).filter(Boolean);
    const serviceCats = FALLBACK_SERVICES.map((service) => normalizeCategory(service.category)).filter(Boolean);
    const categories = Array.from(new Set([...photoCats, ...serviceCats])).sort((first, second) => first.localeCompare(second));
    return NextResponse.json({ photos: FALLBACK_PHOTOS, categories, services: FALLBACK_SERVICES, settings: FALLBACK_SETTINGS });
  }
}

