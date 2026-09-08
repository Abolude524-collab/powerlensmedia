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
    <div className="flex items-center justify-end gap-4">
      <button
        type="button"
        disabled={busy}
        onClick={togglePublished}
        className="text-xs uppercase tracking-widest text-neutral-300 transition hover:text-white disabled:cursor-wait disabled:opacity-50"
      >
        {busy ? "Saving" : status === "published" ? "Unpublish" : "Publish"}
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
        className={`text-xs uppercase tracking-widest transition disabled:cursor-wait disabled:opacity-50 ${hero ? "text-white" : "text-neutral-500 hover:text-neutral-300"}`}
      >
        {hero ? "Hero on" : "Hero"}
      </button>
      <Link href={`/admin/works/${id}`} className="text-xs uppercase tracking-widest text-white underline underline-offset-4">
        Edit
      </Link>
    </div>
  );
}