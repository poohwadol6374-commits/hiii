"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useTaskStore, type Task } from "@/stores/taskStore";
import { calculatePriorityScore } from "@/lib/ai/priorityScore";

function getGreetingKey(hour: number): "greetingMorning" | "greetingAfternoon" | "greetingEvening" {
  if (hour < 12) return "greetingMorning";
  if (hour < 17) return "greetingAfternoon";
  return "greetingEvening";
}

function getFocusTimeLabel(hour: number): string {
  if (hour < 12) return "9:00–11:00 AM";
  if (hour < 17) return "2:00–4:00 PM";
  return "9:00–11:00 AM";
}

export default function DailyBriefing() {
  const t = useTranslations("DailyBriefing");
  const tasks = useTaskStore((s) => s.tasks);

  const now = useMemo(() => new Date(), []);
  const hour = now.getHours();

  const { pendingTasks, highPriorityCount, meetingCount, topTasks } = useMemo(() => {
    const pending = tasks.filter((t) => t.status !== "completed");
    const high = pending.filter((t) => t.priority === "high").length;
    const meetings = pending.filter((t) => t.category === "meeting").length;

    const ranked = pending
      .map((task) => ({ task, score: calculatePriorityScore(task, now) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    return {
      pendingTasks: pending.length,
      highPriorityCount: high,
      meetingCount: meetings,
      topTasks: ranked,
    };
  }, [tasks, now]);

  const greetingKey = getGreetingKey(hour);
  const focusTime = getFocusTimeLabel(hour);

  const priorityColors: Record<string, { dot: string; bg: string; text: string }> = {
    high: { dot: "bg-google-red-500", bg: "bg-google-red-50", text: "text-google-red-600" },
    medium: { dot: "bg-google-yellow-500", bg: "bg-google-yellow-50", text: "text-google-yellow-700" },
    low: { dot: "bg-google-green-500", bg: "bg-google-green-50", text: "text-google-green-600" },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className="relative overflow-hidden rounded-2xl border border-lumina-100 bg-gradient-to-br from-white via-white to-google-blue-50/40 p-5"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      {/* Decorative glow */}
      <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-google-blue-100/30 blur-3xl pointer-events-none" />

      {/* Header: Luma avatar + greeting */}
      <div className="flex items-start gap-3 mb-4 relative z-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.1 }}
          className="w-11 h-11 rounded-full bg-gradient-to-br from-google-blue-400 to-google-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg"
          style={{ boxShadow: "var(--shadow-glow-blue)" }}
        >
          <span className="text-white text-sm font-bold">L</span>
        </motion.div>
        <div className="flex-1 min-w-0">
          <motion.h2
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="text-lg font-bold text-lumina-900"
          >
            {t(greetingKey)}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.22 }}
            className="text-sm text-lumina-500 mt-0.5"
          >
            {t("summary", {
              tasks: pendingTasks,
              meetings: meetingCount,
              highPriority: highPriorityCount,
            })}
          </motion.p>
        </div>
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 relative z-10">
        {/* Top priority tasks */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/70 backdrop-blur-sm rounded-xl p-3.5 border border-lumina-100/60"
        >
          <h3 className="text-xs font-semibold text-lumina-500 uppercase tracking-wider mb-2.5">
            {t("topPriority")}
          </h3>
          {topTasks.length === 0 ? (
            <p className="text-sm text-lumina-400">{t("noTasks")}</p>
          ) : (
            <div className="flex flex-col gap-2">
              {topTasks.map(({ task, score }, i) => {
                const pc = priorityColors[task.priority];
                return (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + i * 0.06 }}
                    className="flex items-center gap-2.5"
                  >
                    <span className="text-[11px] font-bold text-lumina-300 w-4 text-center flex-shrink-0">
                      {i + 1}
                    </span>
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${pc.dot}`} />
                    <p className="text-sm text-lumina-800 truncate flex-1">{task.title}</p>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium ${pc.bg} ${pc.text}`}>
                      {(score * 100).toFixed(0)}%
                    </span>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Best focus time */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38 }}
          className="bg-white/70 backdrop-blur-sm rounded-xl p-3.5 border border-lumina-100/60"
        >
          <h3 className="text-xs font-semibold text-lumina-500 uppercase tracking-wider mb-2.5">
            {t("bestFocusTime")}
          </h3>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-google-green-50 flex items-center justify-center flex-shrink-0">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="7" stroke="#34A853" strokeWidth="1.5" />
                <path d="M10 6V10L13 12" stroke="#34A853" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-lumina-900">{focusTime}</p>
              <p className="text-xs text-lumina-500 mt-0.5 leading-relaxed">
                {t("focusRecommendation", { time: focusTime })}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
