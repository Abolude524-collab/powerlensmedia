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

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowCalendlyInline(!showCalendlyInline)}
                    className="font-mono text-[11px] text-neutral-400 hover:text-white uppercase tracking-wider transition-colors underline"
                  >
                    {showCalendlyInline ? "Switch to Custom Scheduler" : "Switch to Calendly View"}
                  </button>
                  <button
                    onClick={() => setIsCalendlyOpen(true)}
                    className="hidden sm:inline-flex items-center gap-1 font-mono text-[10px] text-neutral-400 hover:text-white uppercase tracking-wider transition-colors"
                  >
                    <span>Popout</span>
                    <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                  </button>
                </div>
              </div>

              {!showCalendlyInline ? (
                /* Custom Interactive Scheduler with Prev/Next day buttons & vertical time slots */
                <InteractiveBooking contactEmail={settings.contactEmail} />
              ) : (
                /* Inline Calendly Widget */
                <div className="p-4 sm:p-6 bg-[#151515] border border-neutral-800 flex flex-col gap-4 shadow-2xl rounded-sm">
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 block">
                        CALENDLY EMBED WIDGET
                      </span>
                      <h2 className="text-xl font-bold uppercase tracking-tight text-white font-montserrat mt-0.5">
                        Calendly Appointment View
                      </h2>
                    </div>
                  </div>

                  <div
                    className="calendly-inline-widget w-full rounded border border-neutral-800 bg-[#0e0e0e] overflow-hidden relative"
                    style={{ minWidth: "320px", height: "680px" }}
                  >
                    {calendlyLoading && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0e0e0e] text-white font-mono text-xs gap-3 z-10">
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>LOADING CALENDLY SCHEDULER...</span>
                      </div>
                    )}
                    <iframe
                      src={calendlyInlineUrl}
                      title="Select a Date & Time - Calendly"
                      className="w-full h-full border-0"
                      onLoad={() => setCalendlyLoading(false)}
                    />
                  </div>
                </div>
              )}
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

      {/* Calendly Booking Modal */}
      <CalendlyModal
        isOpen={isCalendlyOpen}
        onClose={() => setIsCalendlyOpen(false)}
        calendlyUrl="https://calendly.com/testimonyabolude/30min"
      />
    </footer>
  );
}
