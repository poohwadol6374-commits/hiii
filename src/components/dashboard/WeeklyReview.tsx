"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useTaskStore } from "@/stores/taskStore";

// Mock time-per-category data (in hours)
const categoryData = [
  { key: "Work", hours: 12.5, color: "bg-google-blue-500" },
  { key: "Development", hours: 8.0, color: "bg-google-green-500" },
  { key: "Design", hours: 5.5, color: "bg-google-yellow-500" },
  { key: "Personal", hours: 3.0, color: "bg-google-red-400" },
  { key: "Meeting", hours: 6.0, color: "bg-lumina-400" },
];

export default function WeeklyReview() {
  const t = useTranslations("WeeklyReview");
  const tasks = useTaskStore((s) => s.tasks);

  const { completed, total, streakDays } = useMemo(() => {
    const comp = tasks.filter((t) => t.status === "completed").length;
    return { completed: comp, total: tasks.length, streakDays: 5 };
  }, [tasks]);

  const completionPct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const maxHours = Math.max(...categoryData.map((c) => c.hours));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 24, delay: 0.1 }}
      className="rounded-2xl border border-lumina-100 dark:border-lumina-800 bg-white dark:bg-lumina-900 p-5"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-google-green-400 to-google-green-600 flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 7L5.5 10.5L12 3.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className="text-base font-semibold text-lumina-900 dark:text-lumina-100">{t("title")}</h2>
        <span className="ml-auto text-[11px] text-lumina-400 font-medium">{t("thisWeek")}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Completion rate */}
        <div className="flex flex-col items-center justify-center bg-lumina-50/80 dark:bg-lumina-800/60 rounded-xl p-4">
          <div className="relative w-20 h-20 mb-2">
            <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
              <circle cx="40" cy="40" r="34" fill="none" stroke="#EBEDF0" strokeWidth="6" />
              <motion.circle
                cx="40" cy="40" r="34"
                fill="none"
                stroke="#34A853"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 34}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 34 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 34 * (1 - completionPct / 100) }}
                transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-lumina-900 dark:text-lumina-100">{completionPct}%</span>
            </div>
          </div>
          <p className="text-xs font-semibold text-lumina-700 dark:text-lumina-300">{t("completionRate")}</p>
          <p className="text-[11px] text-lumina-400">{t("tasksCompleted", { completed, total })}</p>
        </div>

        {/* Time by category */}
        <div className="bg-lumina-50/80 dark:bg-lumina-800/60 rounded-xl p-4">
          <h3 className="text-xs font-semibold text-lumina-500 dark:text-lumina-400 uppercase tracking-wider mb-3">
            {t("timeByCategory")}
          </h3>
          <div className="flex flex-col gap-2">
            {categoryData.map((cat, i) => (
              <div key={cat.key} className="flex items-center gap-2">
                <span className="text-[11px] text-lumina-500 w-16 truncate">{cat.key}</span>
                <div className="flex-1 h-2 bg-lumina-200 dark:bg-lumina-700 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${cat.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${(cat.hours / maxHours) * 100}%` }}
                    transition={{ duration: 0.6, delay: 0.5 + i * 0.08, ease: "easeOut" }}
                  />
                </div>
                <span className="text-[10px] text-lumina-400 w-8 text-right">
                  {cat.hours}{t("hours")}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Streak + Luma recommendation */}
        <div className="flex flex-col gap-3">
          {/* Streak */}
          <div className="bg-lumina-50/80 dark:bg-lumina-800/60 rounded-xl p-4 flex items-center gap-3">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.6 }}
              className="text-2xl"
            >
              🔥
            </motion.div>
            <div>
              <p className="text-sm font-bold text-lumina-900 dark:text-lumina-100">{t("streakDays", { days: streakDays })}</p>
              <p className="text-[11px] text-lumina-400">{t("streakMessage")}</p>
            </div>
          </div>

          {/* Luma recommendation */}
          <div className="bg-gradient-to-br from-google-blue-50 to-google-blue-100/50 rounded-xl p-4 flex-1">
            <div className="flex items-center gap-1.5 mb-1.5">
              <div className="w-5 h-5 rounded-full bg-google-blue-500 flex items-center justify-center">
                <span className="text-white text-[8px] font-bold">L</span>
              </div>
              <p className="text-[11px] font-semibold text-google-blue-700">{t("lumaRecommendation")}</p>
            </div>
            <p className="text-[11px] text-google-blue-600 leading-relaxed">
              {t("recommendationText")}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
