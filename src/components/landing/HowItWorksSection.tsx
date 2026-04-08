"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

const steps = [
  { num: "01", icon: "📝", color: "from-google-blue-500 to-google-blue-600" },
  { num: "02", icon: "🤖", color: "from-google-green-500 to-google-green-600" },
  { num: "03", icon: "✨", color: "from-google-yellow-500 to-google-yellow-600" },
];

export default function HowItWorksSection() {
  const t = useTranslations("Landing.howItWorks");

  return (
    <section className="relative py-24 px-6 bg-lumina-50/50 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-lumina-900 mb-4">{t("title")}</h2>
          <p className="text-lg text-lumina-500 max-w-xl mx-auto">{t("subtitle")}</p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting line (desktop) */}
          <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-px bg-gradient-to-r from-google-blue-200 via-google-green-200 to-google-yellow-200" />

          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="flex flex-col items-center text-center relative"
            >
              {/* Number circle */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-2xl text-white shadow-lg mb-6 relative z-10`}
              >
                {step.icon}
              </motion.div>

              <span className="text-[11px] font-bold text-google-blue-500 uppercase tracking-widest mb-2">
                Step {step.num}
              </span>
              <h3 className="text-lg font-semibold text-lumina-900 mb-2">
                {t(`step${i + 1}.title`)}
              </h3>
              <p className="text-sm text-lumina-500 leading-relaxed max-w-xs">
                {t(`step${i + 1}.description`)}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-16"
        >
          <motion.a
            href="/signup"
            whileHover={{ scale: 1.04, boxShadow: "0 8px 30px rgba(66,133,244,0.25)" }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 gradient-bg text-white px-8 py-4 rounded-full text-base font-semibold shadow-lg transition-all"
          >
            เริ่มใช้งาน
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
