"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { useTaskStore, type Task } from "@/stores/taskStore";
import { calculatePriorityScore } from "@/lib/ai/priorityScore";
import { explainPriority } from "@/lib/ai/explainPriority";
import { optimizeSchedule, type OptimizeResult } from "@/lib/ai/optimizer";

const priorityBadge: Record<string, { bg: string; text: string }> = {
  high: { bg: "bg-google-red-50", text: "text-google-red-600" },
  medium: { bg: "bg-google-yellow-50", text: "text-google-yellow-700" },
  low: { bg: "bg-google-green-50", text: "text-google-green-600" },
};

const dotColor: Record<string, string> = {
  high: "bg-google-red-500",
  medium: "bg-google-yellow-500",
  low: "bg-google-green-500",
};

export default function TaskIntelligencePanel() {
  const t = useTranslations("AI");
  const tTask = useTranslations("Task");
  const tasks = useTaskStore((s) => s.tasks);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showOptimize, setShowOptimize] = useState(false);

  const [now, setNow] = useState(() => new Date(2026, 3, 8, 9, 0));

  useEffect(() => {
    setNow(new Date());
  }, []);

  const ranked = useMemo(() => {
    const pending = tasks.filter((t) => t.status !== "completed");
    return pending
      .map((task) => ({
        task,
        score: calculatePriorityScore(task, now),
        explanation: explainPriority(task, now),
      }))
      .sort((a, b) => b.score - a.score);
  }, [tasks, now]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className="bg-white dark:bg-lumina-900 rounded-2xl p-5 border border-lumina-100 dark:border-lumina-800"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-google-blue-400 to-google-blue-600 flex items-center justify-center">
            <span className="text-white text-[10px] font-bold">L</span>
          </div>
          <h2 className="text-base font-semibold text-lumina-900 dark:text-lumina-100">
            {t("intelligenceTitle")}
          </h2>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowOptimize(true)}
          className="px-3 py-1.5 text-xs font-medium bg-google-blue-50 text-google-blue-600 rounded-xl hover:bg-google-blue-100 transition-colors"
        >
          {t("optimizeSchedule")}
        </motion.button>
      </div>

      {/* Ranked task list */}
      <div className="flex flex-col gap-2">
        {ranked.map(({ task, score, explanation }, i) => {
          const badge = priorityBadge[task.priority];
          const isExpanded = expandedId === task.id;

          return (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="rounded-xl bg-lumina-50/80 hover:bg-lumina-100/80 transition-colors cursor-pointer overflow-hidden"
              onClick={() => setExpandedId(isExpanded ? null : task.id)}
            >
              <div className="flex items-start gap-2.5 p-3">
                {/* Rank number */}
                <span className="text-[11px] font-bold text-lumina-400 mt-0.5 w-4 text-center flex-shrink-0">
                  {i + 1}
                </span>
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${dotColor[task.priority]}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-lumina-800 truncate">
                      {task.title}
                    </p>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium flex-shrink-0 ${badge.bg} ${badge.text}`}
                    >
                      {tTask(`priority${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}`)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] text-lumina-400">
                      {task.estimatedDuration} min
                    </span>
                    {/* Score bar */}
                    <div className="flex items-center gap-1">
                      <div className="w-12 h-1.5 bg-lumina-200 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-google-blue-400 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${score * 100}%` }}
                          transition={{ delay: 0.2 + i * 0.05, duration: 0.5 }}
                        />
                      </div>
                      <span className="text-[10px] text-lumina-400">
                        {(score * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded explanation */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-3 pb-3 pt-0">
                      <div className="bg-google-blue-50/60 rounded-lg p-2.5">
                        <p className="text-[11px] font-medium text-google-blue-700 mb-1">
                          {t("whyThisOrder")}
                        </p>
                        <p className="text-[11px] text-lumina-600 leading-relaxed">
                          {explanation}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}

        {ranked.length === 0 && (
          <div className="text-center py-6">
            <p className="text-sm text-lumina-400">{t("noTasks")}</p>
          </div>
        )}
      </div>

      {/* Optimize Modal */}
      <AnimatePresence>
        {showOptimize && (
          <OptimizeModal onClose={() => setShowOptimize(false)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}


// ── Optimize Modal (inline) ──────────────────────────────

function OptimizeModal({ onClose }: { onClose: () => void }) {
  const t = useTranslations("AI");
  const tasks = useTaskStore((s) => s.tasks);
  const [applied, setApplied] = useState(false);

  const [now, setNow] = useState(() => new Date(2026, 3, 8, 9, 0));

  useEffect(() => {
    setNow(new Date());
  }, []);

  const result = useMemo(() => {
    return optimizeSchedule(tasks, { start: 9, end: 18 }, now);
  }, [tasks, now]);

  const taskMap = useMemo(() => {
    const m = new Map<string, Task>();
    tasks.forEach((t) => m.set(t.id, t));
    return m;
  }, [tasks]);

  const handleApply = () => {
    // In-memory: just mark as applied (no real DB)
    setApplied(true);
  };

  const handleUndo = () => {
    setApplied(false);
  };

  const formatTime = (h: number, m: number) =>
    `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[1000]"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", stiffness: 340, damping: 28 }}
        className="fixed inset-x-4 top-[10%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-[480px] z-[1001] bg-white rounded-2xl border border-lumina-100 overflow-hidden"
        style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.12)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-lumina-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-google-blue-400 to-google-blue-600 flex items-center justify-center">
              <span className="text-white text-[9px] font-bold">L</span>
            </div>
            <h3 className="text-sm font-semibold text-lumina-900">
              {t("optimizeTitle")}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-lumina-400 hover:text-lumina-700 hover:bg-lumina-100 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 3L11 11M11 3L3 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 max-h-[60vh] overflow-y-auto">
          {applied ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-4"
            >
              <div className="w-12 h-12 rounded-full bg-google-green-50 flex items-center justify-center mx-auto mb-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke="#34A853" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-sm font-medium text-lumina-900 mb-1">{t("optimizeApplied")}</p>
              <p className="text-xs text-lumina-500 mb-4">{t("optimizeAppliedDesc")}</p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleUndo}
                className="px-4 py-2 text-xs font-medium text-google-blue-600 bg-google-blue-50 rounded-xl hover:bg-google-blue-100 transition-colors"
              >
                {t("undo")}
              </motion.button>
            </motion.div>
          ) : (
            <>
              <p className="text-xs text-lumina-500 mb-3">{t("optimizeDesc")}</p>

              {/* Scheduled slots */}
              <div className="mb-3">
                <h4 className="text-[11px] font-semibold text-lumina-500 uppercase tracking-wider mb-2">
                  {t("optimizedSchedule")}
                </h4>
                <div className="flex flex-col gap-1.5">
                  {result.scheduled.map((slot, i) => {
                    const task = taskMap.get(slot.taskId);
                    return (
                      <motion.div
                        key={slot.taskId}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="flex items-center gap-2 p-2 rounded-lg bg-google-blue-50/50 border border-google-blue-100"
                      >
                        <span className="text-[11px] font-mono text-google-blue-600 flex-shrink-0">
                          {formatTime(slot.startHour, slot.startMinute)}–{formatTime(slot.endHour, slot.endMinute)}
                        </span>
                        <p className="text-xs text-lumina-800 truncate">
                          {task?.title ?? slot.taskId}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Overflow */}
              {result.overflow.length > 0 && (
                <div className="mb-3">
                  <h4 className="text-[11px] font-semibold text-google-red-500 uppercase tracking-wider mb-2">
                    {t("overflow")}
                  </h4>
                  {result.overflow.map((o) => {
                    const task = taskMap.get(o.taskId);
                    return (
                      <div
                        key={o.taskId}
                        className="p-2 rounded-lg bg-google-red-50/50 border border-google-red-100 mb-1"
                      >
                        <p className="text-xs text-google-red-700">{task?.title ?? o.taskId}</p>
                        <p className="text-[10px] text-google-red-500">{o.reason}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {!applied && (
          <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-lumina-100">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-lumina-600 bg-lumina-100 rounded-xl hover:bg-lumina-200 transition-colors"
            >
              {t("cancel")}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleApply}
              className="px-4 py-2 text-xs font-medium text-white bg-google-blue-500 rounded-xl hover:bg-google-blue-600 transition-colors"
            >
              {t("confirm")}
            </motion.button>
          </div>
        )}
      </motion.div>
    </>
  );
}
