"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import LumaLogo from "@/components/landing/LumaLogo";

const navItems = [
  {
    key: "dashboard",
    href: "/dashboard",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="11" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="2" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="11" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    key: "calendar",
    href: "/calendar",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="3" width="16" height="15" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M2 7H18" stroke="currentColor" strokeWidth="1.5" />
        <path d="M6 1V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M14 1V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="7" cy="11" r="1" fill="currentColor" />
        <circle cx="10" cy="11" r="1" fill="currentColor" />
        <circle cx="13" cy="11" r="1" fill="currentColor" />
        <circle cx="7" cy="14" r="1" fill="currentColor" />
        <circle cx="10" cy="14" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    key: "tasks",
    href: "/tasks",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 5L5 7L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M11 5H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M3 10L5 12L8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M11 10H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M3 15L5 17L8 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M11 15H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: "analytics",
    href: "/analytics",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="10" width="4" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <rect x="8" y="6" width="4" height="12" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <rect x="14" y="2" width="4" height="16" rx="1" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    key: "goals",
    href: "/goals",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="10" cy="10" r="5" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="10" cy="10" r="2" fill="currentColor" />
      </svg>
    ),
  },
  {
    key: "tags",
    href: "/tags",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 5C2 3.89543 2.89543 3 4 3H9.17157C9.70201 3 10.2107 3.21071 10.5858 3.58579L17.4142 10.4142C18.1953 11.1953 18.1953 12.4616 17.4142 13.2426L13.2426 17.4142C12.4616 18.1953 11.1953 18.1953 10.4142 17.4142L3.58579 10.5858C3.21071 10.2107 3 9.70201 3 9.17157V5Z" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="6.5" cy="6.5" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    key: "settings",
    href: "/settings",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10 1.5V3.5M10 16.5V18.5M18.5 10H16.5M3.5 10H1.5M16 4L14.5 5.5M5.5 14.5L4 16M16 16L14.5 14.5M5.5 5.5L4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function Sidebar() {
  const [expanded, setExpanded] = useState(false);
  const t = useTranslations("App.sidebar");
  const pathname = usePathname();

  return (
    <motion.aside
      className="hidden md:flex flex-col items-center bg-white/95 dark:bg-lumina-900/95 backdrop-blur-xl border-r border-lumina-200/40 dark:border-lumina-800/40 py-4 z-30 h-full"
      animate={{ width: expanded ? 200 : 64 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{ boxShadow: "1px 0 8px rgba(0,0,0,0.03)" }}
    >
      {/* Logo */}
      <div className="mb-6 flex items-center justify-center w-full px-3">
        <motion.div
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="flex-shrink-0"
        >
          <LumaLogo size={36} />
        </motion.div>
        <AnimatePresence>
          {expanded && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="ml-2.5 font-semibold text-lumina-900 dark:text-lumina-100 text-sm whitespace-nowrap overflow-hidden"
            >
              Lumina
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 flex flex-col gap-1 w-full px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link key={item.key} href={item.href}>
              <motion.div
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors cursor-pointer group relative ${
                  isActive
                    ? "bg-pink-50 text-pink-600 dark:bg-pink-900/30 dark:text-pink-300"
                    : "text-lumina-500 hover:bg-lumina-100 hover:text-lumina-800 dark:hover:bg-lumina-800 dark:hover:text-lumina-200"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                <div className="flex-shrink-0 w-5 h-5">{item.icon}</div>
                <AnimatePresence>
                  {expanded && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      className="text-sm font-medium whitespace-nowrap overflow-hidden"
                    >
                      {t(item.key)}
                    </motion.span>
                  )}
                </AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full gradient-bg"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Sign Out */}
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="mt-1 mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 w-[calc(100%-16px)] mx-2 text-lumina-400 hover:text-google-red-500 hover:bg-google-red-50 dark:hover:bg-google-red-900/20 transition-colors"
        aria-label={t("signOut")}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="flex-shrink-0">
          <path d="M7 17H4C3.44772 17 3 16.5523 3 16V4C3 3.44772 3.44772 3 4 3H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M13 14L17 10L13 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M17 10H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <AnimatePresence>
          {expanded && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="text-sm font-medium whitespace-nowrap overflow-hidden"
            >
              {t("signOut")}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* Toggle Button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-2 flex items-center justify-center w-8 h-8 rounded-lg text-lumina-400 hover:text-lumina-700 hover:bg-lumina-100 dark:hover:bg-lumina-800 dark:hover:text-lumina-200 transition-colors"
        aria-label={expanded ? t("collapse") : t("expand")}
        suppressHydrationWarning
      >
        <motion.svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </motion.svg>
      </button>
    </motion.aside>
  );
}
