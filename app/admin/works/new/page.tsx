"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminNav from "../../../../components/AdminNav";

type FormState = {
  title: string;
  slug: string;
  altText: string;
  caption: string;
  category: string;
  orientation: string;
  aspectRatio: string;
  cameraSpec: string;
  location: string;
  hardware: string;
  status: string;
  featured: boolean;
};

type UploadedImage = { public_id: string; asset_id: string; width: number; height: number };
const MAX_FILES = 50;
const MAX_FILE_SIZE = 25 * 1024 * 1024;

const initialState: FormState = {
  title: "",
  slug: "",
  altText: "",
  caption: "",
  category: "",
  orientation: "portrait",
  aspectRatio: "",
  cameraSpec: "",
  location: "",
  hardware: "",
  status: "draft",
  featured: false,
};

export default function NewWorkPage() {
  const router = useRouter();
  const [form, setForm] = useState(initialState);
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((response) => response.ok ? response.json() : { categories: [] })
      .then((data: { categories?: string[] }) => setCategories(data.categories || []))
      .catch(() => setCategories([]));
  }, []);

  function update(field: keyof FormState, value: string | boolean) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function makeSlug(value: string) {
    return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  function fileTitle(file: File) {
    return file.name.replace(/\.[^/.]+$/, "").replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim() || "Untitled frame";
  }

  async function uploadImage(file: File) {
    const timestamp = Math.floor(Date.now() / 1000);
    const signatureResponse = await fetch("/api/admin/cloudinary-signature", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ timestamp }),
    });
    if (!signatureResponse.ok) throw new Error((await signatureResponse.json()).error || "Unable to prepare upload.");
    const signature = await signatureResponse.json();
    const body = new FormData();
    body.append("file", file);
    body.append("api_key", signature.apiKey);
    body.append("timestamp", String(timestamp));
    body.append("signature", signature.signature);
    body.append("folder", signature.folder);
    body.append("tags", signature.tags);
    const uploadResponse = await fetch(`https://api.cloudinary.com/v1_1/${signature.cloudName}/image/upload`, { method: "POST", body });
    if (!uploadResponse.ok) throw new Error(`Cloudinary rejected ${file.name}.`);
    return uploadResponse.json() as Promise<UploadedImage>;
  }

  async function createWork(file: File, uploaded: UploadedImage, index: number) {
    const title = files.length > 1 ? fileTitle(file) : form.title;
    const slugBase = files.length > 1 ? makeSlug(title) : form.slug;
    const slug = files.length > 1 ? `${slugBase || "frame"}-${index + 1}` : slugBase;
    const altText = form.altText || `${title} - ${form.category} photograph`;
    const response = await fetch("/api/admin/works", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        title,
        slug,
        altText,
        aspectRatio: form.aspectRatio ? Number(form.aspectRatio) : uploaded.height ? uploaded.width / uploaded.height : undefined,
        cloudinaryPublicId: uploaded.public_id,
        cloudinaryAssetId: uploaded.asset_id,
      }),
    });
    if (!response.ok) throw new Error((await response.json()).error || `Unable to save ${file.name}.`);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!files.length) {
      setError("Choose at least one image first.");
      return;
    }
    const oversizedFile = files.find((file) => file.size > MAX_FILE_SIZE);
    if (oversizedFile) {
      setError(`${oversizedFile.name} is larger than 25 MB.`);
      return;
    }
    if (files.length > 1 && !form.category.trim()) {
      setError("Choose one category for the bulk upload.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      for (const [index, file] of files.entries()) {
        setProgress(`Uploading ${index + 1} of ${files.length}: ${file.name}`);
        const uploaded = await uploadImage(file);
        try {
          await createWork(file, uploaded, index);
        } catch (createError) {
          await fetch("/api/admin/cloudinary-cleanup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ publicId: uploaded.public_id }) });
          throw createError;
        }
      }
      router.push("/admin");
      router.refresh();
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Unable to save the works.");
      setBusy(false);
      setProgress("");
    }
  }

  const bulk = files.length > 1;

  return (
    <main className="min-h-screen bg-[#0e0e0e] px-5 py-8 text-[#e5e2e1] sm:px-8">
      <div className="mx-auto max-w-4xl">
        <AdminNav />
        <header className="mb-8 border-b border-neutral-800 pb-6">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-500">Power Lens / New archive entry</p>
          <h1 className="text-4xl font-extrabold uppercase tracking-tight text-white">Add works</h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-neutral-400">Upload one frame or a batch. A batch shares the selected category and common metadata; titles are taken from each filename.</p>
        </header>

        <form onSubmit={submit} className="space-y-8">
          <section className="grid gap-5 border border-neutral-800 bg-[#151515] p-5 sm:grid-cols-2">
            <Field label="Title (single upload)" value={form.title} onChange={(value) => { update("title", value); if (!form.slug) update("slug", makeSlug(value)); }} required={!bulk} />
            <Field label="Slug (single upload)" value={form.slug} onChange={(value) => update("slug", makeSlug(value))} required={!bulk} />
            <Field label="Alt text (shared fallback)" value={form.altText} onChange={(value) => update("altText", value)} />
            <label className="text-xs uppercase tracking-widest text-neutral-400">Category (shared)
              <input required value={form.category} onChange={(event) => update("category", event.target.value)} list="work-categories" placeholder="Type or choose a category" className="mt-2 w-full border border-neutral-700 bg-black px-3 py-3 text-sm text-white outline-none placeholder:text-neutral-600 focus:border-white" />
              <datalist id="work-categories">{categories.map((category) => <option key={category} value={category} />)}</datalist>
              <span className="mt-2 block normal-case tracking-normal text-neutral-500">Choose an existing category or type a new one.</span>
            </label>
            <Field label="Location (shared)" value={form.location} onChange={(value) => update("location", value)} />
            <Field label="Hardware (shared)" value={form.hardware} onChange={(value) => update("hardware", value)} />
            <Field label="Camera details (shared)" value={form.cameraSpec} onChange={(value) => update("cameraSpec", value)} />
            <Field label="Aspect ratio" value={form.aspectRatio} onChange={(value) => update("aspectRatio", value)} type="number" step="0.01" />
            <label className="text-xs uppercase tracking-widest text-neutral-400">Orientation<select value={form.orientation} onChange={(event) => update("orientation", event.target.value)} className="mt-2 w-full border border-neutral-700 bg-black px-3 py-3 text-sm text-white"><option value="portrait">Portrait</option><option value="landscape">Landscape</option><option value="square">Square</option></select></label>
            <label className="text-xs uppercase tracking-widest text-neutral-400">Images<input required type="file" multiple accept="image/jpeg,image/png,image/webp,image/avif" onChange={(event) => { const selected = Array.from(event.target.files || []); setFiles(selected.slice(0, MAX_FILES)); setError(selected.length > MAX_FILES ? `Select no more than ${MAX_FILES} images.` : ""); }} className="mt-2 block w-full text-sm text-neutral-300 file:mr-4 file:border-0 file:bg-white file:px-3 file:py-2 file:text-xs file:font-bold file:uppercase file:text-black" /><span className="mt-2 block normal-case tracking-normal text-neutral-500">{files.length ? `${files.length} image${files.length === 1 ? "" : "s"} selected` : "Select up to 50 images, maximum 25 MB each."}</span></label>
            <label className="sm:col-span-2 text-xs uppercase tracking-widest text-neutral-400">Caption (shared)<textarea value={form.caption} onChange={(event) => update("caption", event.target.value)} rows={4} className="mt-2 w-full border border-neutral-700 bg-black px-3 py-3 text-sm text-white" /></label>
          </section>

          <section className="flex flex-wrap items-center gap-5 border border-neutral-800 bg-[#151515] p-5">
            <label className="flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-300"><input type="checkbox" checked={form.featured} onChange={(event) => update("featured", event.target.checked)} /> Featured work</label>
            <label className="text-xs uppercase tracking-widest text-neutral-400">Save as<select value={form.status} onChange={(event) => update("status", event.target.value)} className="ml-3 border border-neutral-700 bg-black px-3 py-2 text-xs text-white"><option value="draft">Draft</option><option value="published">Published</option></select></label>
            {bulk && <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-400">One category applied to all {files.length} works</span>}
          </section>

          {progress && <p className="font-mono text-xs text-neutral-400" role="status">{progress}</p>}
          {error && <p className="text-sm text-red-300" role="alert">{error}</p>}
          <div className="flex gap-3"><button disabled={busy} className="bg-white px-5 py-3 text-xs font-bold uppercase tracking-widest text-black disabled:opacity-60">{busy ? "Uploading..." : bulk ? `Upload ${files.length} works` : "Save work"}</button><button type="button" onClick={() => router.back()} className="border border-neutral-700 px-5 py-3 text-xs uppercase tracking-widest text-neutral-300">Cancel</button></div>
        </form>
      </div>
    </main>
  );
}

function Field({ label, value, onChange, required, type = "text", step }: { label: string; value: string; onChange: (value: string) => void; required?: boolean; type?: string; step?: string }) {
  return <label className="text-xs uppercase tracking-widest text-neutral-400">{label}<input required={required} type={type} step={step} value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full border border-neutral-700 bg-black px-3 py-3 text-sm text-white outline-none focus:border-white" /></label>;
}
