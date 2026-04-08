"use client";

import { motion } from "framer-motion";
import { useSettingsStore } from "@/stores/settingsStore";
import { useTaskStore } from "@/stores/taskStore";
import { useGoalStore } from "@/stores/goalStore";
import { useMemo } from "react";

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const cardVariants = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 260, damping: 24 } } };

export default function ProfilePage() {
  const displayName = useSettingsStore((s) => s.displayName);
  const email = useSettingsStore((s) => s.email);
  const locale = useSettingsStore((s) => s.locale);
  const theme = useSettingsStore((s) => s.theme);
  const tasks = useTaskStore((s) => s.tasks);
  const goals = useGoalStore((s) => s.goals);

  const stats = useMemo(() => {
    const completed = tasks.filter((t) => t.status === "completed").length;
    const total = tasks.length;
    const goalsCompleted = goals.filter((g) => g.currentCount >= g.targetCount).length;
    return { completed, total, goalsCompleted, totalGoals: goals.length, streak: 5 };
  }, [tasks, goals]);

  return (
    <motion.div className="max-w-2xl mx-auto px-4 md:px-6 py-6" variants={containerVariants} initial="hidden" animate="visible">
      {/* Profile Header */}
      <motion.div variants={cardVariants} className="flex flex-col items-center mb-8">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="w-24 h-24 rounded-full bg-gradient-to-br from-google-blue-400 to-google-blue-600 flex items-center justify-center mb-4 shadow-lg"
          style={{ boxShadow: "0 0 30px rgba(66,133,244,0.2)" }}>
          <span className="text-white text-3xl font-bold">{displayName.charAt(0).toUpperCase()}</span>
        </motion.div>
        <h1 className="text-xl font-bold text-lumina-900 dark:text-lumina-100">{displayName}</h1>
        <p className="text-sm text-lumina-500 dark:text-lumina-400">{email}</p>
        <div className="flex items-center gap-2 mt-2">
          <span className="px-2.5 py-1 text-[10px] font-medium bg-google-blue-50 dark:bg-google-blue-900/20 text-google-blue-600 dark:text-google-blue-400 rounded-lg">Pro Plan</span>
          <span className="px-2.5 py-1 text-[10px] font-medium bg-lumina-100 dark:bg-lumina-800 text-lumina-600 dark:text-lumina-400 rounded-lg">
            {locale === "th" ? "🇹🇭 ไทย" : "🇺🇸 English"}
          </span>
          <span className="px-2.5 py-1 text-[10px] font-medium bg-lumina-100 dark:bg-lumina-800 text-lumina-600 dark:text-lumina-400 rounded-lg">
            {theme === "dark" ? "🌙" : theme === "auto" ? "🔄" : "☀️"} {theme}
          </span>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: "งานเสร็จ", value: stats.completed, icon: "✅", sub: `จาก ${stats.total} งาน` },
          { label: "เป้าหมายสำเร็จ", value: stats.goalsCompleted, icon: "🎯", sub: `จาก ${stats.totalGoals} เป้าหมาย` },
          { label: "ความต่อเนื่อง", value: `${stats.streak} วัน`, icon: "🔥", sub: "สุดยอด!" },
          { label: "ประสิทธิภาพ", value: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) + "%" : "0%", icon: "📊", sub: "อัตราความสำเร็จ" },
        ].map((stat, i) => (
          <motion.div key={stat.label} variants={cardVariants}
            className="bg-white dark:bg-lumina-900 rounded-2xl p-4 border border-lumina-100 dark:border-lumina-800 text-center" style={{ boxShadow: "var(--shadow-card)" }}>
            <span className="text-2xl">{stat.icon}</span>
            <p className="text-lg font-bold text-lumina-900 dark:text-lumina-100 mt-1">{stat.value}</p>
            <p className="text-[11px] text-lumina-500">{stat.label}</p>
            <p className="text-[10px] text-lumina-400 mt-0.5">{stat.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Activity Summary */}
      <motion.div variants={cardVariants}
        className="bg-white dark:bg-lumina-900 rounded-2xl p-5 border border-lumina-100 dark:border-lumina-800 mb-4" style={{ boxShadow: "var(--shadow-card)" }}>
        <h2 className="text-sm font-semibold text-lumina-900 dark:text-lumina-100 mb-4">กิจกรรมล่าสุด</h2>
        <div className="space-y-3">
          {[
            { action: "ทำงาน Prepare Q4 Financial Report เสร็จ", time: "2 ชั่วโมงที่แล้ว", icon: "✅" },
            { action: "เพิ่มเป้าหมาย: Exercise 3 times per week", time: "5 ชั่วโมงที่แล้ว", icon: "🎯" },
            { action: "Focus Mode: 45 นาที บน Review Pull Requests", time: "เมื่อวาน", icon: "🍅" },
            { action: "Luma จัดตารางใหม่ 4 งาน", time: "เมื่อวาน", icon: "✨" },
            { action: "สร้างงาน Design System Update", time: "2 วันที่แล้ว", icon: "📝" },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.05 }}
              className="flex items-center gap-3 py-2">
              <span className="text-base flex-shrink-0">{item.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-lumina-800 dark:text-lumina-200 truncate">{item.action}</p>
                <p className="text-[10px] text-lumina-400">{item.time}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Luma AI Summary */}
      <motion.div variants={cardVariants}
        className="bg-gradient-to-br from-google-blue-50 dark:from-google-blue-900/20 to-google-blue-100/50 dark:to-google-blue-900/10 rounded-2xl p-5 border border-google-blue-100 dark:border-google-blue-800">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-google-blue-400 to-google-blue-600 flex items-center justify-center">
            <span className="text-white text-[10px] font-bold">L</span>
          </div>
          <p className="text-sm font-semibold text-google-blue-700 dark:text-google-blue-300">Luma's Summary</p>
        </div>
        <p className="text-sm text-google-blue-600 dark:text-google-blue-400 leading-relaxed">
          คุณทำงานได้ดีมากในสัปดาห์นี้! ประสิทธิภาพเพิ่มขึ้น 12% จากสัปดาห์ที่แล้ว 
          ช่วงเวลาที่คุณทำงานได้ดีที่สุดคือ 9:00–11:00 น. แนะนำให้จัดงาน deep work ไว้ช่วงนี้ต่อไป 
          เป้าหมายออกกำลังกายเหลืออีก 1 ครั้งจะครบ — สู้ๆ นะ! 💪
        </p>
      </motion.div>
    </motion.div>
  );
}
