"use client";

import { motion } from "framer-motion";
import LumaLogo from "./LumaLogo";

export default function LumaAvatar({ size = 96 }: { size?: number }) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Outer glow ring */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-30 blur-xl"
        style={{ background: "linear-gradient(135deg, #E08A5E, #C76B8F, #9B7EC8, #7BA4D4)" }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.25, 0.4, 0.25],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      {/* Main avatar */}
      <motion.div
        className="relative"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
      >
        <LumaLogo size={size} />
      </motion.div>
    </div>
  );
}
