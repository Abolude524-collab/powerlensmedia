"use client";

import React, { useEffect, useState } from "react";

interface InteractiveBookingProps {
  contactEmail: string;
  onSuccess?: () => void;
}

export default function InteractiveBooking({ contactEmail }: InteractiveBookingProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if Calendly script is already added
    const existingScript = document.querySelector('script[src="https://assets.calendly.com/assets/external/widget.js"]');
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://assets.calendly.com/assets/external/widget.js";
      script.async = true;
      script.onload = () => setLoading(false);
      document.body.appendChild(script);
    } else {
      setLoading(false);
    }
  }, []);

  const calendlyUrl =
    "https://calendly.com/testimonyabolude/30min?background_color=0e0e0e&text_color=ffffff&primary_color=ffffff";

  return (
    <div className="w-full bg-[#151515] border border-neutral-800 rounded-sm p-4 sm:p-6 flex flex-col gap-4 shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-neutral-800 pb-3 gap-2">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 block">
            CALENDLY SCHEDULER
          </span>
          <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-white font-montserrat mt-0.5">
            Reserve A Session
          </h2>
        </div>
        <span className="font-mono text-[11px] text-neutral-400 hidden sm:inline">
          {contactEmail}
        </span>
      </div>

      {/* Official Calendly Inline Widget Container */}
      <div className="relative w-full rounded bg-[#0e0e0e] border border-neutral-800/80 overflow-hidden min-h-[680px] sm:min-h-[700px]">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0e0e0e] text-white font-mono text-xs gap-3 z-10">
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span className="tracking-widest uppercase">LOADING CALENDLY SCHEDULER...</span>
          </div>
        )}

        {/* Calendly Inline Widget DOM Node */}
        <div
          className="calendly-inline-widget w-full h-full"
          data-url={calendlyUrl}
          style={{ minWidth: "320px", height: "700px" }}
        />
      </div>
    </div>
  );
}
