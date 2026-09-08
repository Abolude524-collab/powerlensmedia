"use client";

import { motion } from "framer-motion";

interface TypewriterProps {
  text: string;
  className?: string;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.2,
      staggerChildren: 0.03,
    },
  },
};

const characterVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export default function Typewriter({ text, className = "" }: TypewriterProps) {
  return (
    <motion.span
      aria-label={text}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`block w-full ${className}`}
    >
      {Array.from(text).map((character, index) => (
        <motion.span key={`${character}-${index}`} variants={characterVariants} aria-hidden="true">
          {character}
        </motion.span>
      ))}
    </motion.span>
  );
}