"use client";

import React from "react";
import Image from "next/image";
import { PhotoItem } from "../lib/content-types";

interface MasonryGalleryProps {
  photos: PhotoItem[];
  onSelectPhoto: (photo: PhotoItem) => void;
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  categories: string[];
  previewMode: boolean;
  onTogglePreview: () => void;
}

export default function MasonryGallery({
  photos,
  onSelectPhoto,
  activeCategory,
  onSelectCategory,
  categories,
  previewMode,
  onTogglePreview,
}: MasonryGalleryProps) {
  const categoryPhotos =
    activeCategory === "All Works" || activeCategory === "All"
      ? photos
      : photos.filter(
          (p) => p.category?.trim().toLowerCase() === activeCategory.trim().toLowerCase()
        );
  const filteredPhotos = previewMode
    ? Array.from(
        categoryPhotos.reduce((groups, photo) => {
          const category = photo.category?.trim().toLowerCase() || "uncategorized";
          const group = groups.get(category) || [];
          group.push(photo);
          groups.set(category, group);
          return groups;
        }, new Map<string, PhotoItem[]>()).values()
      ).flatMap((group) => group.sort((first, second) => Number(Boolean(second.featured)) - Number(Boolean(first.featured))).slice(0, 2))
    : categoryPhotos;

  return (
    <section id="gallery" className="py-20 md:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header & Category Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-neutral-800/80 pb-8">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-neutral-400 font-mono text-[11px] uppercase tracking-widest">
            <span>Plate Archive</span>
            <span>•</span>
            <span>Series 2023—2025</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold uppercase tracking-tight text-white font-montserrat">
            Selected Frames
          </h2>
        </div>

        {/* Filter Pills */}
        <div className="flex min-w-0 items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none touch-pan-x">
          {categories.map((cat) => {
            const isActive = activeCategory === cat || (activeCategory === "All" && cat === "All Works");
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`relative min-h-10 shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-neutral-900 text-white border border-neutral-700 shadow-md"
                    : "bg-neutral-950/60 text-neutral-400 hover:text-white border border-neutral-800/60"
                }`}
              >
                <span>{cat}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-4 right-4 h-[2px] bg-white rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Masonry Columns Layout */}
      {filteredPhotos.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-neutral-800 rounded-2xl bg-[#121212]/50 flex flex-col items-center justify-center px-4">
          <p className="text-neutral-400 text-xs font-mono uppercase tracking-widest mb-2">
            No Archival Frames
          </p>
          <p className="text-neutral-300 text-sm max-w-md font-light mb-6 leading-relaxed">
            No frames currently published in &quot;<span className="text-white font-medium">{activeCategory}</span>&quot;. New entries are regularly added.
          </p>
          <button
            type="button"
            onClick={() => onSelectCategory("All Works")}
            className="border border-amber-500/80 text-amber-400 hover:bg-amber-500 hover:text-black px-5 py-2.5 rounded text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300"
          >
            View All Works →
          </button>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredPhotos.map((photo) => (
            <div
              key={photo._id}
              onClick={() => onSelectPhoto(photo)}
              className="break-inside-avoid group relative rounded-sm overflow-hidden bg-[#1c1b1b] border border-neutral-800/80 cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-300 transform-gpu"
            >
              {/* Image Container with Native Aspect Ratio */}
              <div
                className="relative w-full overflow-hidden"
                style={{
                  aspectRatio: photo.aspectRatio
                    ? `${photo.aspectRatio}`
                    : photo.orientation === "landscape"
                    ? "16/10"
                    : photo.orientation === "portrait"
                    ? "3/4"
                    : "1/1",
                }}
              >
                <Image
                  src={photo.imageUrl}
                  alt={photo.altText || photo.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover contrast-110 group-hover:scale-105 transition-all duration-500 ease-out"
                />

                {/* Chiaroscuro Vignette Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6">
                  {/* Top Expand Icon */}
                  <div className="flex justify-end">
                    <div className="w-9 h-9 rounded-full bg-black/80 backdrop-blur-md flex items-center justify-center text-white border border-neutral-700/80 hover:bg-white hover:text-black transition-colors">
                      <span className="material-symbols-outlined text-[18px]">open_in_full</span>
                    </div>
                  </div>

                  {/* Bottom Information */}
                  <div className="flex flex-col gap-1 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <span className="text-[10px] uppercase tracking-widest font-mono text-neutral-400">
                      {photo.category} • {photo.location || "Niger State"}
                    </span>
                    <h3 className="text-lg font-bold text-white tracking-tight font-montserrat uppercase">
                      {photo.title}
                    </h3>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-400 mt-1">
                      <span>{photo.cameraSpec || "24mm • ƒ/1.78 • ISO 64"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {filteredPhotos.length > 0 && previewMode && (
        <div className="mt-12 flex justify-center border-t border-neutral-800/80 pt-8">
          <button
            type="button"
            onClick={onTogglePreview}
            className="border border-neutral-700 px-6 py-3 text-xs font-semibold uppercase tracking-widest text-neutral-300 transition hover:border-white hover:text-white"
          >
            See full gallery
          </button>
        </div>
      )}
    </section>
  );
}
