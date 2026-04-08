"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import LumaLogo from "./LumaLogo";

export default function CtaSection() {
  const t = useTranslations("Landing.hero");

  return (
    <section className="relative py-24 px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-600 via-pink-700 to-pink-800" />

      {/* Decorative orbs */}
      <motion.div
        className="pointer-events-none absolute -top-20 -left-20 w-80 h-80 rounded-full bg-white/5 blur-3xl"
        animate={{ x: [0, 20, 0], y: [0, -10, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-white/5 blur-3xl"
        animate={{ x: [0, -15, 0], y: [0, 15, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="mb-8 inline-block"
        >
          <LumaLogo size={64} />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight"
        >
          พร้อมจัดการเวลา
          <br />
          อย่างชาญฉลาดแล้วหรือยัง?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg text-white/70 mb-10 max-w-lg mx-auto"
        >
          เริ่มต้นใช้ Lumina วันนี้ แล้วให้ Luma ช่วยจัดตารางงานให้คุณ
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.a
            href="/signup"
            whileHover={{ scale: 1.05, boxShadow: "0 8px 30px rgba(0,0,0,0.2)" }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 bg-white text-pink-600 px-10 py-4 rounded-full text-base font-semibold shadow-lg transition-all"
          >
            {t("signUp")}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.a>
          <motion.a
            href="/signin"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center px-10 py-4 rounded-full text-base font-semibold text-white/90 border border-white/20 hover:bg-white/10 transition-all"
          >
            {t("signIn")}
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
