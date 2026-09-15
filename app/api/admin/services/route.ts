import { NextResponse } from "next/server";
import { getAdminServices, saveService } from "../../../../lib/content-db";
import { requireOwner } from "../../../../lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireOwner();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const services = await getAdminServices();
    return NextResponse.json({ services });
  } catch (error: any) {
    console.error("Error fetching services:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await requireOwner();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    if (!body.title || !body.subtitle || !body.imageUrl) {
      return NextResponse.json({ error: "Title, subtitle, and image URL are required." }, { status: 400 });
    }

    const newService = await saveService({
      title: body.title,
      subtitle: body.subtitle,
      imageUrl: body.imageUrl,
      category: body.category,
      sortOrder: body.sortOrder ? parseInt(body.sortOrder, 10) : 0,
      published: body.published !== undefined ? Boolean(body.published) : true,
    });

    if (!newService) {
      return NextResponse.json({ error: "Failed to create service." }, { status: 500 });
    }

    return NextResponse.json({ service: newService });
  } catch (error: any) {
    console.error("Error creating service:", error);
    return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
  }
}

