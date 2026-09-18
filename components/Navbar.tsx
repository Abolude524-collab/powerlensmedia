"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface NavbarProps {
  activeSection?: string;
  profilePictureUrl?: string;
  onOpenBooking?: () => void;
}

export default function Navbar({
  activeSection = "home",
  profilePictureUrl,
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#home", sectionId: "home" },
    { name: "Services", href: "#services", sectionId: "services" },
    { name: "Gallery", href: "#gallery", sectionId: "gallery" },
    { name: "About", href: "#about", sectionId: "about" },
    { name: "Inquire", href: "#contact", sectionId: "contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled || mobileMenuOpen
          ? "bg-[#0e0e0e]/95 backdrop-blur-xl border-b border-neutral-800/80 py-3 shadow-2xl"
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

        {/* Desktop Editorial Navigation */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-semibold uppercase tracking-wider font-montserrat">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`transition-colors ${
                activeSection === link.sectionId ? "text-white font-bold" : "text-neutral-400 hover:text-white"
              }`}
            >
              {link.name}
            </a>
          ))}
          <a
            href="https://www.instagram.com/gpoweredward?utm_source=qr&stkn=cmRxMmNhd3VrY2J4"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-400 hover:text-white transition-colors"
          >
            @gpoweredward
          </a>
        </nav>

        {/* Header Right Actions & Mobile Toggle */}
        <div className="flex shrink-0 items-center gap-3 sm:gap-4">
          <a
            href="#booking"
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 bg-white text-black font-bold font-mono text-[11px] uppercase tracking-wider hover:bg-neutral-200 transition-colors rounded-xs shadow-sm"
          >
            <span className="material-symbols-outlined text-[15px]">calendar_month</span>
            <span>Book Session</span>
          </a>

          {profilePictureUrl && (
            <a
              href="#about"
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

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center justify-center p-2 rounded text-neutral-300 hover:text-white bg-neutral-900 border border-neutral-800 transition-colors"
            aria-label="Toggle Mobile Menu"
            aria-expanded={mobileMenuOpen}
          >
            <span className="material-symbols-outlined text-[20px]">
              {mobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="md:hidden bg-[#0e0e0e] border-b border-neutral-800 px-4 pt-4 pb-6 overflow-hidden"
          >
            <nav className="flex flex-col gap-3 font-montserrat text-xs font-semibold uppercase tracking-wider">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`py-2 px-3 rounded border transition-colors flex items-center justify-between ${
                    activeSection === link.sectionId
                      ? "bg-neutral-900 text-white border-neutral-700 font-bold"
                      : "text-neutral-400 border-transparent hover:bg-neutral-900/50 hover:text-white"
                  }`}
                >
                  <span>{link.name}</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </a>
              ))}
              
              <div className="pt-2 border-t border-neutral-800 flex flex-col gap-2">
                <a
                  href="#booking"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 px-4 bg-white text-black font-bold font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 rounded-xs shadow-md"
                >
                  <span className="material-symbols-outlined text-[16px]">calendar_month</span>
                  <span>Book Session</span>
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
