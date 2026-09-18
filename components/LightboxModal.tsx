"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { PhotoItem } from "../lib/content-types";

interface LightboxModalProps {
  photo: PhotoItem | null;
  photos: PhotoItem[];
  onClose: () => void;
  onNavigate: (nextPhoto: PhotoItem) => void;
}

export default function LightboxModal({
  photo,
  photos,
  onClose,
  onNavigate,
}: LightboxModalProps) {
  const [copiedShare, setCopiedShare] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (photo) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!photo) return;
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight") {
        const currentIndex = photos.findIndex((p) => p._id === photo._id);
        if (currentIndex < photos.length - 1) {
          onNavigate(photos[currentIndex + 1]);
        }
      } else if (e.key === "ArrowLeft") {
        const currentIndex = photos.findIndex((p) => p._id === photo._id);
        if (currentIndex > 0) {
          onNavigate(photos[currentIndex - 1]);
        }
      } else if (e.key === "f" || e.key === "F") {
        setIsFullscreen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [photo, photos, onClose, onNavigate]);

  if (!photo) return null;

  const currentIndex = photos.findIndex((p) => p._id === photo._id);
  const totalCount = photos.length;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < totalCount - 1;

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex flex-col justify-between bg-black/95 backdrop-blur-xl text-white overflow-hidden select-none">
        {/* Backdrop Click Dismiss */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 z-0 bg-black/85"
        />

        {/* Top Bar Navigation & Actions */}
        {!isFullscreen && (
          <header className="relative z-20 w-full h-16 sm:h-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex items-center justify-between bg-gradient-to-b from-black/90 via-black/40 to-transparent shrink-0">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <span className="font-mono text-xs text-neutral-400">
                {String(currentIndex + 1).padStart(2, "0")} / {String(totalCount).padStart(2, "0")}
              </span>
              <span className="text-neutral-700 font-mono text-xs">—</span>
              <h2 className="text-sm sm:text-lg font-bold font-montserrat uppercase tracking-tight text-white truncate">
                {photo.title}
              </h2>
              <span className="hidden sm:inline text-neutral-700 font-mono text-xs">|</span>
              <span className="hidden sm:inline font-mono text-[11px] uppercase tracking-widest text-neutral-400">
                Edwards Godspower
              </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 rounded text-neutral-300 hover:text-white transition-all text-xs font-mono"
                title="Toggle Fullscreen View (Press F)"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {isFullscreen ? "fullscreen_exit" : "fullscreen"}
                </span>
                <span>{isFullscreen ? "Exit" : "Expand"}</span>
              </button>

              <button
                onClick={onClose}
                className="group flex items-center gap-2 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 rounded transition-all"
                aria-label="Close Lightbox"
              >
                <span className="hidden md:inline font-mono text-[10px] text-neutral-400 group-hover:text-white tracking-widest uppercase">
                  ESC
                </span>
                <span className="material-symbols-outlined text-white text-[18px]">close</span>
              </button>
            </div>
          </header>
        )}

        {/* Main Stage Image Display */}
        <div className={`relative z-10 flex-1 flex items-center justify-center w-full px-2 sm:px-6 my-auto ${isFullscreen ? "h-screen py-2" : ""}`}>
          {/* Previous Arrow */}
          {hasPrev && (
            <button
              onClick={() => onNavigate(photos[currentIndex - 1])}
              className="absolute left-2 sm:left-6 z-30 w-11 h-11 sm:w-13 sm:h-13 flex items-center justify-center rounded bg-black/80 hover:bg-neutral-800 border border-neutral-700 text-white transition-all backdrop-blur-md group"
              aria-label="Previous Photograph"
            >
              <span className="material-symbols-outlined text-[26px] sm:text-[30px] group-hover:-translate-x-0.5 transition-transform">
                chevron_left
              </span>
            </button>
          )}

          {/* Main Photo Centerpiece - Maximized Dimensions */}
          <motion.div
            key={photo._id}
            initial={{ scale: 0.97, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.97, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`relative flex items-center justify-center w-full h-full ${
              isFullscreen
                ? "max-w-[98vw] max-h-[96vh]"
                : "max-w-[94vw] md:max-w-[88vw] max-h-[82vh] md:max-h-[85vh]"
            }`}
          >
            <div className="relative w-full h-full flex items-center justify-center rounded overflow-hidden bg-black shadow-2xl border border-neutral-800/80">
              <div
                className="relative w-full h-full flex items-center justify-center"
                style={{
                  aspectRatio: photo.aspectRatio ? `${photo.aspectRatio}` : undefined,
                  maxHeight: "100%",
                  maxWidth: "100%",
                }}
              >
                <Image
                  src={photo.imageUrl}
                  alt={photo.altText || photo.title}
                  fill
                  priority
                  sizes="100vw"
                  className="object-contain contrast-105"
                />
              </div>
            </div>
          </motion.div>

          {/* Next Arrow */}
          {hasNext && (
            <button
              onClick={() => onNavigate(photos[currentIndex + 1])}
              className="absolute right-2 sm:right-6 z-30 w-11 h-11 sm:w-13 sm:h-13 flex items-center justify-center rounded bg-black/80 hover:bg-neutral-800 border border-neutral-700 text-white transition-all backdrop-blur-md group"
              aria-label="Next Photograph"
            >
              <span className="material-symbols-outlined text-[26px] sm:text-[30px] group-hover:translate-x-0.5 transition-transform">
                chevron_right
              </span>
            </button>
          )}
        </div>

        {/* Floating EXIF Telemetry Pill */}
        {!isFullscreen && (
          <div className="relative z-20 w-full flex justify-center px-4 my-2">
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 px-5 py-1.5 bg-[#1c1b1b]/90 backdrop-blur-md border border-neutral-800 rounded shadow-2xl text-[11px] font-mono">
              <div className="flex items-center gap-2 text-neutral-300">
                <span className="material-symbols-outlined text-[15px] text-white">photo_camera</span>
                <span className="font-medium text-white">{photo.hardware || "iPhone 15 Pro Max"}</span>
                <span className="text-neutral-600">•</span>
                <span>{photo.cameraSpec || "24mm • ƒ/1.78 • 1/1250s • ISO 64"}</span>
                <span className="hidden lg:inline text-neutral-600">•</span>
                <span className="hidden lg:inline text-neutral-400">
                  Shot by <strong className="text-white font-medium">@gpoweredward</strong>
                </span>
              </div>

              <div className="hidden sm:block w-[1px] h-3.5 bg-neutral-700" />

              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1 px-2 py-0.5 text-neutral-400 hover:text-white transition-colors uppercase font-mono text-[10px]"
                >
                  <span className="material-symbols-outlined text-[14px]">share</span>
                  <span>{copiedShare ? "Link Copied! ✓" : "Share"}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Thumbnail Strip Rail */}
        {!isFullscreen && (
          <footer className="relative z-20 w-full bg-[#0e0e0e]/95 backdrop-blur-md px-4 sm:px-8 py-2.5 border-t border-neutral-900 shrink-0">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
              <div className="hidden md:flex items-center gap-2 font-mono text-[11px] text-neutral-400 shrink-0 uppercase tracking-widest">
                <span className="material-symbols-outlined text-[16px]">collections</span>
                <span>Archival Series Rail</span>
              </div>

              {/* Thumbnail Navigation Strip */}
              <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none mx-auto md:mx-0">
                {photos.map((item, idx) => {
                  const isActive = item._id === photo._id;
                  return (
                    <div
                      key={item._id}
                      onClick={() => onNavigate(item)}
                      className={`relative h-11 w-15 shrink-0 cursor-pointer overflow-hidden rounded border transition-all ${
                        isActive
                          ? "border-white opacity-100 scale-105 shadow-md"
                          : "border-neutral-800 opacity-50 hover:opacity-90"
                      }`}
                    >
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        sizes="60px"
                        className="object-cover"
                      />
                      <span className="absolute bottom-0.5 right-1 font-mono text-[9px] text-white bg-black/80 px-1 rounded-xs">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </footer>
        )}
      </div>
    </AnimatePresence>
  );
}
