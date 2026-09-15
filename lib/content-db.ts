import { PhotoItem, SiteSettings, ServiceItem } from "./content-types";
import { FALLBACK_SETTINGS, FALLBACK_SERVICES } from "./content-fallback";
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

export interface InquiryRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: "unread" | "read" | "archived";
  createdAt: string;
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

// INQUIRIES & MESSAGES SYSTEM
async function ensureInquiriesTable() {
  const db = getDb();
  if (!db) return null;
  await db`
    CREATE TABLE IF NOT EXISTS inquiries (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'unread',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
    );
  `;
  return db;
}

export async function saveInquiry(data: {
  name: string;
  email: string;
  phone: string;
  message: string;
}): Promise<InquiryRecord | null> {
  const db = await ensureInquiriesTable();
  if (!db) return null;
  const rows = (await db`
    INSERT INTO inquiries (name, email, phone, message)
    VALUES (${data.name}, ${data.email}, ${data.phone}, ${data.message})
    RETURNING *
  `) as unknown as Array<Record<string, unknown>>;
  const row = rows[0];
  if (!row) return null;
  return {
    id: String(row.id),
    name: String(row.name),
    email: String(row.email),
    phone: String(row.phone),
    message: String(row.message),
    status: (row.status as InquiryRecord["status"]) || "unread",
    createdAt: new Date(String(row.created_at)).toISOString(),
  };
}

export async function getAdminInquiries(): Promise<InquiryRecord[]> {
  const db = await ensureInquiriesTable();
  if (!db) return [];
  const rows = (await db`
    SELECT * FROM inquiries
    ORDER BY created_at DESC
  `) as unknown as Array<Record<string, unknown>>;
  return rows.map((row) => ({
    id: String(row.id),
    name: String(row.name),
    email: String(row.email),
    phone: String(row.phone),
    message: String(row.message),
    status: (row.status as InquiryRecord["status"]) || "unread",
    createdAt: new Date(String(row.created_at)).toISOString(),
  }));
}

export async function updateInquiryStatus(
  id: string,
  status: "unread" | "read" | "archived"
): Promise<boolean> {
  const db = await ensureInquiriesTable();
  if (!db) return false;
  await db`
    UPDATE inquiries
    SET status = ${status}
    WHERE id = ${id}
  `;
  return true;
}

export async function deleteInquiry(id: string): Promise<boolean> {
  const db = await ensureInquiriesTable();
  if (!db) return false;
  await db`
    DELETE FROM inquiries
    WHERE id = ${id}
  `;
  return true;
}

