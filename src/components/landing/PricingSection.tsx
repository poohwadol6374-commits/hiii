"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export default function PricingSection() {
  const t = useTranslations("Landing.pricing");

  const freeFeatures = t.raw("free.features") as string[];
  const proFeatures = t.raw("pro.features") as string[];

  return (
    <section className="px-6 py-24" aria-label="Pricing" id="pricing">
      <div className="mx-auto max-w-5xl">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-lumina-900 sm:text-5xl">
            {t("title")}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-lumina-500">
            {t("subtitle")}
          </p>
        </motion.div>

        <div className="grid items-start gap-8 md:grid-cols-2">
          {/* Free Tier */}
          <motion.div
            className="rounded-2xl border border-lumina-200 bg-white p-8 shadow-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
          >
            <h3 className="mb-1 text-xl font-semibold text-lumina-900">
              {t("free.name")}
            </h3>
            <p className="mb-6 text-sm text-lumina-500">
              {t("free.description")}
            </p>
            <div className="mb-6 flex items-baseline">
              <span className="text-4xl font-bold text-lumina-900">
                {t("free.price")}
              </span>
              <span className="ml-1 text-lumina-500">{t("free.period")}</span>
            </div>
            <ul className="mb-8 space-y-3" role="list">
              {freeFeatures.map((feature: string) => (
                <li
                  key={feature}
                  className="flex items-start gap-3 text-sm text-lumina-600"
                >
                  <svg
                    className="mt-0.5 h-4 w-4 shrink-0 text-google-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m4.5 12.75 6 6 9-13.5"
                    />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            <a
              href="/signup"
              className="block w-full rounded-full border border-lumina-200 bg-white py-3 text-center text-sm font-semibold text-lumina-700 transition-all hover:border-lumina-300 hover:bg-lumina-50 hover:shadow-card focus:outline-none focus:ring-2 focus:ring-google-blue-500 focus:ring-offset-2"
              role="button"
              aria-label={t("free.cta")}
            >
              {t("free.cta")}
            </a>
          </motion.div>

          {/* Pro Tier */}
          <motion.div
            className="relative rounded-2xl border-2 border-google-blue-500/30 bg-white p-8 shadow-elevated"
            style={{
              boxShadow:
                "0 0 40px rgba(66, 133, 244, 0.08), 0 4px 16px rgba(0, 0, 0, 0.08)",
            }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
          >
            {/* Badge */}
            <span className="absolute -top-3 right-6 rounded-full bg-google-blue-500 px-4 py-1 text-xs font-semibold text-white shadow-soft">
              {t("pro.badge")}
            </span>

            <h3 className="mb-1 text-xl font-semibold text-lumina-900">
              {t("pro.name")}
            </h3>
            <p className="mb-6 text-sm text-lumina-500">
              {t("pro.description")}
            </p>
            <div className="mb-6 flex items-baseline">
              <span className="text-4xl font-bold text-lumina-900">
                {t("pro.price")}
              </span>
              <span className="ml-1 text-lumina-500">{t("pro.period")}</span>
            </div>
            <ul className="mb-8 space-y-3" role="list">
              {proFeatures.map((feature: string) => (
                <li
                  key={feature}
                  className="flex items-start gap-3 text-sm text-lumina-600"
                >
                  <svg
                    className="mt-0.5 h-4 w-4 shrink-0 text-google-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m4.5 12.75 6 6 9-13.5"
                    />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            <a
              href="/signup"
              className="block w-full rounded-full bg-google-blue-500 py-3 text-center text-sm font-semibold text-white shadow-elevated transition-all hover:bg-google-blue-600 hover:shadow-modal focus:outline-none focus:ring-2 focus:ring-google-blue-500 focus:ring-offset-2"
              role="button"
              aria-label={t("pro.cta")}
            >
              {t("pro.cta")}
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
