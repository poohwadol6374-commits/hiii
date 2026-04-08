"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useTaskStore } from "@/stores/taskStore";

// ── Mock analytics data ──────────────────────────────────
const categoryTimeData = [
  { key: "categoryWork", hours: 14.5, color: "#4285F4", bg: "bg-google-blue-500" },
  { key: "categoryDevelopment", hours: 10.0, color: "#34A853", bg: "bg-google-green-500" },
  { key: "categoryDesign", hours: 6.5, color: "#FBBC05", bg: "bg-google-yellow-500" },
  { key: "categoryPersonal", hours: 4.0, color: "#EA4335", bg: "bg-google-red-500" },
  { key: "categoryMeeting", hours: 8.0, color: "#9AA0A9", bg: "bg-lumina-400" },
];

// Weekly activity heatmap: intensity 0-4 per day
const weeklyActivity = [
  { dayKey: "mon", intensity: 4 },
  { dayKey: "tue", intensity: 3 },
  { dayKey: "wed", intensity: 4 },
  { dayKey: "thu", intensity: 2 },
  { dayKey: "fri", intensity: 3 },
  { dayKey: "sat", intensity: 1 },
  { dayKey: "sun", intensity: 0 },
];

const intensityColors = [
  "bg-lumina-100",
  "bg-google-green-100",
  "bg-google-green-200",
  "bg-google-green-400",
  "bg-google-green-600",
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 260, damping: 24 },
  },
};

