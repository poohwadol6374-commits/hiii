"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import LumaLogo from "./LumaLogo";

export default function HeroSection() {
  const t = useTranslations("Landing.hero");

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-24" aria-label="Hero">
      {/* Pure white base with very subtle warm gradient */}
      <div className="pointer-events-none absolute inset-0 bg-white" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-google-blue-50/30 via-transparent to-transparent" />

      {/* Soft ambient orbs */}
      <motion.div className="pointer-events-none absolute left-[15%] top-[20%] h-[500px] w-[500px] rounded-full bg-google-blue-100/25 blur-[120px]"
        animate={{ x: [0, 20, 0], y: [0, -15, 0] }} transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="pointer-events-none absolute right-[10%] top-[30%] h-[400px] w-[400px] rounded-full bg-google-green-100/20 blur-[100px]"
        animate={{ x: [0, -15, 0], y: [0, 20, 0] }} transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="pointer-events-none absolute bottom-[15%] left-[30%] h-[350px] w-[350px] rounded-full bg-google-yellow-100/15 blur-[100px]"
        animate={{ x: [0, 15, 0], y: [0, -10, 0] }} transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="pointer-events-none absolute right-[25%] bottom-[25%] h-[300px] w-[300px] rounded-full bg-google-red-100/10 blur-[80px]"
        animate={{ x: [0, -10, 0], y: [0, 12, 0] }} transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }} />

      <div className="relative z-10 flex max-w-3xl flex-col items-center text-center">
        {/* Logo with entrance */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 150, damping: 18, delay: 0.1 }}
          className="mb-10 relative"
        >
          {/* Glow behind logo */}
          <div className="absolute inset-0 rounded-3xl blur-2xl opacity-25"
            style={{ background: "linear-gradient(135deg, #4285F4, #1A73E8)", transform: "scale(1.5)" }} />
          <LumaLogo size={100} />
        </motion.div>

        {/* Title with gradient */}
        <motion.h1
          className="mb-5 text-6xl font-bold tracking-tight sm:text-8xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
        >
          <span className="text-lumina-900">Lum</span>
          <span className="gradient-text">ina</span>
        </motion.h1>

        {/* Tagline with gradient text */}
        <motion.p
          className="mb-5 text-xl font-semibold sm:text-2xl gradient-text"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          {t("tagline")}
        </motion.p>

        {/* Description */}
        <motion.p
          className="mb-12 max-w-lg text-base leading-relaxed text-lumina-500 sm:text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
        >
          {t("description")}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col gap-4 sm:flex-row"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
        >
          <motion.a
            href="/signup"
            whileHover={{ scale: 1.04, boxShadow: "0 8px 30px rgba(66,133,244,0.25)" }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center justify-center rounded-full gradient-bg px-10 py-4 text-base font-semibold text-white shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-google-blue-400 focus:ring-offset-2"
            role="button"
          >
            {t("signUp")}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="ml-2">
              <path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.a>
          <motion.a
            href="/signin"
            whileHover={{ scale: 1.04, backgroundColor: "rgba(0,0,0,0.02)" }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center justify-center rounded-full border border-lumina-200 bg-white/80 backdrop-blur-sm px-10 py-4 text-base font-semibold text-lumina-700 shadow-sm transition-all hover:border-lumina-300 focus:outline-none focus:ring-2 focus:ring-google-blue-400 focus:ring-offset-2"
            role="button"
          >
            {t("signIn")}
          </motion.a>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          className="mt-16 flex items-center gap-6 text-lumina-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1L10 5.5L15 6L11.5 9.5L12.5 14.5L8 12L3.5 14.5L4.5 9.5L1 6L6 5.5L8 1Z" fill="currentColor" /></svg>
            <span className="text-xs font-medium">4.9/5 Rating</span>
          </div>
          <div className="h-4 w-px bg-lumina-200" />
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" /><path d="M5 8L7 10L11 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <span className="text-xs font-medium">Free to start</span>
          </div>
          <div className="h-4 w-px bg-lumina-200" />
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2V5M8 11V14M14 8H11M5 8H2M12.2 3.8L10.1 5.9M5.9 10.1L3.8 12.2M12.2 12.2L10.1 10.1M5.9 5.9L3.8 3.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            <span className="text-xs font-medium">AI-powered</span>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ opacity: { delay: 1.5 }, y: { duration: 2, repeat: Infinity, ease: "easeInOut" } }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-lumina-300">
          <path d="M12 5V19M12 19L6 13M12 19L18 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>
    </section>
  );
}
