"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminWorkRowActions({ id, status, hero }: { id: string; status: string; hero: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function togglePublished() {
    setBusy(true);
    const response = await fetch(`/api/admin/works/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: status === "published" ? "draft" : "published" }),
    });
    if (!response.ok) window.alert("Unable to update this work.");
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
        {busy ? "Saving..." : status === "published" ? "Unpublish" : "Publish"}
      </button>
      
      <button
        type="button"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          const response = await fetch(`/api/admin/works/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ hero: !hero }) });
          if (!response.ok) window.alert("Unable to update this work.");
          router.refresh();
          setBusy(false);
        }}
        className={`px-3 py-1.5 rounded border text-[11px] uppercase tracking-wider transition disabled:opacity-50 ${
          hero
            ? "bg-amber-500 text-black font-bold border-amber-400"
            : "bg-[#1a1a1a] border-neutral-800 text-neutral-400 hover:text-neutral-200"
        }`}
      >
        {hero ? "★ Hero On" : "Set Hero"}
      </button>

      <Link
        href={`/admin/works/${id}`}
        className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/40 text-amber-400 font-bold rounded text-[11px] uppercase tracking-wider hover:bg-amber-500 hover:text-black transition"
      >
        Edit →
      </Link>
    </div>
  );
}