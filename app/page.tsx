"use client";

import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import MasonryGallery from "../components/MasonryGallery";
import LightboxModal from "../components/LightboxModal";
import FooterContact from "../components/FooterContact";
import { PhotoItem, SiteSettings } from "../lib/content-types";
import { trackEvent } from "../lib/analytics";

export default function Home() {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [categories, setCategories] = useState<string[]>(["All Works"]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All Works");
  const [previewMode, setPreviewMode] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);
  const [activeSection, setActiveSection] = useState<string>("home");

  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch("/api/content", { cache: "no-store" });
        if (!response.ok) throw new Error(`Content request failed: ${response.status}`);
        const data: { photos: PhotoItem[]; categories?: string[]; settings: SiteSettings } = await response.json();
        setPhotos(data.photos);
        setCategories(["All Works", ...(data.categories || [])]);
        setSettings(data.settings);
      } catch (error) {
        console.error("Unable to load portfolio content:", error);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      const galleryElement = document.getElementById("gallery");
      const aboutElement = document.getElementById("about");
      const contactElement = document.getElementById("contact");

      if (contactElement && scrollPosition >= contactElement.offsetTop) {
        setActiveSection("contact");
      } else if (aboutElement && scrollPosition >= aboutElement.offsetTop) {
        setActiveSection("about");
      } else if (galleryElement && scrollPosition >= galleryElement.offsetTop) {
        setActiveSection("gallery");
      } else {
        setActiveSection("home");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollToGallery = () => {
    const galleryElement = document.getElementById("gallery");
    if (galleryElement) {
      galleryElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (!settings) {
    return (
      <div className="min-h-screen bg-[#0e0e0e] text-white flex items-center justify-center font-mono text-xs tracking-widest uppercase">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-white animate-ping" />
          <span>POWER LENS • LOADING ARCHIVE...</span>
        </div>
      </div>
    );
  }

  const featuredPhoto = photos.find((p) => p.featured) || photos[0];
  const heroPhotos = photos.filter((photo) => photo.hero).sort((first, second) => (first.heroOrder || 0) - (second.heroOrder || 0));
  const handleSelectPhoto = (photo: PhotoItem) => {
    trackEvent("gallery_open", photo.slug || photo._id);
    setSelectedPhoto(photo);
  };

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-[#e5e2e1] font-sans selection:bg-white selection:text-black">
      {/* Editorial Navigation */}
      <Navbar
        activeSection={activeSection}
        profilePictureUrl={settings.profilePictureUrl}
      />

      {/* Hero Landing Stage */}
      <Hero
        settings={settings}
        featuredPhoto={featuredPhoto}
        heroPhotos={heroPhotos}
        onOpenPhoto={setSelectedPhoto}
        onScrollToGallery={handleScrollToGallery}
      />

      {/* Archival Masonry Gallery */}
      <div ref={galleryRef}>
        <MasonryGallery
          photos={photos}
          onSelectPhoto={handleSelectPhoto}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          categories={categories}
          previewMode={previewMode}
          onTogglePreview={() => setPreviewMode(false)}
        />
      </div>

      {/* Framer Motion Lightbox Modal */}
      <LightboxModal
        photo={selectedPhoto}
        photos={photos}
        onClose={() => setSelectedPhoto(null)}
        onNavigate={setSelectedPhoto}
      />

      {/* Dossier & Contact Section */}
      <FooterContact settings={settings} />
    </div>
  );
}
