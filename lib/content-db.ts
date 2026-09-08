import { PhotoItem, SiteSettings } from "./content-types";
import { FALLBACK_SETTINGS } from "./content-fallback";
import { getDb } from "./db";

export type WorkStatus = "draft" | "published" | "archived";

export interface WorkRecord extends PhotoItem {
  status: WorkStatus;
  sortOrder: number;
  hero: boolean;
  heroOrder: number;
  cloudinaryPublicId: string;
  cloudinaryAssetId?: string;
  createdAt: string;
  updatedAt: string;
}

function toWork(row: Record<string, unknown>): WorkRecord {
  return {
    _id: String(row.id),
    title: String(row.title),
    slug: String(row.slug),
    imageUrl: String(row.image_url),
    altText: String(row.alt_text),
    caption: row.caption ? String(row.caption) : undefined,
    featured: Boolean(row.featured),
    hero: Boolean(row.hero),
    heroOrder: Number(row.hero_order),
    orientation: row.orientation as PhotoItem["orientation"],
    category: row.category ? String(row.category) : undefined,
    aspectRatio: row.aspect_ratio ? Number(row.aspect_ratio) : undefined,
    cameraSpec: row.camera_spec ? String(row.camera_spec) : undefined,
    location: row.location ? String(row.location) : undefined,
    hardware: row.hardware ? String(row.hardware) : undefined,
    status: row.status as WorkStatus,
    sortOrder: Number(row.sort_order),
    cloudinaryPublicId: String(row.cloudinary_public_id),
    cloudinaryAssetId: row.cloudinary_asset_id ? String(row.cloudinary_asset_id) : undefined,
    createdAt: new Date(String(row.created_at)).toISOString(),
    updatedAt: new Date(String(row.updated_at)).toISOString(),
  };
}

export async function getPublishedWorks(): Promise<WorkRecord[]> {
  const db = getDb();
  if (!db) return [];
  const rows = (await db`
    SELECT * FROM works
    WHERE status = 'published'
    ORDER BY featured DESC, sort_order ASC, published_at DESC NULLS LAST, created_at DESC
  `) as unknown as Array<Record<string, unknown>>;
  return rows.map((row) => toWork(row));
}

export async function getAdminWorks(): Promise<WorkRecord[]> {
  const db = getDb();
  if (!db) return [];
  const rows = (await db`
    SELECT * FROM works
    ORDER BY CASE status WHEN 'published' THEN 1 WHEN 'draft' THEN 2 ELSE 3 END,
      sort_order ASC, created_at DESC
  `) as unknown as Array<Record<string, unknown>>;
  return rows.map((row) => toWork(row));
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const db = getDb();
  if (!db) return FALLBACK_SETTINGS;
  const rows = (await db`SELECT * FROM site_settings WHERE id = 1 LIMIT 1`) as unknown as Array<Record<string, unknown>>;
  const row = rows[0];
  if (!row) return FALLBACK_SETTINGS;
  return {
    brandName: String(row.brand_name),
    alias: String(row.alias),
    photographerName: String(row.photographer_name),
    bio: String(row.bio),
    contactEmail: String(row.contact_email),
    profilePictureUrl: row.profile_picture_url ? String(row.profile_picture_url) : undefined,
    heroPhotoUrl: row.hero_photo_url ? String(row.hero_photo_url) : undefined,
    socialLinks: Array.isArray(row.social_links) ? row.social_links as SiteSettings["socialLinks"] : FALLBACK_SETTINGS.socialLinks,
  };
}

export interface AnalyticsSummary {
  total: number;
  galleryOpens: number;
  contactClicks: number;
  whatsappClicks: number;
  socialClicks: number;
}

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  const db = getDb();
  if (!db) return { total: 0, galleryOpens: 0, contactClicks: 0, whatsappClicks: 0, socialClicks: 0 };
  const rows = (await db`SELECT event_name, COUNT(*)::int AS count FROM analytics_events WHERE created_at >= NOW() - INTERVAL '30 days' GROUP BY event_name`) as unknown as Array<{ event_name: string; count: number }>;
  const counts = new Map(rows.map((row) => [row.event_name, row.count]));
  return {
    total: rows.reduce((sum, row) => sum + row.count, 0),
    galleryOpens: counts.get("gallery_open") || 0,
    contactClicks: counts.get("contact_click") || 0,
    whatsappClicks: counts.get("whatsapp_click") || 0,
    socialClicks: counts.get("social_click") || 0,
  };
}