// SERVICES SYSTEM
export interface ServiceRecord extends ServiceItem {
  sortOrder: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

async function ensureServicesTable() {
  const db = getDb();
  if (!db) return null;
  await db`
    CREATE TABLE IF NOT EXISTS services (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      subtitle TEXT NOT NULL,
      image_url TEXT NOT NULL,
      category TEXT,
      sort_order INT NOT NULL DEFAULT 0,
      published BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
    );
  `;

  try {
    const countRes = (await db`SELECT COUNT(*)::int AS count FROM services`) as unknown as Array<{ count: number }>;
    if (countRes[0] && Number(countRes[0].count) === 0) {
      for (const s of FALLBACK_SERVICES) {
        const slug = s.slug || s.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
        await db`
          INSERT INTO services (title, slug, subtitle, image_url, category, sort_order, published)
          VALUES (${s.title}, ${slug}, ${s.subtitle}, ${s.imageUrl}, ${s.category || null}, ${s.sortOrder || 0}, true)
          ON CONFLICT (slug) DO NOTHING;
        `;
      }
    } else {
      // Fix broken image URL if seeded previously
      await db`
        UPDATE services
        SET image_url = 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1200'
        WHERE slug = 'convocation-shoots' AND image_url LIKE '%1523050854058%';
      `;
    }
  } catch (err) {
    console.warn("Unable to auto-seed fallback services into Neon DB:", err);
  }

  return db;
}

function toService(row: Record<string, unknown>): ServiceRecord {
  return {
    _id: String(row.id),
    title: String(row.title),
    slug: String(row.slug),
    subtitle: String(row.subtitle),
    imageUrl: String(row.image_url),
    category: row.category ? String(row.category) : undefined,
    sortOrder: Number(row.sort_order),
    published: Boolean(row.published),
    createdAt: new Date(String(row.created_at)).toISOString(),
    updatedAt: new Date(String(row.updated_at)).toISOString(),
  };
}

export async function getPublishedServices(): Promise<ServiceRecord[]> {
  const db = await ensureServicesTable();
  if (!db) return FALLBACK_SERVICES.map((s) => ({ ...s, sortOrder: s.sortOrder || 0, published: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }));
  const rows = (await db`
    SELECT * FROM services
    WHERE published = true
    ORDER BY sort_order ASC, created_at DESC
  `) as unknown as Array<Record<string, unknown>>;
  if (!rows || rows.length === 0) {
    return FALLBACK_SERVICES.map((s) => ({ ...s, sortOrder: s.sortOrder || 0, published: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }));
  }
  return rows.map((row) => toService(row));
}

export async function getAdminServices(): Promise<ServiceRecord[]> {
  const db = await ensureServicesTable();
  if (!db) return FALLBACK_SERVICES.map((s) => ({ ...s, sortOrder: s.sortOrder || 0, published: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }));
  const rows = (await db`
    SELECT * FROM services
    ORDER BY sort_order ASC, created_at DESC
  `) as unknown as Array<Record<string, unknown>>;
  if (!rows || rows.length === 0) {
    return FALLBACK_SERVICES.map((s) => ({ ...s, sortOrder: s.sortOrder || 0, published: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }));
  }
  return rows.map((row) => toService(row));
}

export async function saveService(data: {
  title: string;
  subtitle: string;
  imageUrl: string;
  category?: string;
  sortOrder?: number;
  published?: boolean;
}): Promise<ServiceRecord | null> {
  const db = await ensureServicesTable();
  if (!db) return null;
  const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") || "service-" + Date.now();
  const rows = (await db`
    INSERT INTO services (title, slug, subtitle, image_url, category, sort_order, published)
    VALUES (${data.title}, ${slug}, ${data.subtitle}, ${data.imageUrl}, ${data.category || null}, ${data.sortOrder ?? 0}, ${data.published ?? true})
    RETURNING *
  `) as unknown as Array<Record<string, unknown>>;
  const row = rows[0];
  if (!row) return null;
  return toService(row);
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function updateService(
  id: string,
  data: {
    title?: string;
    subtitle?: string;
    imageUrl?: string;
    category?: string;
    sortOrder?: number;
    published?: boolean;
  }
): Promise<ServiceRecord | null> {
  const db = await ensureServicesTable();
  if (!db) return null;
  
  let current: Record<string, unknown> | undefined;

  if (UUID_REGEX.test(id)) {
    const currentRows = (await db`SELECT * FROM services WHERE id = ${id} LIMIT 1`) as unknown as Array<Record<string, unknown>>;
    current = currentRows[0];
  } else {
    // Legacy/fallback ID like "service-1" -> look up matching item from FALLBACK_SERVICES
    const fallbackItem = FALLBACK_SERVICES.find((s) => s._id === id);
    if (fallbackItem) {
      const slug = fallbackItem.slug || fallbackItem.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
      const rows = (await db`SELECT * FROM services WHERE slug = ${slug} LIMIT 1`) as unknown as Array<Record<string, unknown>>;
      current = rows[0];
      if (!current) {
        // Create service row for fallback item
        const newRows = (await db`
          INSERT INTO services (title, slug, subtitle, image_url, category, sort_order, published)
          VALUES (${fallbackItem.title}, ${slug}, ${fallbackItem.subtitle}, ${fallbackItem.imageUrl}, ${fallbackItem.category || null}, ${fallbackItem.sortOrder || 0}, ${data.published ?? true})
          RETURNING *
        `) as unknown as Array<Record<string, unknown>>;
        current = newRows[0];
      }
    }
  }

  if (!current) return null;

  const targetId = String(current.id);
  const title = data.title ?? String(current.title);
  const subtitle = data.subtitle ?? String(current.subtitle);
  const imageUrl = data.imageUrl ?? String(current.image_url);
  const category = data.category !== undefined ? data.category : (current.category ? String(current.category) : null);
  const sortOrder = data.sortOrder ?? Number(current.sort_order);
  const published = data.published ?? Boolean(current.published);
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") || String(current.slug);

  const rows = (await db`
    UPDATE services
    SET title = ${title},
        slug = ${slug},
        subtitle = ${subtitle},
        image_url = ${imageUrl},
        category = ${category},
        sort_order = ${sortOrder},
        published = ${published},
        updated_at = NOW()
    WHERE id = ${targetId}
    RETURNING *
  `) as unknown as Array<Record<string, unknown>>;
  const row = rows[0];
  if (!row) return null;
  return toService(row);
}

export async function deleteService(id: string): Promise<boolean> {
  const db = await ensureServicesTable();
  if (!db) return false;
  if (UUID_REGEX.test(id)) {
    await db`DELETE FROM services WHERE id = ${id}`;
  } else {
    const fallbackItem = FALLBACK_SERVICES.find((s) => s._id === id);
    if (fallbackItem) {
      const slug = fallbackItem.slug || fallbackItem.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
      await db`DELETE FROM services WHERE slug = ${slug}`;
    }
  }
  return true;
}