export default function AnalyticsPage() {
  const t = useTranslations("Analytics");
  const tasks = useTaskStore((s) => s.tasks);

  const { completed, total, streakDays, productivityScore } = useMemo(() => {
    const comp = tasks.filter((t) => t.status === "completed").length;
    const tot = tasks.length;
    const pct = tot > 0 ? comp / tot : 0;
    // Productivity score: weighted combo of completion + streak bonus
    const streak = 5; // mock
    const score = Math.min(100, Math.round(pct * 70 + streak * 6));
    return { completed: comp, total: tot, streakDays: streak, productivityScore: score };
  }, [tasks]);

  const completionPct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const maxHours = Math.max(...categoryTimeData.map((c) => c.hours));

  // Ring chart geometry
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference * (1 - completionPct / 100);

  return (
    <motion.div
      className="p-4 md:p-6 lg:p-8 max-w-5xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={cardVariants} className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-lumina-900 dark:text-lumina-100">{t("title")}</h1>
        <p className="text-sm text-lumina-500 dark:text-lumina-400 mt-0.5">{t("subtitle")}</p>
      </motion.div>

      {/* Top row: Completion ring + Productivity score + Streak */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Completion Rate Ring */}
        <motion.div
          variants={cardVariants}
          className="bg-white dark:bg-lumina-900 rounded-2xl p-5 border border-lumina-100 dark:border-lumina-800 flex flex-col items-center justify-center"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <div className="relative w-32 h-32 mb-3">
            <svg viewBox="0 0 128 128" className="w-full h-full -rotate-90">
              <circle
                cx="64" cy="64" r={radius}
                fill="none" stroke="#EBEDF0" strokeWidth="10"
              />
              <motion.circle
                cx="64" cy="64" r={radius}
                fill="none"
                stroke="#34A853"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: strokeOffset }}
                transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
                className="text-2xl font-bold text-lumina-900 dark:text-lumina-100"
              >
                {completionPct}%
              </motion.span>
            </div>
          </div>
          <p className="text-sm font-semibold text-lumina-800 dark:text-lumina-200">{t("completionRate")}</p>
          <p className="text-xs text-lumina-400 mt-0.5">
            {t("completionDesc", { completed, total })}
          </p>
        </motion.div>

        {/* Productivity Score */}
        <motion.div
          variants={cardVariants}
          className="bg-white dark:bg-lumina-900 rounded-2xl p-5 border border-lumina-100 dark:border-lumina-800 flex flex-col items-center justify-center"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <div className="relative w-32 h-32 mb-3">
            <svg viewBox="0 0 128 128" className="w-full h-full -rotate-90">
              <circle
                cx="64" cy="64" r={radius}
                fill="none" stroke="#EBEDF0" className="dark:stroke-lumina-800" strokeWidth="10"
              />
              <motion.circle
                cx="64" cy="64" r={radius}
                fill="none"
                stroke="#4285F4"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: circumference * (1 - productivityScore / 100) }}
                transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 }}
                className="text-2xl font-bold text-lumina-900 dark:text-lumina-100"
              >
                {productivityScore}
              </motion.span>
            </div>
          </div>
          <p className="text-sm font-semibold text-lumina-800 dark:text-lumina-200">{t("productivityScore")}</p>
          <p className="text-xs text-lumina-400 mt-0.5 text-center">{t("scoreDesc")}</p>
        </motion.div>

        {/* Streak */}
        <motion.div
          variants={cardVariants}
          className="bg-white dark:bg-lumina-900 rounded-2xl p-5 border border-lumina-100 dark:border-lumina-800 flex flex-col items-center justify-center"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.5 }}
            className="text-5xl mb-3"
          >
            🔥
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-2xl font-bold text-lumina-900 dark:text-lumina-100"
          >
            {streakDays}
          </motion.p>
          <p className="text-sm font-semibold text-lumina-800 dark:text-lumina-200 mt-1">{t("streak")}</p>
          <p className="text-xs text-lumina-400 mt-0.5">{t("streakDays", { days: streakDays })}</p>
        </motion.div>
      </div>

      {/* Bottom row: Time by category + Weekly activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Time by Category — horizontal bars */}
        <motion.div
          variants={cardVariants}
          className="bg-white dark:bg-lumina-900 rounded-2xl p-5 border border-lumina-100 dark:border-lumina-800"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <h2 className="text-sm font-semibold text-lumina-900 dark:text-lumina-100 mb-4">{t("timeByCategory")}</h2>
          <div className="flex flex-col gap-3">
            {categoryTimeData.map((cat, i) => (
              <div key={cat.key}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${cat.bg}`} />
                    <span className="text-xs font-medium text-lumina-700 dark:text-lumina-300">{t(cat.key)}</span>
                  </div>
                  <span className="text-xs text-lumina-400">{cat.hours}{t("hours")}</span>
                </div>
                <div className="h-3 bg-lumina-100 dark:bg-lumina-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: cat.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(cat.hours / maxHours) * 100}%` }}
                    transition={{ duration: 0.7, delay: 0.4 + i * 0.1, ease: "easeOut" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Weekly Activity Heatmap */}
        <motion.div
          variants={cardVariants}
          className="bg-white dark:bg-lumina-900 rounded-2xl p-5 border border-lumina-100 dark:border-lumina-800"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <h2 className="text-sm font-semibold text-lumina-900 dark:text-lumina-100 mb-4">{t("weeklyActivity")}</h2>
          <div className="grid grid-cols-7 gap-2">
            {weeklyActivity.map((day, i) => (
              <div key={day.dayKey} className="flex flex-col items-center gap-1.5">
                <span className="text-[10px] font-medium text-lumina-400">{t(day.dayKey)}</span>
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5 + i * 0.06, type: "spring", stiffness: 300, damping: 20 }}
                  className={`w-full aspect-square rounded-lg ${intensityColors[day.intensity]}`}
                />
                {/* Stacked intensity blocks */}
                {[3, 2, 1, 0].map((level) => (
                  <motion.div
                    key={level}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6 + i * 0.06 + level * 0.03 }}
                    className={`w-full h-3 rounded-sm ${
                      day.intensity > level ? intensityColors[level + 1] : "bg-lumina-100"
                    }`}
                  />
                ))}
              </div>
            ))}
          </div>
          {/* Legend */}
          <div className="flex items-center justify-end gap-1.5 mt-4">
            <span className="text-[10px] text-lumina-400">Less</span>
            {intensityColors.map((color, i) => (
              <div key={i} className={`w-3 h-3 rounded-sm ${color}`} />
            ))}
            <span className="text-[10px] text-lumina-400">More</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
