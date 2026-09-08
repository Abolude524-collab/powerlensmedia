import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireOwner } from "../../../../../lib/auth";
import { requireDb } from "../../../../../lib/db";
import { normalizeCategory } from "../../../../../lib/normalize";

const updateSchema = z.object({
  title: z.string().trim().min(1).max(160).optional(),
  slug: z.string().trim().min(1).max(180).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  altText: z.string().trim().min(1).max(240).optional(),
  caption: z.string().trim().max(2000).nullable().optional(),
  category: z.string().trim().max(80).nullable().optional(),
  orientation: z.enum(["portrait", "landscape", "square"]).optional(),
  aspectRatio: z.number().positive().max(10).nullable().optional(),
  cameraSpec: z.string().trim().max(240).nullable().optional(),
  location: z.string().trim().max(160).nullable().optional(),
  hardware: z.string().trim().max(160).nullable().optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
  featured: z.boolean().optional(),
  hero: z.boolean().optional(),
  heroOrder: z.number().int().min(0).max(100000).optional(),
  sortOrder: z.number().int().min(0).max(100000).optional(),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireOwner();
    const { id } = await params;
    const parsed = updateSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) return NextResponse.json({ error: "Invalid work update." }, { status: 400 });
    const db = requireDb();
    const { title, slug, altText, caption, orientation, aspectRatio, cameraSpec, location, hardware, status, featured, hero, heroOrder, sortOrder } = parsed.data;
    const category = parsed.data.category === undefined ? undefined : normalizeCategory(parsed.data.category);
    await db`UPDATE works SET title = COALESCE(${title ?? null}, title), slug = COALESCE(${slug ?? null}, slug), alt_text = COALESCE(${altText ?? null}, alt_text), caption = CASE WHEN ${caption === undefined ? null : caption}::text IS NULL THEN caption ELSE ${caption ?? null} END, category = CASE WHEN ${category === undefined ? null : category}::text IS NULL THEN category ELSE ${category ?? null} END, orientation = COALESCE(${orientation ?? null}, orientation), aspect_ratio = CASE WHEN ${aspectRatio === undefined ? null : aspectRatio}::numeric IS NULL THEN aspect_ratio ELSE ${aspectRatio ?? null} END, camera_spec = CASE WHEN ${cameraSpec === undefined ? null : cameraSpec}::text IS NULL THEN camera_spec ELSE ${cameraSpec ?? null} END, location = CASE WHEN ${location === undefined ? null : location}::text IS NULL THEN location ELSE ${location ?? null} END, hardware = CASE WHEN ${hardware === undefined ? null : hardware}::text IS NULL THEN hardware ELSE ${hardware ?? null} END, status = COALESCE(${status || null}, status), featured = COALESCE(${featured ?? null}, featured), hero = COALESCE(${hero ?? null}, hero), hero_order = COALESCE(${heroOrder ?? null}, hero_order), sort_order = COALESCE(${sortOrder ?? null}, sort_order), published_at = CASE WHEN ${status || null} = 'published' THEN COALESCE(published_at, NOW()) WHEN ${status || null} = 'draft' THEN NULL ELSE published_at END, updated_at = NOW() WHERE id = ${id}`;
    revalidatePath("/");
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    return NextResponse.json({ error: "Unable to update work." }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireOwner();
    const { id } = await params;
    await requireDb()`UPDATE works SET status = 'archived', updated_at = NOW() WHERE id = ${id}`;
    revalidatePath("/");
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    return NextResponse.json({ error: "Unable to archive work." }, { status: 500 });
  }
}