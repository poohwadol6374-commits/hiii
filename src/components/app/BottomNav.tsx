"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import TaskCreateModal from "@/components/tasks/TaskCreateModal";

const navItems = [
  {
    key: "dashboard",
    href: "/dashboard",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
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
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="2" y="3" width="16" height="15" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M2 7H18" stroke="currentColor" strokeWidth="1.5" />
        <path d="M6 1V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M14 1V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: "add",
    href: "#",
    isCenter: true,
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M11 3V19M3 11H19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: "tasks",
    href: "/tasks",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
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
    key: "luma",
    href: "#",
    icon: (
      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-google-blue-400 to-google-blue-600 flex items-center justify-center">
        <span className="text-white text-[8px] font-bold">L</span>
      </div>
    ),
  },
];

export default function BottomNav() {
  const t = useTranslations("App.bottomNav");
  const pathname = usePathname();
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <>
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-lumina-900/90 backdrop-blur-xl border-t border-lumina-200/60 dark:border-lumina-800/60 px-2 pb-[env(safe-area-inset-bottom)]"
      style={{ boxShadow: "0 -2px 12px rgba(0,0,0,0.04)" }}
    >
      <div className="flex items-center justify-around h-14">
        {navItems.map((item) => {
          const isActive = item.href !== "#" && (pathname === item.href || pathname.startsWith(item.href + "/"));
          const isCenter = "isCenter" in item && item.isCenter;

          if (isCenter) {
            return (
              <motion.button
                key={item.key}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setCreateOpen(true)}
                className="flex items-center justify-center w-12 h-12 -mt-4 rounded-2xl bg-google-blue-500 text-white shadow-lg"
                style={{ boxShadow: "0 4px 16px rgba(66, 133, 244, 0.35)" }}
                aria-label={t(item.key)}
              >
                {item.icon}
              </motion.button>
            );
          }

          const content = (
            <>
              <div className="relative">
                {item.icon}
                {isActive && (
                  <motion.div
                    layoutId="bottom-nav-active"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-google-blue-500"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </div>
              <span className="text-[10px] font-medium">{t(item.key)}</span>
            </>
          );

          const className = `flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-colors ${
            isActive ? "text-google-blue-600" : "text-lumina-400"
          }`;

          if (item.href === "#") {
            return (
              <button key={item.key} className={className}>
                {content}
              </button>
            );
          }

          return (
            <Link key={item.key} href={item.href} className={className}>
              {content}
            </Link>
          );
        })}
      </div>
    </nav>
    <TaskCreateModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </>
  );
}
