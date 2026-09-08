"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import WorkActions from "./WorkActions";
import type { WorkRecord } from "../lib/content-db";

export default function EditWorkForm({ work }: { work: WorkRecord }) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: work.title,
    slug: work.slug || "",
    altText: work.altText,
    caption: work.caption || "",
    category: work.category || "",
    orientation: work.orientation,
    aspectRatio: work.aspectRatio ? String(work.aspectRatio) : "",
    heroOrder: String(work.heroOrder || 0),
    cameraSpec: work.cameraSpec || "",
    location: work.location || "",
    hardware: work.hardware || "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function update(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    const response = await fetch(`/api/admin/works/${work._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, aspectRatio: form.aspectRatio ? Number(form.aspectRatio) : null, heroOrder: Number(form.heroOrder) || 0 }),
    });
    if (!response.ok) {
      setError((await response.json()).error || "Unable to save changes.");
      setSaving(false);
      return;
    }
    router.refresh();
    setSaving(false);
  }

  return <form onSubmit={submit} className="space-y-6">
    <div className="grid gap-5 sm:grid-cols-2">
      <Field label="Title" value={form.title} onChange={(value) => update("title", value)} />
      <Field label="Slug" value={form.slug} onChange={(value) => update("slug", value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""))} />
      <Field label="Alt text" value={form.altText} onChange={(value) => update("altText", value)} />
      <Field label="Category" value={form.category} onChange={(value) => update("category", value)} />
      <Field label="Location" value={form.location} onChange={(value) => update("location", value)} />
      <Field label="Hardware" value={form.hardware} onChange={(value) => update("hardware", value)} />
      <Field label="Camera details" value={form.cameraSpec} onChange={(value) => update("cameraSpec", value)} />
      <Field label="Aspect ratio" value={form.aspectRatio} onChange={(value) => update("aspectRatio", value)} type="number" step="0.01" />
      <Field label="Hero order" value={form.heroOrder} onChange={(value) => update("heroOrder", value)} type="number" step="1" />
      <label className="text-xs uppercase tracking-widest text-neutral-400">Orientation<select value={form.orientation} onChange={(event) => update("orientation", event.target.value)} className="mt-2 w-full border border-neutral-700 bg-black px-3 py-3 text-sm text-white"><option value="portrait">Portrait</option><option value="landscape">Landscape</option><option value="square">Square</option></select></label>
      <label className="text-xs uppercase tracking-widest text-neutral-400 sm:col-span-2">Caption<textarea value={form.caption} onChange={(event) => update("caption", event.target.value)} rows={4} className="mt-2 w-full border border-neutral-700 bg-black px-3 py-3 text-sm text-white" /></label>
    </div>
    {error && <p className="text-sm text-red-300" role="alert">{error}</p>}
    <button disabled={saving} className="bg-white px-4 py-3 text-xs font-bold uppercase tracking-widest text-black disabled:opacity-50">{saving ? "Saving..." : "Save metadata"}</button>
    <WorkActions id={work._id} status={work.status} featured={Boolean(work.featured)} hero={Boolean(work.hero)} />
  </form>;
}

function Field({ label, value, onChange, type = "text", step }: { label: string; value: string; onChange: (value: string) => void; type?: string; step?: string }) {
  return <label className="text-xs uppercase tracking-widest text-neutral-400">{label}<input type={type} step={step} value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full border border-neutral-700 bg-black px-3 py-3 text-sm text-white outline-none focus:border-white" /></label>;
}