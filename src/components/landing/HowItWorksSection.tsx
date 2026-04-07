"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

const steps = [
  {
    key: "step1",
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
    ),
    color: "from-google-blue-400 to-google-blue-600",
    ring: "ring-google-blue-100",
  },
  {
    key: "step2",
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
      </svg>
    ),
    color: "from-google-yellow-400 to-google-yellow-600",
    ring: "ring-google-yellow-100",
  },
  {
    key: "step3",
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
    color: "from-google-green-400 to-google-green-600",
    ring: "ring-google-green-100",
  },
];

export default function HowItWorksSection() {
  const t = useTranslations("Landing.howItWorks");

  return (
    <section
      className="bg-lumina-50 px-6 py-24"
      aria-label="How it works"
      id="how-it-works"
    >
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

        <div className="grid gap-12 md:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={step.key}
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              {/* Step number + icon */}
              <div className="relative mb-6">
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${step.color} text-white shadow-elevated ring-4 ${step.ring}`}
                >
                  {step.icon}
                </div>
                <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-xs font-bold text-lumina-700 shadow-card">
                  {i + 1}
                </span>
              </div>

              <h3 className="mb-2 text-xl font-semibold text-lumina-900">
                {t(`${step.key}.title`)}
              </h3>
              <p className="text-sm leading-relaxed text-lumina-500">
                {t(`${step.key}.description`)}
              </p>

              {/* Connector line (hidden on last item and mobile) */}
              {i < steps.length - 1 && (
                <div className="mt-8 hidden h-0.5 w-full bg-gradient-to-r from-transparent via-lumina-200 to-transparent md:block" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
