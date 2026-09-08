"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { PhotoItem, SiteSettings } from "../lib/content-types";
import Typewriter from "./Typewriter";

interface HeroProps {
  settings: SiteSettings;
  featuredPhoto?: PhotoItem;
  heroPhotos?: PhotoItem[];
  onOpenPhoto?: (photo: PhotoItem) => void;
  onScrollToGallery: () => void;
}

export default function Hero({
  settings,
  featuredPhoto,
  heroPhotos = [],
  onOpenPhoto,
  onScrollToGallery,
}: HeroProps) {
  const backgroundPhotos = heroPhotos.length ? heroPhotos : featuredPhoto ? [featuredPhoto] : [];
  const [activeBackground, setActiveBackground] = useState(0);

  useEffect(() => {
    if (backgroundPhotos.length < 2) return;
    const interval = window.setInterval(() => {
      setActiveBackground((current) => (current + 1) % backgroundPhotos.length);
    }, 7000);
    return () => window.clearInterval(interval);
  }, [backgroundPhotos.length]);

  const safeActiveBackground = backgroundPhotos.length ? activeBackground % backgroundPhotos.length : 0;
  const heroImage = backgroundPhotos[safeActiveBackground]?.imageUrl || settings.heroPhotoUrl || "";

  return (
    <section id="home" className="relative w-full min-h-[92vh] overflow-hidden flex flex-col justify-between select-none pt-16 bg-[#0e0e0e]">
      {/* Hero Background Full Edge-to-Edge Image */}
      {heroImage && <div className="absolute inset-0 h-full w-full overflow-hidden">
        {backgroundPhotos.map((photo, index) => (
          <Image
            key={photo._id}
            src={photo.imageUrl}
            alt={photo.altText || "Edwards Godspower Chiaroscuro Mobile Photography"}
            fill
            priority={index === 0}
            sizes="100vw"
            className={`object-cover object-[center_24%] contrast-125 transition-[opacity,transform] duration-[1800ms] ease-out ${index === safeActiveBackground ? "scale-105 opacity-100" : "scale-100 opacity-0"}`}
          />
        ))}
      </div>}

      {/* Scrim Gradients for Contrast & Legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-[#0e0e0e]/40 to-[#0e0e0e]/80 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-transparent to-[#0e0e0e]/90 pointer-events-none" />

      {/* Top Exhibition Meta Badge */}
      <div className="relative z-10 w-full pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-white animate-pulse" />
          <span className="max-w-[18rem] text-[10px] sm:text-[11px] leading-tight font-mono tracking-widest text-neutral-300 uppercase">
            EXHIBITION NO. 01 — ARCHIVAL CUT
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-[11px] font-mono text-neutral-400">
          <span>ISO 50</span>
          <span className="text-neutral-600">•</span>
          <span>24MM EQUIV.</span>
          <span className="text-neutral-600">•</span>
          <span>1/1250S</span>
        </div>
      </div>

      {/* Centered Editorial Type Core */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center my-auto py-12">
        <div className="inline-block mb-3 overflow-hidden">
          <p className="text-[11px] font-mono uppercase tracking-widest text-neutral-400">
            Mobile Photography / {settings.alias}
          </p>
        </div>

        <h1 className="text-5xl sm:text-7xl md:text-8xl font-extrabold uppercase text-white tracking-tighter max-w-4xl font-montserrat leading-[0.95] mb-6">
          {settings.photographerName}
        </h1>

        <p className="mb-6 font-serif text-xl italic tracking-normal text-white/90 sm:text-2xl">
          Every picture tells a story.
        </p>

        <div className="max-w-2xl min-h-[60px] sm:min-h-[80px] mx-auto mb-8 flex items-start justify-center">
          <Typewriter
            text="Through the lens of modern mobility. Raw, unscripted chiaroscuro light from Lagos to the world."
            className="text-base sm:text-xl text-neutral-300 font-light leading-relaxed"
          />
        </div>

        {/* Action Triggers */}
        <div className="flex w-full flex-col sm:w-auto sm:flex-row items-center gap-4">
          <button
            onClick={onScrollToGallery}
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-8 py-3.5 bg-white text-black hover:bg-neutral-200 transition-all duration-300 font-semibold text-xs uppercase tracking-wider group shadow-xl active:scale-95"
          >
            <span>View Gallery</span>
            <span className="material-symbols-outlined text-[18px] transition-transform duration-300 group-hover:translate-y-1">
              arrow_downward
            </span>
          </button>

          <a
            href="#contact"
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-6 py-3.5 text-neutral-300 hover:text-white border border-neutral-700/60 hover:border-neutral-500 bg-neutral-900/60 backdrop-blur-md transition-colors text-xs font-semibold uppercase tracking-wider"
          >
            <span>Inquire &amp; Dossier</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </a>
        </div>
      </div>

      {/* Bottom Technical Ribbon & Scroll Cue */}
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-8">
        <div className="w-full bg-[#1c1b1b]/80 backdrop-blur-md border border-neutral-800/80 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Technical Telemetry */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-x-8 gap-y-2 w-full md:w-auto font-mono text-[11px]">
            <div className="flex flex-col">
              <span className="text-neutral-500 uppercase text-[9px] tracking-widest">SERIES</span>
              <span className="text-white font-medium tracking-wider">01 / HERO FEATURE</span>
            </div>
            <div className="flex flex-col">
              <span className="text-neutral-500 uppercase text-[9px] tracking-widest">HARDWARE</span>
              <span className="text-white font-medium tracking-wider">IPHONE 15 PRO MAX</span>
            </div>
            <div className="flex flex-col">
              <span className="text-neutral-500 uppercase text-[9px] tracking-widest">OPTICS</span>
              <span className="text-white font-medium tracking-wider">ƒ/1.78 SC</span>
            </div>
            <div className="flex flex-col">
              <span className="text-neutral-500 uppercase text-[9px] tracking-widest">COORDINATES</span>
              <span className="text-white font-medium tracking-wider">VICTORIA ISLAND, LAGOS</span>
            </div>
          </div>

          {/* Scroll Cue Indicator */}
          <button
            onClick={onScrollToGallery}
            className="flex items-center gap-3 text-neutral-400 hover:text-white transition-colors cursor-pointer group shrink-0"
          >
            <span className="font-mono text-[10px] uppercase tracking-widest">SCROLL TO EXPLORE</span>
            <div className="w-5 h-8 rounded-full bg-neutral-800 border border-neutral-700 flex items-start justify-center p-1">
              <span className="w-1 h-2 rounded-full bg-white animate-bounce" />
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}
