"use client";

import React, { useState } from "react";
import Image from "next/image";
import { SiteSettings } from "../lib/content-types";
import { trackEvent } from "../lib/analytics";
import CalendlyModal from "./CalendlyModal";
import InteractiveBooking from "./InteractiveBooking";

interface FooterContactProps {
  settings: SiteSettings;
}

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function WhatsAppIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.285-.143-1.689-.834-1.95-.929-.26-.095-.45-.143-.639.143-.19.286-.735.929-.901 1.119-.166.19-.333.214-.618.071-.285-.143-1.204-.444-2.293-1.415-.848-.755-1.42-1.688-1.587-1.974-.166-.285-.018-.44.125-.582.128-.128.285-.333.428-.5.143-.166.19-.285.285-.476.095-.19.048-.357-.024-.5-.071-.143-.639-1.541-.875-2.107-.23-.553-.464-.477-.639-.486-.166-.008-.357-.01-.548-.01s-.5.071-.761.357c-.262.286-1 .977-1 2.381 0 1.405 1.023 2.762 1.166 2.953.143.19 2.013 3.074 4.877 4.311.681.294 1.213.469 1.628.601.684.217 1.307.186 1.8.113.55-.082 1.689-.69 1.927-1.357.238-.667.238-1.238.166-1.357-.071-.119-.261-.19-.546-.333z" />
    </svg>
  );
}

function FacebookIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function EmailIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

