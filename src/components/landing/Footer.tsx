"use client";

import { useTranslations } from "next-intl";
import LumaLogo from "./LumaLogo";

export default function Footer() {
  const t = useTranslations("Landing.footer");

  return (
    <footer className="bg-white border-t border-lumina-100 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <LumaLogo size={32} />
              <span className="text-lg font-bold text-lumina-900">Lumina</span>
            </div>
            <p className="text-sm text-lumina-500 leading-relaxed mb-4">
              {t("brandDesc")}
            </p>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-lumina-900 uppercase tracking-wider mb-4">{t("product")}</h4>
            <ul className="space-y-2.5">
              <li><a href="#features" className="text-sm text-lumina-500 hover:text-lumina-900 transition-colors underline-slide">{t("features")}</a></li>
              <li><a href="#" className="text-sm text-lumina-500 hover:text-lumina-900 transition-colors underline-slide">{t("changelog")}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-lumina-900 uppercase tracking-wider mb-4">{t("company")}</h4>
            <ul className="space-y-2.5">
              <li><a href="#" className="text-sm text-lumina-500 hover:text-lumina-900 transition-colors underline-slide">{t("about")}</a></li>
              <li><a href="#" className="text-sm text-lumina-500 hover:text-lumina-900 transition-colors underline-slide">{t("blog")}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-lumina-900 uppercase tracking-wider mb-4">{t("support")}</h4>
            <ul className="space-y-2.5">
              <li><a href="#" className="text-sm text-lumina-500 hover:text-lumina-900 transition-colors underline-slide">{t("helpCenter")}</a></li>
              <li><a href="#" className="text-sm text-lumina-500 hover:text-lumina-900 transition-colors underline-slide">{t("contact")}</a></li>
              <li><a href="#" className="text-sm text-lumina-500 hover:text-lumina-900 transition-colors underline-slide">{t("privacy")}</a></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-lumina-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-lumina-400">{t("copyright")}</p>
          <p className="text-xs text-lumina-400">{t("madeWith")}</p>
        </div>
      </div>
    </footer>
  );
}
