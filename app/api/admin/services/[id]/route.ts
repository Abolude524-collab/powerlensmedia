import { NextResponse } from "next/server";
import { updateService, deleteService } from "../../../../../lib/content-db";
import { requireOwner } from "../../../../../lib/auth";

export const dynamic = "force-dynamic";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireOwner();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    const updated = await updateService(id, {
      title: body.title,
      subtitle: body.subtitle,
      imageUrl: body.imageUrl,
      category: body.category,
      sortOrder: body.sortOrder !== undefined ? parseInt(body.sortOrder, 10) : undefined,
      published: body.published !== undefined ? Boolean(body.published) : undefined,
    });

    if (!updated) {
      return NextResponse.json({ error: "Service not found or update failed." }, { status: 404 });
    }

    return NextResponse.json({ service: updated });
  } catch (error: any) {
    console.error("Error updating service:", error);
    return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireOwner();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const success = await deleteService(id);
    if (!success) {
      return NextResponse.json({ error: "Service not found or delete failed." }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting service:", error);
    return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
  }
}

