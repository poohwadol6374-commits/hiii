"use client";

import { motion } from "framer-motion";
import LumaAvatar from "@/components/landing/LumaAvatar";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-12">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-google-blue-50/60 via-transparent to-transparent" />

      {/* Floating orbs */}
      <motion.div
        className="pointer-events-none absolute left-1/4 top-1/4 h-72 w-72 rounded-full bg-google-blue-200/20 blur-3xl"
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-google-green-200/15 blur-3xl"
        animate={{ x: [0, -25, 0], y: [0, 25, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 flex w-full max-w-md flex-col items-center">
        {/* Luma Avatar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <LumaAvatar size={72} />
        </motion.div>

        {children}
      </div>
    </div>
  );
}
