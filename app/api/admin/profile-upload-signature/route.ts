import { NextResponse } from "next/server";
import { z } from "zod";
import { requireOwner } from "../../../../lib/auth";
import { createProfileUploadSignature } from "../../../../lib/cloudinary";

const schema = z.object({ timestamp: z.number().int().positive() });

export async function POST(request: Request) {
  try {
    await requireOwner();
    const parsed = schema.safeParse(await request.json().catch(() => null));
    if (!parsed.success || Math.abs(Math.floor(Date.now() / 1000) - parsed.data.timestamp) > 600) return NextResponse.json({ error: "Invalid or expired upload request." }, { status: 400 });
    return NextResponse.json(createProfileUploadSignature(parsed.data.timestamp));
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    return NextResponse.json({ error: "Cloudinary uploads are not configured." }, { status: 503 });
  }
}