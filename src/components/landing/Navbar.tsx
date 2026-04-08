"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LumaLogo from "./LumaLogo";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const links = [
    { label: "ฟีเจอร์", href: "#features" },
    { label: "วิธีใช้งาน", href: "#how-it-works" },
  ];

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-xl border-b border-lumina-200/40 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5">
          <LumaLogo size={30} />
          <span className="text-lg font-bold text-lumina-900">Lumina</span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a key={link.href} href={link.href}
              className="text-sm font-medium text-lumina-500 hover:text-lumina-900 transition-colors">
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a href="/signin" className="text-sm font-medium text-lumina-600 hover:text-lumina-900 transition-colors px-4 py-2">
            เข้าสู่ระบบ
          </a>
          <motion.a href="/signup" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            className="text-sm font-semibold text-white gradient-bg px-5 py-2.5 rounded-full shadow-sm hover:shadow-md transition-shadow">
            เริ่มต้นใช้งาน
          </motion.a>
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-lumina-600" aria-label="Menu">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            {mobileOpen ? (
              <path d="M5 5L17 17M17 5L5 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            ) : (
              <path d="M3 6H19M3 11H19M3 16H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/95 backdrop-blur-xl border-b border-lumina-200/40 overflow-hidden">
            <div className="px-6 py-4 space-y-3">
              {links.map((link) => (
                <a key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                  className="block text-sm font-medium text-lumina-600 hover:text-lumina-900 py-2">{link.label}</a>
              ))}
              <div className="pt-2 flex flex-col gap-2">
                <a href="/signin" className="text-sm font-medium text-lumina-600 text-center py-2.5 rounded-xl border border-lumina-200">เข้าสู่ระบบ</a>
                <a href="/signup" className="text-sm font-semibold text-white text-center gradient-bg py-2.5 rounded-xl">เริ่มต้นใช้งาน</a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
