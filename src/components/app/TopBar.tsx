"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import TaskCreateModal from "@/components/tasks/TaskCreateModal";
import { usePomodoroStore } from "@/stores/pomodoroStore";

export default function TopBar() {
  const t = useTranslations("App");
  const [createOpen, setCreateOpen] = useState(false);
  const togglePomodoro = usePomodoroStore((s) => s.toggleOpen);
  const pomoStatus = usePomodoroStore((s) => s.status);

  return (
    <>
      <header
        className="flex items-center justify-between h-14 px-4 md:px-6 bg-white/80 backdrop-blur-xl border-b border-lumina-200/60 z-20"
        style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.03)" }}
      >
        {/* Left: Search */}
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative flex-1 hidden sm:block">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-lumina-400"
              width="16" height="16" viewBox="0 0 16 16" fill="none"
            >
              <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M11 11L14.5 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder={t("search")}
              className="w-full pl-9 pr-4 py-2 text-sm bg-lumina-100/80 rounded-xl border-none outline-none focus:ring-2 focus:ring-google-blue-200 focus:bg-white transition-all placeholder:text-lumina-400"
              readOnly
            />
          </div>
        </div>

        {/* Center: Quick Capture (hidden on mobile) */}
        <div className="hidden lg:flex items-center flex-1 max-w-sm mx-4">
          <div className="relative w-full">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-lumina-400"
              width="14" height="14" viewBox="0 0 14 14" fill="none"
            >
              <path d="M7 1V13M1 7H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder={t("quickCapture")}
              className="w-full pl-9 pr-4 py-2 text-sm bg-google-blue-50/50 rounded-xl border border-google-blue-100 outline-none focus:ring-2 focus:ring-google-blue-200 focus:bg-white transition-all placeholder:text-lumina-400"
              readOnly
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Pomodoro Timer Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={togglePomodoro}
            className={`relative p-2 rounded-xl transition-colors ${
              pomoStatus !== "idle"
                ? "text-google-red-500 bg-google-red-50 hover:bg-google-red-100"
                : "text-lumina-500 hover:bg-lumina-100 hover:text-lumina-700"
            }`}
            aria-label="Pomodoro Timer"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
              <path d="M9 6V10L11.5 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M7 2H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            {pomoStatus !== "idle" && (
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-google-red-500 rounded-full animate-pulse" />
            )}
          </motion.button>

          {/* Add Task Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCreateOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-google-blue-500 text-white text-sm font-medium rounded-xl hover:bg-google-blue-600 transition-colors shadow-sm"
            aria-label={t("addTask")}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1V13M1 7H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="hidden sm:inline">{t("addTask")}</span>
          </motion.button>

          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-2 rounded-xl text-lumina-500 hover:bg-lumina-100 hover:text-lumina-700 transition-colors"
            aria-label={t("notifications")}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M13.5 6.75C13.5 5.5576 13.0259 4.41403 12.182 3.56802C11.338 2.72202 10.1935 2.24609 9 2.24609C7.80653 2.24609 6.66193 2.72202 5.81802 3.56802C4.97411 4.41403 4.5 5.5576 4.5 6.75C4.5 12 2.25 13.5 2.25 13.5H15.75C15.75 13.5 13.5 12 13.5 6.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M10.2975 15.75C10.1657 15.9773 9.97642 16.166 9.74878 16.2971C9.52114 16.4283 9.26287 16.4973 9 16.4973C8.73713 16.4973 8.47886 16.4283 8.25122 16.2971C8.02358 16.166 7.83434 15.9773 7.7025 15.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {/* Badge */}
            <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-google-red-500 rounded-full">
              3
            </span>
          </motion.button>

          {/* Profile Avatar */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-google-blue-400 to-google-blue-600 text-white text-xs font-bold"
            aria-label={t("profile")}
          >
            U
          </motion.button>
        </div>
      </header>

      {/* Task Create Modal — triggered from TopBar */}
      <TaskCreateModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </>
  );
}
