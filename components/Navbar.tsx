"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface NavbarProps {
  activeSection?: string;
  profilePictureUrl?: string;
  onOpenBooking?: () => void;
}

export default function Navbar({
  activeSection = "home",
  profilePictureUrl,
  onOpenBooking,
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-[#0e0e0e]/90 backdrop-blur-xl border-b border-neutral-800/60 py-3 shadow-2xl"
          : "bg-gradient-to-b from-black/80 via-black/40 to-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
        {/* Brand Logo & Owner Name */}
        <Link href="/" className="flex min-w-0 items-center gap-3 group">
          <div className="flex min-w-0 flex-col">
            <Image
              src="/power-lens-logo.svg"
              alt="Power Lens"
              width={150}
              height={36}
              priority
              className="h-7 w-auto transition-opacity duration-300 group-hover:opacity-75 sm:h-9"
            />
            <span className="text-[10px] tracking-widest text-neutral-400 uppercase hidden sm:inline-block font-mono">
              EDWARDS GODSPOWER
            </span>
          </div>
        </Link>

        {/* Editorial Navigation */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-semibold uppercase tracking-wider font-montserrat">
          <a
            href="#home"
            className={`transition-colors ${
              activeSection === "home" ? "text-white font-bold" : "text-neutral-400 hover:text-white"
            }`}
          >
            Home
          </a>
          <a
            href="#services"
            className={`transition-colors ${
              activeSection === "services" ? "text-white font-bold" : "text-neutral-400 hover:text-white"
            }`}
          >
            Services
          </a>
          <a
            href="#gallery"
            className={`transition-colors ${
              activeSection === "gallery" ? "text-white font-bold" : "text-neutral-400 hover:text-white"
            }`}
          >
            Gallery
          </a>
          <a
            href="#about"
            className={`transition-colors ${
              activeSection === "about" ? "text-white font-bold" : "text-neutral-400 hover:text-white"
            }`}
          >
            About
          </a>
          <a
            href="#contact"
            className={`transition-colors ${
              activeSection === "contact" ? "text-white font-bold" : "text-neutral-300 hover:text-white"
            }`}
          >
            Inquire
          </a>
          <a
            href="https://www.instagram.com/gpoweredward?utm_source=qr&stkn=cmRxMmNhd3VrY2J4"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-400 hover:text-white transition-colors"
          >
            @gpoweredward
          </a>
        </nav>

        {/* Header Right Actions */}
        <div className="flex shrink-0 items-center gap-3 sm:gap-4">
          <a
            href="#contact"
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 bg-white text-black font-bold font-mono text-[11px] uppercase tracking-wider hover:bg-neutral-200 transition-colors rounded-xs shadow-sm"
          >
            <span className="material-symbols-outlined text-[15px]">calendar_month</span>
            <span>Book Session</span>
          </a>

          {profilePictureUrl && (
            <a
              href="#contact"
              className="relative flex items-center justify-center p-0.5 rounded-full ring-1 ring-neutral-700 hover:ring-white transition-all"
              title="Edwards Godspower Dossier"
            >
              <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden bg-neutral-800">
                <Image
                  src={profilePictureUrl}
                  alt="Edwards Godspower Profile"
                  fill
                  sizes="32px"
                  className="object-cover grayscale hover:grayscale-0 transition-all"
                />
              </div>
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
