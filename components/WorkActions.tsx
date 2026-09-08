"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function WorkActions({ id, status, featured, hero }: { id: string; status: string; featured: boolean; hero: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  async function update(payload: Record<string, unknown>) { setBusy(true); const response = await fetch(`/api/admin/works/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }); if (!response.ok) window.alert("Unable to update this work."); router.refresh(); setBusy(false); }
  async function archive() { if (!window.confirm("Archive this work?")) return; setBusy(true); const response = await fetch(`/api/admin/works/${id}`, { method: "DELETE" }); if (!response.ok) { window.alert("Unable to archive this work."); setBusy(false); return; } router.push("/admin"); router.refresh(); }
  return <div className="mt-8 flex flex-wrap gap-3 border-t border-neutral-800 pt-6"><button disabled={busy} onClick={() => update({ status: status === "published" ? "draft" : "published" })} className="bg-white px-4 py-3 text-xs font-bold uppercase tracking-widest text-black">{status === "published" ? "Unpublish" : "Publish"}</button><button disabled={busy} onClick={() => update({ featured: !featured })} className="border border-neutral-700 px-4 py-3 text-xs uppercase tracking-widest text-neutral-300">{featured ? "Remove feature" : "Feature work"}</button><button disabled={busy} onClick={() => update({ hero: !hero })} className="border border-neutral-700 px-4 py-3 text-xs uppercase tracking-widest text-neutral-300">{hero ? "Remove hero" : "Use in hero"}</button><button disabled={busy} onClick={archive} className="border border-red-900 px-4 py-3 text-xs uppercase tracking-widest text-red-300">Archive</button></div>;
}