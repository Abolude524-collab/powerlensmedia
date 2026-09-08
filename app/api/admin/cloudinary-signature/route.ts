import { NextResponse } from "next/server";
import { z } from "zod";
import { requireOwner } from "../../../../lib/auth";
import { createGalleryUploadSignature } from "../../../../lib/cloudinary";

const requestSchema = z.object({ timestamp: z.number().int().positive() });

export async function POST(request: Request) {
  try {
    await requireOwner();
    const parsed = requestSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) return NextResponse.json({ error: "Invalid upload request." }, { status: 400 });
    if (Math.abs(Math.floor(Date.now() / 1000) - parsed.data.timestamp) > 600) return NextResponse.json({ error: "Upload signature expired." }, { status: 400 });
    return NextResponse.json(createGalleryUploadSignature(parsed.data.timestamp));
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    return NextResponse.json({ error: "Cloudinary uploads are not configured." }, { status: 503 });
  }
}