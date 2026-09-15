import { NextResponse } from "next/server";
import { requireOwner } from "../../../../lib/auth";
import { getAdminInquiries, updateInquiryStatus, deleteInquiry } from "../../../../lib/content-db";

export async function GET() {
  try {
    await requireOwner();
    const inquiries = await getAdminInquiries();
    return NextResponse.json({ inquiries });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unauthorized";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}

export async function PATCH(request: Request) {
  try {
    await requireOwner();
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "Missing id or status" }, { status: 400 });
    }

    const success = await updateInquiryStatus(id, status);
    return NextResponse.json({ success });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unauthorized";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}

export async function DELETE(request: Request) {
  try {
    await requireOwner();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing inquiry id" }, { status: 400 });
    }

    const success = await deleteInquiry(id);
    return NextResponse.json({ success });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unauthorized";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
