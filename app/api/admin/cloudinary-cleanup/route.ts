import { NextResponse } from "next/server";
import { z } from "zod";
import { requireOwner } from "../../../../lib/auth";
import { deleteGalleryAsset } from "../../../../lib/cloudinary-admin";

const schema = z.object({ publicId: z.string().trim().min(1).max(500) });

export async function POST(request: Request) {
  try {
    await requireOwner();
    const parsed = schema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) return NextResponse.json({ error: "Invalid cleanup request." }, { status: 400 });
    const folder = process.env.CLOUDINARY_GALLERY_PREFIX || "power-lens";
    if (!parsed.data.publicId.startsWith(`${folder}/`)) return NextResponse.json({ error: "Invalid gallery asset." }, { status: 400 });
    await deleteGalleryAsset(parsed.data.publicId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    return NextResponse.json({ error: "Unable to clean up upload." }, { status: 500 });
  }
}