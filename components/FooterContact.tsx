"use client";

import React, { useState } from "react";
import Image from "next/image";
import { SiteSettings } from "../lib/content-types";
import { trackEvent } from "../lib/analytics";

interface FooterContactProps {
  settings: SiteSettings;
}

export default function FooterContact({ settings }: FooterContactProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(settings.contactEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <footer className="w-full bg-[#0e0e0e] text-[#e5e2e1] border-t border-neutral-800/80 pt-20 pb-12 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Curatorial Header Dossier Marker */}
        <div id="about" className="w-full flex items-center justify-between pb-6 mb-12 border-b border-neutral-800/60">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-[11px] uppercase tracking-widest text-neutral-400">
              ED. 04 / DOSSIER
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            <span className="font-mono text-[11px] uppercase tracking-widest text-neutral-300">
              CURATORIAL PROFILE &amp; COMMISSIONS
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4 font-mono text-[11px] text-neutral-400">
            <span>UTC+01:00</span>
            <span>LAGOS / NIGERIA</span>
            <span className="text-white font-semibold">STATUS: ACCEPTING COMMISSIONS</span>
          </div>
        </div>

        {/* Dossier Grid: Editorial Portrait & Narrative */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start pb-20 border-b border-neutral-900">
          {/* Left Column: Portrait & Telemetry */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="relative w-full bg-[#131313] overflow-hidden border border-neutral-800 shadow-2xl group">
              <div className="w-full aspect-[3/4] relative overflow-hidden bg-neutral-900">
                {settings.profilePictureUrl && (
                  <Image
                    src={settings.profilePictureUrl}
                    alt="Edwards Godspower Editorial Portrait"
                    fill
                    sizes="(max-width: 1024px) 100vw, 400px"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-transparent to-transparent opacity-60" />
                
                <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md px-3 py-1 border border-neutral-700/60">
                  <span className="font-mono text-[10px] tracking-wider text-white">
                    POWER LENS • DOSSIER FRAME 01
                  </span>
                </div>

                <div className="absolute bottom-4 right-4 bg-black/90 backdrop-blur-md px-3 py-1.5 border border-neutral-700/60 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-white">shutter_speed</span>
                  <span className="font-mono text-[11px] text-white">f/1.8 • 1/250s • 24mm</span>
                </div>
              </div>

              <div className="bg-[#1c1b1b] p-6 flex flex-col gap-1 border-t border-neutral-800">
                <div className="flex items-baseline justify-between">
                  <h2 className="text-xl font-bold uppercase tracking-wide text-white font-montserrat">
                    {settings.photographerName}
                  </h2>
                  <span className="font-mono text-[10px] text-neutral-400 tracking-widest uppercase">
                    DIR. VISION
                  </span>
                </div>
                <p className="text-sm text-neutral-400 font-normal">
                  Mobile Photographer &amp; Visual Storyteller
                </p>
                <div className="flex items-start gap-1.5 pt-2 text-neutral-400 font-mono text-[11px]">
                  <span className="material-symbols-outlined text-[16px] text-white">location_on</span>
                  <span className="min-w-0">Based in Lagos, Nigeria • Available Worldwide</span>
                </div>
              </div>
            </div>

            {/* Hardware Telemetry Card */}
            <div className="bg-[#1c1b1b] p-6 flex flex-col gap-4 border border-neutral-800">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-400">
                  PRIMARY APPARATUS
                </span>
                <span className="font-mono text-[11px] text-white">POCK-LENS RIG // PRO MAX</span>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed font-light">
                Zero heavy stabilization rigs. Edwards captures high-velocity reality entirely through handheld flagship mobile sensor architecture and tactile daylight direction.
              </p>
              <div className="grid grid-cols-3 gap-2 pt-2 text-center font-mono text-[11px]">
                <div className="bg-[#131313] p-2 border border-neutral-800">
                  <span className="text-neutral-500 block text-[9px] uppercase">PROJECTS</span>
                  <span className="font-semibold text-white">120+</span>
                </div>
                <div className="bg-[#131313] p-2 border border-neutral-800">
                  <span className="text-neutral-500 block text-[9px] uppercase">COUNTRIES</span>
                  <span className="font-semibold text-white">14</span>
                </div>
                <div className="bg-[#131313] p-2 border border-neutral-800">
                  <span className="text-neutral-500 block text-[9px] uppercase">COMMISSIONS</span>
                  <span className="font-semibold text-white">OPEN</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Statement, Philosophy & Direct Inquiry */}
          <div className="lg:col-span-7 flex flex-col gap-10">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 block mb-2">
                STATEMENT / PHILOSOPHY
              </span>
              <h1 className="text-4xl sm:text-6xl font-extrabold uppercase tracking-tight text-white font-montserrat leading-none mb-4">
                BEYOND THE GLASS
              </h1>
              <div className="flex items-center gap-2 pb-6">
                <a
                  href="https://www.instagram.com/gpoweredward?utm_source=qr&stkn=cmRxMmNhd3VrY2J4"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-neutral-400 hover:text-white transition-colors flex items-center gap-1 uppercase tracking-wider"
                >
                  <span>{settings.photographerName} ({settings.alias})</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_outward</span>
                </a>
              </div>

              <div className="space-y-4 text-neutral-300 text-base leading-relaxed font-light">
                <p>{settings.bio}</p>
                <p className="text-sm text-neutral-400">
                  The ethos rejects bloated crew logistics in favor of stealth, natural presence, and chiaroscuro daylight mastery directly within pulsing metropolitan atmospheres.
                </p>
              </div>
            </div>

            {/* Direct Email Inquiry Card */}
            <div id="contact" className="p-6 bg-[#1c1b1b] border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 block">
                  COMMISSION &amp; PRINT INQUIRIES
                </span>
                <span className="font-mono text-sm text-white font-semibold">
                  {settings.contactEmail}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href={`mailto:${settings.contactEmail}?subject=Photography%20Inquiry%20-%20Power%20Lens`}
                  onClick={() => trackEvent("contact_click", "email")}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold font-mono uppercase tracking-wider text-white hover:text-neutral-300 transition-colors whitespace-nowrap"
                >
                  <span>Inquire</span>
                  <span aria-hidden="true">→</span>
                </a>
                <button
                  onClick={handleCopyEmail}
                  className="px-6 py-2.5 bg-white text-black font-semibold text-xs font-mono uppercase tracking-wider hover:bg-neutral-200 transition-colors whitespace-nowrap active:scale-95"
                >
                  {copied ? "Copied! ✓" : "Copy Mail"}
                </button>
              </div>
            </div>

            {/* Social Connectivity Grid */}
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 block mb-4">
                SOCIAL CONNECTIVITY
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {settings.socialLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent(link.platform.toLowerCase() === "whatsapp" ? "whatsapp_click" : "social_click", link.platform)}
                    className="p-4 bg-[#131313] hover:bg-[#1c1b1b] border border-neutral-800 flex items-center justify-between transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-white group-hover:scale-125 transition-transform" />
                      <span className="text-xs font-semibold text-white uppercase font-montserrat">
                        {link.platform}
                      </span>
                    </div>
                    <span className="font-mono text-[11px] text-neutral-400 group-hover:text-white transition-colors flex items-center gap-1">
                      {link.handle}
                      <span className="material-symbols-outlined text-[14px]">arrow_outward</span>
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-neutral-500 gap-4">
          <div>
            © {new Date().getFullYear()} {settings.brandName}. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span>Built with Next.js &amp; Cloudinary</span>
            <a href="#home" className="hover:text-white transition-colors">
              Back to Top ↑
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
