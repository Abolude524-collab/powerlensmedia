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
    <div className="flex items-center justify-between sm:justify-end gap-3 font-mono text-xs">
      <button
        type="button"
        disabled={busy}
        onClick={togglePublished}
        className="px-3 py-1.5 bg-[#1a1a1a] hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white rounded text-[11px] uppercase tracking-wider transition disabled:opacity-50"
      >
        {busy ? "Saving..." : published ? "Unpublish" : "Publish"}
      </button>

      <Link
        href={`/admin/services/${id}`}
        className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/40 text-amber-400 font-bold rounded text-[11px] uppercase tracking-wider hover:bg-amber-500 hover:text-black transition"
      >
        Edit →
      </Link>

      <button
        type="button"
        disabled={busy}
        onClick={handleDelete}
        className="px-3 py-1.5 bg-rose-950/40 border border-rose-800/60 text-rose-400 hover:bg-rose-900/80 hover:text-white rounded text-[11px] uppercase tracking-wider transition disabled:opacity-50"
      >
        Delete
      </button>
    </div>
  );
}
