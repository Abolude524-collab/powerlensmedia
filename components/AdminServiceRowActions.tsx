"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminServiceRowActions({ id, published }: { id: string; published: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function togglePublished() {
    setBusy(true);
    const response = await fetch(`/api/admin/services/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !published }),
    });
    if (!response.ok) window.alert("Unable to update service status.");
    router.refresh();
    setBusy(false);
  }

  async function handleDelete() {
    if (!window.confirm("Are you sure you want to delete this photography service?")) return;
    setBusy(true);
    const response = await fetch(`/api/admin/services/${id}`, { method: "DELETE" });
    if (!response.ok) window.alert("Unable to delete service.");
    router.refresh();
    setBusy(false);
  }

  return (
    <div className="flex items-center justify-end gap-4">
      <button
        type="button"
        disabled={busy}
        onClick={togglePublished}
        className="text-xs uppercase tracking-widest text-neutral-300 transition hover:text-white disabled:cursor-wait disabled:opacity-50"
      >
        {busy ? "Saving" : published ? "Unpublish" : "Publish"}
      </button>
      <Link href={`/admin/services/${id}`} className="text-xs uppercase tracking-widest text-amber-400 underline underline-offset-4 hover:text-amber-300">
        Edit
      </Link>
      <button
        type="button"
        disabled={busy}
        onClick={handleDelete}
        className="text-xs uppercase tracking-widest text-rose-500 hover:text-rose-300 transition disabled:opacity-50"
      >
        Delete
      </button>
    </div>
  );
}
