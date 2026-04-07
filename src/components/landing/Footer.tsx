"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import LumaAvatar from "./LumaAvatar";

export default function Footer() {
  const t = useTranslations("Landing.footer");

  const columns = [
    {
      title: t("product"),
      links: [
        { label: t("features"), href: "#features" },
        { label: t("pricing"), href: "#pricing" },
        { label: t("changelog"), href: "#" },
      ],
    },
    {
      title: t("company"),
      links: [
        { label: t("about"), href: "#" },
        { label: t("blog"), href: "#" },
        { label: t("careers"), href: "#" },
      ],
    },
    {
      title: t("support"),
      links: [
        { label: t("helpCenter"), href: "#" },
        { label: t("contact"), href: "#" },
        { label: t("privacy"), href: "#" },
      ],
    },
  ];

  return (
    <footer
      className="border-t border-lumina-200 bg-white px-6 py-16"
      role="contentinfo"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="grid gap-12 md:grid-cols-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
        >
          {/* Brand */}
          <div>
            <div className="mb-4 flex items-center gap-3">
              <LumaAvatar size={32} />
              <span className="text-lg font-bold text-lumina-900">Lumina</span>
            </div>
            <p className="text-sm leading-relaxed text-lumina-500">
              {t("madeWith")}
            </p>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="mb-4 text-sm font-semibold text-lumina-900">
                {col.title}
              </h4>
              <ul className="space-y-2.5" role="list">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-lumina-500 transition-colors hover:text-lumina-700 focus:outline-none focus:underline"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </motion.div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-lumina-100 pt-8 text-center">
          <p className="text-xs text-lumina-400">{t("copyright")}</p>
        </div>
      </div>
    </footer>
  );
}
