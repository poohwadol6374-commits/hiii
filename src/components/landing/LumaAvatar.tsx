"use client";

import { motion } from "framer-motion";

export default function LumaAvatar({ size = 96 }: { size?: number }) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Outer glow ring */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-br from-google-blue-300 to-google-blue-500 opacity-30 blur-xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      {/* Main avatar circle */}
      <motion.div
        className="relative flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-google-blue-400 to-google-blue-600"
        style={{ boxShadow: "0 0 40px rgba(66, 133, 244, 0.3)" }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
      >
        {/* Inner light effect */}
        <div className="absolute inset-1 rounded-full bg-gradient-to-br from-white/20 to-transparent" />
        <span
          className="relative font-bold text-white"
          style={{ fontSize: size * 0.38 }}
        >
          L
        </span>
      </motion.div>
    </div>
  );
}
