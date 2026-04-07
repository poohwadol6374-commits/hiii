"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import LumaAvatar from "./LumaAvatar";

export default function HeroSection() {
  const t = useTranslations("Landing.hero");

  return (
    <section
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-24"
      aria-label="Hero"
    >
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

      <div className="relative z-10 flex max-w-3xl flex-col items-center text-center">
        {/* Luma Avatar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <LumaAvatar size={96} />
        </motion.div>

        {/* Title */}
        <motion.h1
          className="mb-4 text-6xl font-bold tracking-tight text-lumina-900 sm:text-7xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          {t("title")}
        </motion.h1>

        {/* Tagline */}
        <motion.p
          className="mb-4 text-xl font-medium text-google-blue-600 sm:text-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {t("tagline")}
        </motion.p>

        {/* Description */}
        <motion.p
          className="mb-10 max-w-xl text-lg text-lumina-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
        >
          {t("description")}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col gap-4 sm:flex-row"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <a
            href="/signup"
            className="inline-flex items-center justify-center rounded-full bg-google-blue-500 px-8 py-3.5 text-base font-semibold text-white shadow-elevated transition-all hover:bg-google-blue-600 hover:shadow-modal focus:outline-none focus:ring-2 focus:ring-google-blue-500 focus:ring-offset-2"
            role="button"
            aria-label={t("signUp")}
          >
            {t("signUp")}
          </a>
          <a
            href="/signin"
            className="inline-flex items-center justify-center rounded-full border border-lumina-200 bg-white px-8 py-3.5 text-base font-semibold text-lumina-700 shadow-soft transition-all hover:border-lumina-300 hover:bg-lumina-50 hover:shadow-card focus:outline-none focus:ring-2 focus:ring-google-blue-500 focus:ring-offset-2"
            role="button"
            aria-label={t("signIn")}
          >
            {t("signIn")}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
