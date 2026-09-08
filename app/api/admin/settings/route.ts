import { NextResponse } from "next/server";
import { z } from "zod";
import { requireOwner } from "../../../../lib/auth";
import { requireDb } from "../../../../lib/db";
import { revalidatePath } from "next/cache";

const settingsSchema = z.object({
  brandName: z.string().trim().min(1).max(100),
  alias: z.string().trim().min(1).max(100),
  photographerName: z.string().trim().min(1).max(160),
  bio: z.string().trim().max(4000),
  contactEmail: z.string().trim().email().max(254),
  profilePictureUrl: z.string().url().optional().or(z.literal("")),
  heroPhotoUrl: z.string().url().optional().or(z.literal("")),
  socialLinks: z.array(z.object({ platform: z.string().trim().min(1).max(50), handle: z.string().trim().max(160), url: z.string().url() })).max(20),
});

export async function PUT(request: Request) {
  try {
    await requireOwner();
    const parsed = settingsSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) return NextResponse.json({ error: "Check the profile fields." }, { status: 400 });
    const settings = parsed.data;
    await requireDb()`INSERT INTO site_settings (id, brand_name, alias, photographer_name, bio, contact_email, profile_picture_url, hero_photo_url, social_links, updated_at) VALUES (1, ${settings.brandName}, ${settings.alias}, ${settings.photographerName}, ${settings.bio}, ${settings.contactEmail}, ${settings.profilePictureUrl || null}, ${settings.heroPhotoUrl || null}, ${JSON.stringify(settings.socialLinks)}, NOW()) ON CONFLICT (id) DO UPDATE SET brand_name = EXCLUDED.brand_name, alias = EXCLUDED.alias, photographer_name = EXCLUDED.photographer_name, bio = EXCLUDED.bio, contact_email = EXCLUDED.contact_email, profile_picture_url = EXCLUDED.profile_picture_url, hero_photo_url = EXCLUDED.hero_photo_url, social_links = EXCLUDED.social_links, updated_at = NOW()`;
    revalidatePath("/");
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    return NextResponse.json({ error: "Unable to save settings." }, { status: 500 });
  }
}