export default function FooterContact({ settings }: FooterContactProps) {
  const [copied, setCopied] = useState(false);
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);
  const [showCalendlyInline, setShowCalendlyInline] = useState(false);
  const [calendlyLoading, setCalendlyLoading] = useState(true);

  // Form State
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(settings.contactEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errorMsg) setErrorMsg("");
  };

  const handleSubmitMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.message) {
      setErrorMsg("Please fill in all fields (Name, Phone, Email, and Message).");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to send message.");
      }

      trackEvent("contact_form_submit", "email_dispatch");
      setSuccessMsg("Thank you! Your message has been sent. Check your email for confirmation.");
      setForm({ name: "", phone: "", email: "", message: "" });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setErrorMsg(message);
    } finally {
      setSubmitting(false);
    }
  };

  const calendlyInlineUrl =
    "https://calendly.com/testimonyabolude/30min?background_color=0e0e0e&text_color=ffffff&primary_color=ffffff";

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
            <span>NIGER STATE / NIGERIA</span>
            <span className="text-white font-semibold">STATUS: ACCEPTING COMMISSIONS</span>
          </div>
        </div>

        {/* Dossier Grid: Editorial Portrait & Narrative */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start pb-16 border-b border-neutral-900">
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
                  <span className="min-w-0">Based in Niger State, Nigeria • Available Worldwide</span>
                </div>
              </div>
            </div>

            {/* Quick Action Anchor Navigation Card */}
            <div className="bg-gradient-to-br from-[#1c1b1b] to-[#121212] p-6 border border-neutral-800 flex flex-col gap-4 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-400">
                  COMMISSION CHANNELS
                </span>
                <span className="flex items-center gap-1.5 font-mono text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 border border-emerald-800/60 rounded">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  ONLINE
                </span>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Send a message directly or jump straight down to reserve an appointment slot on the calendar.
              </p>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href="#contact"
                  className="py-2.5 px-3 font-mono text-xs uppercase tracking-wider bg-[#141414] hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 transition-all flex items-center justify-center gap-1.5 rounded-xs"
                >
                  <span className="material-symbols-outlined text-[16px]">mail</span>
                  <span>Message</span>
                </a>

                <a
                  href="#booking"
                  className="py-2.5 px-3 font-mono text-xs uppercase tracking-wider bg-white text-black font-bold hover:bg-neutral-200 border border-white transition-all flex items-center justify-center gap-1.5 rounded-xs shadow-md"
                >
                  <span className="material-symbols-outlined text-[16px]">calendar_month</span>
                  <span>Book Session</span>
                </a>
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
              <div className="grid grid-cols-2 gap-2 pt-2 text-center font-mono text-[11px]">
                <div className="bg-[#131313] p-2 border border-neutral-800">
                  <span className="text-neutral-500 block text-[9px] uppercase">PROJECTS</span>
                  <span className="font-semibold text-white">10+</span>
                </div>
                <div className="bg-[#131313] p-2 border border-neutral-800">
                  <span className="text-neutral-500 block text-[9px] uppercase">COMMISSIONS</span>
                  <span className="font-semibold text-white">OPEN</span>
                </div>
              </div>
            </div>

            {/* Social Connectivity Grid */}
            <div className="bg-[#1c1b1b] p-6 flex flex-col gap-4 border border-neutral-800 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 block">
                  SOCIAL CONNECTIVITY
                </span>
                <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-wider">
                  DIRECT CHANNELS
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {settings.socialLinks.map((link, idx) => {
                  const isInstagram = link.platform.toLowerCase().includes("instagram");
                  const isWhatsapp = link.platform.toLowerCase().includes("whatsapp");
                  const isFacebook = link.platform.toLowerCase().includes("facebook");
                  const isEmail = link.platform.toLowerCase().includes("email") || link.url.startsWith("mailto:");

                  return (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackEvent(isWhatsapp ? "whatsapp_click" : "social_click", link.platform)}
                      className="p-3 bg-[#131313] hover:bg-neutral-800/90 border border-neutral-800 hover:border-neutral-700 flex items-center justify-between transition-all duration-300 group rounded-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 overflow-hidden">
                        {/* Brand Icon Badge */}
                        <div className="w-7 h-7 rounded-xs bg-neutral-900 border border-neutral-700/60 flex items-center justify-center shrink-0 text-white group-hover:scale-105 group-hover:border-white transition-all">
                          {isInstagram && <InstagramIcon className="w-3.5 h-3.5 text-pink-500" />}
                          {isWhatsapp && <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-400" />}
                          {isFacebook && <FacebookIcon className="w-3.5 h-3.5 text-blue-500" />}
                          {isEmail && <EmailIcon className="w-3.5 h-3.5 text-amber-400" />}
                          {!isInstagram && !isWhatsapp && !isFacebook && !isEmail && (
                            <span className="material-symbols-outlined text-[14px] text-white">link</span>
                          )}
                        </div>

                        <div className="flex flex-col min-w-0 overflow-hidden">
                          <span className="text-[10px] font-bold text-white uppercase font-montserrat tracking-wider flex items-center gap-1 leading-tight">
                            {link.platform}
                          </span>
                          <span className="font-mono text-[10px] text-neutral-400 group-hover:text-neutral-200 transition-colors truncate leading-tight">
                            {link.handle}
                          </span>
                        </div>
                      </div>

                      <span className="material-symbols-outlined text-[14px] text-neutral-500 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 ml-1">
                        arrow_outward
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Statement, Dedicated Contact Form & Dedicated Booking Section */}
          <div className="lg:col-span-7 flex flex-col gap-12">
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

            {/* SECTION 1: DIRECT CONTACT MESSAGE FORM */}
            <div id="contact" className="p-6 sm:p-8 bg-[#151515] border border-neutral-800 flex flex-col gap-6 shadow-2xl rounded-sm">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 block">
                    DIRECT INQUIRY CHANNEL
                  </span>
                  <h2 className="text-2xl font-bold uppercase tracking-tight text-white font-montserrat mt-0.5">
                    Send Us A Message
                  </h2>
                </div>
                <span className="font-mono text-xs text-neutral-500 hidden sm:inline">
                  {settings.contactEmail}
                </span>
              </div>

              {successMsg && (
                <div className="p-4 bg-emerald-950/80 border border-emerald-700/80 text-emerald-300 text-xs font-mono rounded flex items-start gap-3">
                  <span className="material-symbols-outlined text-[18px] text-emerald-400 shrink-0">check_circle</span>
                  <span>{successMsg}</span>
                </div>
              )}

              {errorMsg && (
                <div className="p-4 bg-rose-950/80 border border-rose-700/80 text-rose-300 text-xs font-mono rounded flex items-start gap-3">
                  <span className="material-symbols-outlined text-[18px] text-rose-400 shrink-0">error</span>
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmitMessage} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name Input */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-[10px] uppercase tracking-wider text-neutral-400">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleFormChange}
                      placeholder="e.g. Sarah Jenkins"
                      required
                      className="w-full px-4 py-3 bg-[#0e0e0e] border border-neutral-800 rounded focus:border-white focus:outline-none text-xs text-white placeholder-neutral-600 transition-colors font-sans"
                    />
                  </div>

                  {/* Phone Input */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-[10px] uppercase tracking-wider text-neutral-400">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleFormChange}
                      placeholder="e.g. +234 801 234 5678"
                      required
                      className="w-full px-4 py-3 bg-[#0e0e0e] border border-neutral-800 rounded focus:border-white focus:outline-none text-xs text-white placeholder-neutral-600 transition-colors font-sans"
                    />
                  </div>
                </div>

                {/* Email Input */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[10px] uppercase tracking-wider text-neutral-400">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleFormChange}
                    placeholder="e.g. sarah@example.com"
                    required
                    className="w-full px-4 py-3 bg-[#0e0e0e] border border-neutral-800 rounded focus:border-white focus:outline-none text-xs text-white placeholder-neutral-600 transition-colors font-sans"
                  />
                </div>

                {/* Message Input */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[10px] uppercase tracking-wider text-neutral-400">
                    Your Message / Project Details *
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    value={form.message}
                    onChange={handleFormChange}
                    placeholder="Describe your session, date preferences, location, or photography goals..."
                    required
                    className="w-full px-4 py-3 bg-[#0e0e0e] border border-neutral-800 rounded focus:border-white focus:outline-none text-xs text-white placeholder-neutral-600 transition-colors font-sans resize-none"
                  />
                </div>

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      className="text-xs font-mono text-neutral-400 hover:text-white transition-colors underline uppercase tracking-wider"
                    >
                      {copied ? "Copied Mail! ✓" : "Copy Direct Email"}
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto px-8 py-3.5 bg-white text-black font-bold text-xs font-mono uppercase tracking-wider hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 shadow-md"
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <span>Transmit Message</span>
                        <span aria-hidden="true">→</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* SECTION 2: DEDICATED APPOINTMENT SCHEDULER SECTION */}
            <div id="booking" className="flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-mono text-xs uppercase tracking-widest text-neutral-300 font-bold">
                    RESERVE A SESSION
                  </span>
                </div>
              </div>

              {/* Custom Interactive Scheduler */}
              <InteractiveBooking contactEmail={settings.contactEmail} />
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

      {/* Calendly Booking Modal */}
      <CalendlyModal
        isOpen={isCalendlyOpen}
        onClose={() => setIsCalendlyOpen(false)}
        calendlyUrl="https://calendly.com/testimonyabolude/30min"
      />
    </footer>
  );
}
