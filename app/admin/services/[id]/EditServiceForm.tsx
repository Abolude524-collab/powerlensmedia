"use client";

import { FormEvent, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ServiceRecord } from "../../../../lib/content-db";

export default function EditServiceForm({ service }: { service: ServiceRecord }) {
  const router = useRouter();
  const [title, setTitle] = useState(service.title);
  const [subtitle, setSubtitle] = useState(service.subtitle);
  const [imageUrl, setImageUrl] = useState(service.imageUrl);
  const [category, setCategory] = useState(service.category || "");
  const [sortOrder, setSortOrder] = useState(String(service.sortOrder || 0));
  const [published, setPublished] = useState(Boolean(service.published));

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const [categories, setCategories] = useState<string[]>(["Wedding", "Portraits", "Events", "Graduation", "Commercial", "Documentary", "Landscape", "Street"]);

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((res) => (res.ok ? res.json() : { categories: [] }))
      .then((data: { categories?: string[] }) => {
        if (data.categories && data.categories.length) {
          setCategories((prev) => Array.from(new Set([...prev, ...data.categories!])));
        }
      })
      .catch(() => {});
  }, []);

  async function uploadImage(file: File): Promise<string> {
    const timestamp = Math.floor(Date.now() / 1000);
    const signatureResponse = await fetch("/api/admin/cloudinary-signature", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ timestamp }),
    });
    if (!signatureResponse.ok) throw new Error("Unable to prepare upload.");
    const signature = await signatureResponse.json();

    const body = new FormData();
    body.append("file", file);
    body.append("api_key", signature.apiKey);
    body.append("timestamp", String(timestamp));
    body.append("signature", signature.signature);
    body.append("folder", signature.folder);
    body.append("tags", signature.tags);

    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${signature.cloudName}/image/upload`,
      { method: "POST", body }
    );
    if (!uploadResponse.ok) throw new Error("Cloudinary image upload failed.");
    const uploaded = await uploadResponse.json();
    return uploaded.secure_url || uploaded.url;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    let finalImageUrl = imageUrl.trim();

    if (!finalImageUrl && !imageFile) {
      setError("Please provide an Image URL or upload a cover image file.");
      return;
    }

    setBusy(true);

    try {
      if (imageFile) {
        finalImageUrl = await uploadImage(imageFile);
      }

      const response = await fetch(`/api/admin/services/${service._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          subtitle,
          imageUrl: finalImageUrl,
          category: category.trim() || title,
          sortOrder: parseInt(sortOrder, 10) || 0,
          published,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update service.");
      }

      router.push("/admin/services");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An error occurred.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-[#151515] border border-neutral-800 p-6 rounded-xs">
      {/* Existing Cover Image Preview */}
      {imageUrl && (
        <div>
          <label className="block text-xs uppercase tracking-widest text-neutral-400 mb-2">
            Current Cover Preview
          </label>
          <div className="relative h-44 w-full max-w-sm rounded-md overflow-hidden border border-neutral-700 bg-black">
            <Image src={imageUrl} alt={title} fill className="object-cover" />
          </div>
        </div>
      )}

      <div>
        <label className="block text-xs uppercase tracking-widest text-neutral-400 mb-2">
          Service Title <span className="text-amber-400">*</span>
        </label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-black border border-neutral-700 px-4 py-3 text-sm text-white focus:border-amber-400 outline-none"
        />
      </div>

      <div>
        <label className="block text-xs uppercase tracking-widest text-neutral-400 mb-2">
          Sharp Subtitle / Tagline <span className="text-amber-400">*</span>
        </label>
        <textarea
          required
          rows={2}
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          className="w-full bg-black border border-neutral-700 px-4 py-3 text-sm text-white focus:border-amber-400 outline-none"
        />
      </div>

      <div>
        <label className="block text-xs uppercase tracking-widest text-neutral-400 mb-2">
          Link to Gallery Category <span className="text-amber-400">*</span>
        </label>
        <input
          type="text"
          list="edit-category-options"
          placeholder="Select or type a category (e.g. Wedding, Events, Graduation)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full bg-black border border-neutral-700 px-4 py-3 text-sm text-white focus:border-amber-400 outline-none"
        />
        <datalist id="edit-category-options">
          {categories.map((cat) => (
            <option key={cat} value={cat} />
          ))}
        </datalist>
        <p className="mt-2 text-xs font-light text-neutral-500">
          🔗 Typing or selecting an existing category (e.g. &quot;Wedding&quot;, &quot;Events&quot;, &quot;Graduation&quot;, &quot;Portraits&quot;) links this service&apos;s &quot;VIEW WORK →&quot; button to automatically filter all portfolio photos matching that category.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs uppercase tracking-widest text-neutral-400 mb-2">
            Replace Cover Photo
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-neutral-300 file:mr-4 file:border-0 file:bg-amber-400 file:px-3 file:py-2 file:text-xs file:font-bold file:uppercase file:text-black hover:file:bg-amber-300"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-neutral-400 mb-2">
            Image URL
          </label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full bg-black border border-neutral-700 px-4 py-3 text-sm text-white focus:border-amber-400 outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-neutral-800">
        <div>
          <label className="block text-xs uppercase tracking-widest text-neutral-400 mb-2">
            Display Order
          </label>
          <input
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="w-full bg-black border border-neutral-700 px-4 py-3 text-sm text-white focus:border-amber-400 outline-none"
          />
        </div>

        <div className="flex items-center gap-3 pt-6">
          <input
            type="checkbox"
            id="published"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="w-4 h-4 accent-amber-400"
          />
          <label htmlFor="published" className="text-xs uppercase tracking-widest text-neutral-300 cursor-pointer">
            Published on website
          </label>
        </div>
      </div>

      {error && <p className="text-sm text-rose-400 font-mono">{error}</p>}

      <div className="flex items-center gap-4 pt-4">
        <button
          type="submit"
          disabled={busy}
          className="bg-amber-400 text-black px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-amber-300 transition-colors disabled:opacity-50"
        >
          {busy ? "Updating Service..." : "Update Service"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="border border-neutral-700 px-6 py-3 text-xs uppercase tracking-widest text-neutral-400 hover:text-white"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
