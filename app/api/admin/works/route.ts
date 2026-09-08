import { NextResponse } from "next/server";
import { z } from "zod";
import { requireDb } from "../../../../lib/db";
import { requireOwner } from "../../../../lib/auth";
import { getDeliveryUrl } from "../../../../lib/cloudinary";
import { normalizeCategory } from "../../../../lib/normalize";

const workSchema = z.object({
  title: z.string().trim().min(1).max(160),
  slug: z.string().trim().min(1).max(180).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  altText: z.string().trim().min(1).max(240),
  caption: z.string().trim().max(2000).optional().default(""),
  category: z.string().trim().max(80).optional().default(""),
  orientation: z.enum(["portrait", "landscape", "square"]),
  aspectRatio: z.number().positive().max(10).optional(),
  cameraSpec: z.string().trim().max(240).optional().default(""),
  location: z.string().trim().max(160).optional().default(""),
  hardware: z.string().trim().max(160).optional().default(""),
  cloudinaryPublicId: z.string().trim().min(1).max(500),
  cloudinaryAssetId: z.string().trim().max(200).optional().default(""),
  status: z.enum(["draft", "published"]).default("draft"),
  featured: z.boolean().default(false),
});

export async function POST(request: Request) {
  try {
    const owner = await requireOwner();
    const parsed = workSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) return NextResponse.json({ error: "Check the work fields and try again." }, { status: 400 });
    const db = requireDb();
    const work = parsed.data;
    work.category = normalizeCategory(work.category);
    const galleryFolder = process.env.CLOUDINARY_GALLERY_PREFIX || "power-lens";
    if (!work.cloudinaryPublicId.startsWith(`${galleryFolder}/`)) return NextResponse.json({ error: "Image must be stored in the gallery folder." }, { status: 400 });
    const rows = (await db`
      INSERT INTO works (title, slug, image_url, cloudinary_public_id, cloudinary_asset_id, alt_text, caption, category, orientation, aspect_ratio, camera_spec, location, hardware, featured, status, published_at, created_by)
      VALUES (${work.title}, ${work.slug}, ${getDeliveryUrl(work.cloudinaryPublicId)}, ${work.cloudinaryPublicId}, ${work.cloudinaryAssetId || null}, ${work.altText}, ${work.caption || null}, ${work.category || null}, ${work.orientation}, ${work.aspectRatio || null}, ${work.cameraSpec || null}, ${work.location || null}, ${work.hardware || null}, ${work.featured}, ${work.status}, ${work.status === "published" ? new Date().toISOString() : null}, ${owner.id})
      RETURNING id
    `) as unknown as Array<{ id: string }>;
    return NextResponse.json({ id: (rows[0] as { id: string }).id }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    if (error instanceof Error && error.message === "DATABASE_URL is not configured") return NextResponse.json({ error: "Database is not configured." }, { status: 503 });
    if (String(error).includes("works_slug_unique")) return NextResponse.json({ error: "That slug is already in use." }, { status: 409 });
    console.error("Unable to create work:", error);
    return NextResponse.json({ error: "Unable to save this work." }, { status: 500 });
  }
}