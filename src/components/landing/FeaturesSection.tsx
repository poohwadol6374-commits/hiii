"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

const features = [
  { icon: "🤖", key: "aiScheduling", color: "bg-google-blue-50 text-google-blue-600 border-google-blue-100" },
  { icon: "📊", key: "priorityIntelligence", color: "bg-google-green-50 text-google-green-600 border-google-green-100" },
  { icon: "🎯", key: "focusMode", color: "bg-google-red-50 text-google-red-600 border-google-red-100" },
  { icon: "💡", key: "smartRecommendations", color: "bg-google-yellow-50 text-google-yellow-700 border-google-yellow-100" },
  { icon: "📅", key: "calendarViews", color: "bg-google-blue-50 text-google-blue-600 border-google-blue-100" },
  { icon: "⚡", key: "quickCapture", color: "bg-google-green-50 text-google-green-600 border-google-green-100" },
];

export default function FeaturesSection() {
  const t = useTranslations("Landing.features");

  return (
    <section className="relative py-24 px-6 bg-white overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-google-blue-50/20 to-transparent" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 text-xs font-semibold text-google-blue-600 bg-google-blue-50 rounded-full mb-4 border border-google-blue-100">
            ✨ ฟีเจอร์ทั้งหมดใช้ฟรี
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-lumina-900 mb-4">{t("title")}</h2>
          <p className="text-lg text-lumina-500 max-w-2xl mx-auto">{t("subtitle")}</p>
        </motion.div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -4, boxShadow: "0 12px 40px rgba(0,0,0,0.08)" }}
              className="group bg-white rounded-2xl p-6 border border-lumina-100 transition-all cursor-default"
              style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
            >
              <div className={`w-12 h-12 rounded-xl ${f.color} border flex items-center justify-center text-xl mb-4 transition-transform group-hover:scale-110`}>
                {f.icon}
              </div>
              <h3 className="text-base font-semibold text-lumina-900 mb-2">
                {t(`${f.key}.title`)}
              </h3>
              <p className="text-sm text-lumina-500 leading-relaxed">
                {t(`${f.key}.description`)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
