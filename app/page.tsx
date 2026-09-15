"use client";

import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import ServicesSection from "../components/ServicesSection";
import MasonryGallery from "../components/MasonryGallery";
import LightboxModal from "../components/LightboxModal";
import FooterContact from "../components/FooterContact";
import { PhotoItem, SiteSettings, ServiceItem } from "../lib/content-types";
import { FALLBACK_SETTINGS, FALLBACK_SERVICES } from "../lib/content-fallback";
import { trackEvent } from "../lib/analytics";

export default function Home() {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [services, setServices] = useState<ServiceItem[]>(FALLBACK_SERVICES);
  const [categories, setCategories] = useState<string[]>(["All Works"]);
  const [settings, setSettings] = useState<SiteSettings>(FALLBACK_SETTINGS);
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
        const data: { photos: PhotoItem[]; categories?: string[]; services?: ServiceItem[]; settings: SiteSettings } = await response.json();
        setPhotos(data.photos);
        if (data.services && data.services.length) setServices(data.services);
        setCategories(["All Works", ...(data.categories || [])]);
        if (data.settings) setSettings(data.settings);
      } catch (error) {
        console.error("Unable to load portfolio content:", error);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      const servicesElement = document.getElementById("services");
      const galleryElement = document.getElementById("gallery");
      const aboutElement = document.getElementById("about");
      const contactElement = document.getElementById("contact");

      if (contactElement && scrollPosition >= contactElement.offsetTop) {
        setActiveSection("contact");
      } else if (aboutElement && scrollPosition >= aboutElement.offsetTop) {
        setActiveSection("about");
      } else if (galleryElement && scrollPosition >= galleryElement.offsetTop) {
        setActiveSection("gallery");
      } else if (servicesElement && scrollPosition >= servicesElement.offsetTop) {
        setActiveSection("services");
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

  const handleSelectServiceCategory = (category: string) => {
    // Look for matching category in the available categories list (case-insensitive)
    const matchedCategory = categories.find((c) => c.toLowerCase() === category.toLowerCase()) || category;
    if (!categories.includes(matchedCategory)) {
      setCategories((prev) => [...prev, matchedCategory]);
    }
    setActiveCategory(matchedCategory);
    setPreviewMode(false);
  };

  const handleSelectCategory = (category: string) => {
    setActiveCategory(category);
    setPreviewMode(false);
  };

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

      {/* What I Do / Photography Services */}
      <ServicesSection
        services={services}
        onSelectCategory={handleSelectServiceCategory}
      />

      {/* Archival Masonry Gallery */}
      <div ref={galleryRef}>
        <MasonryGallery
          photos={photos}
          onSelectPhoto={handleSelectPhoto}
          activeCategory={activeCategory}
          onSelectCategory={handleSelectCategory}
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

