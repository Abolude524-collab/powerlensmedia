"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CalendlyModalProps {
  isOpen: boolean;
  onClose: () => void;
  calendlyUrl?: string;
}

export default function CalendlyModal({
  isOpen,
  onClose,
  calendlyUrl = "https://calendly.com/testimonyabolude/30min",
}: CalendlyModalProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isOpen && e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Append dark theme query params to Calendly URL if not present
  const embedUrl = calendlyUrl.includes("?")
    ? `${calendlyUrl}&background_color=0e0e0e&text_color=ffffff&primary_color=ffffff`
    : `${calendlyUrl}?background_color=0e0e0e&text_color=ffffff&primary_color=ffffff`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 select-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative z-10 w-full max-w-4xl h-[85vh] bg-[#0e0e0e] border border-neutral-800 rounded-lg shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <header className="px-6 py-4 border-b border-neutral-800/80 bg-[#141414] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="font-mono text-xs text-neutral-400 uppercase tracking-widest">
                CALENDLY APPOINTMENT BOOKING
              </span>
            </div>
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 rounded text-neutral-400 hover:text-white flex items-center gap-2 text-xs font-mono transition-colors"
            >
              <span>ESC</span>
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </header>

          {/* Iframe Stage */}
          <div className="relative flex-1 w-full bg-[#0e0e0e] overflow-hidden">
            {loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0e0e0e] text-white font-mono text-xs gap-3">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>LOADING CALENDLY SCHEDULER...</span>
              </div>
            )}
            <iframe
              src={embedUrl}
              title="Select a Date & Time - Calendly"
              className="w-full h-full border-0"
              onLoad={() => setLoading(false)}
            />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
