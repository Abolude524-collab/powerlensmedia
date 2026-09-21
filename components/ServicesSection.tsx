"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ServiceItem } from "../lib/content-types";

interface ServicesSectionProps {
  services: ServiceItem[];
  onSelectCategory?: (category: string) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
};

export default function ServicesSection({
  services = [],
  onSelectCategory,
}: ServicesSectionProps) {
  const handleCardClick = (category?: string) => {
    if (category && onSelectCategory) {
      onSelectCategory(category);
    }
    const galleryElement = document.getElementById("gallery");
    if (galleryElement) {
      galleryElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (!services.length) return null;

  return (
    <section id="services" className="relative w-full py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-[#0e0e0e] select-none">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="flex flex-col items-center text-center mb-12 sm:mb-16"
      >
        <p className="font-mono text-[11px] uppercase tracking-widest text-amber-500 font-semibold mb-3">
          WHAT I DO
        </p>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold uppercase tracking-tight text-white font-montserrat mb-4">
          Photography Services
        </h2>
        <p className="text-neutral-400 max-w-2xl text-sm sm:text-base font-light leading-relaxed">
          From intimate portraits to grand celebrations, every shoot is handled with care and artistic precision.
        </p>
      </motion.div>

      {/* Services Grid (4 per row on desktop) */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {services.map((service) => (
          <motion.div
            key={service._id}
            variants={itemVariants}
            whileHover={{ y: -6, transition: { duration: 0.3 } }}
            onClick={() => handleCardClick(service.category)}
            className="group relative h-[360px] sm:h-[400px] w-full overflow-hidden rounded-xl border border-neutral-800/80 bg-neutral-900 transition-all duration-500 hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-950/20 cursor-pointer flex flex-col justify-end p-6"
          >
            {/* Cover Background Image */}
            {service.imageUrl && (
              <Image
                src={service.imageUrl}
                alt={service.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108 contrast-110"
              />
            )}

            {/* Gradient Scrim for Text Legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-[#0e0e0e]/60 to-transparent transition-opacity duration-300 group-hover:from-black/95 group-hover:via-black/75" />

            {/* Card Editorial Content */}
            <div className="relative z-10 flex flex-col justify-end">
              <h3 className="text-lg sm:text-xl font-bold uppercase tracking-tight text-white font-montserrat mb-2 group-hover:text-amber-400 transition-colors duration-300">
                {service.title}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed mb-5 line-clamp-2">
                {service.subtitle}
              </p>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-amber-500 group-hover:text-amber-400 transition-all duration-300">
                <span>VIEW WORK</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
