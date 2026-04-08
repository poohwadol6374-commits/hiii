"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFocusStore } from "@/stores/focusStore";
import { usePomodoroStore } from "@/stores/pomodoroStore";
import { useSettingsStore } from "@/stores/settingsStore";
import { useTaskStore } from "@/stores/taskStore";

function formatElapsed(s: number): string {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  return `${m}:${String(sec).padStart(2, "0")}`;
}

function formatPomo(s: number): string {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

export default function FocusMode() {
  const active = useFocusStore((s) => s.active);
  const taskTitle = useFocusStore((s) => s.taskTitle);
  const taskId = useFocusStore((s) => s.taskId);
  const elapsedSeconds = useFocusStore((s) => s.elapsedSeconds);
  const tickElapsed = useFocusStore((s) => s.tickElapsed);
  const stopFocus = useFocusStore((s) => s.stopFocus);

  const pomoStatus = usePomodoroStore((s) => s.status);
  const pomoMode = usePomodoroStore((s) => s.mode);
  const pomoSeconds = usePomodoroStore((s) => s.secondsRemaining);
  const pomoStart = usePomodoroStore((s) => s.start);
  const pomoPause = usePomodoroStore((s) => s.pause);
  const pomoResume = usePomodoroStore((s) => s.resume);
  const pomoLink = usePomodoroStore((s) => s.linkTask);

  const workMin = useSettingsStore((s) => s.pomodoroWorkMinutes);
  const breakMin = useSettingsStore((s) => s.pomodoroBreakMinutes);

  const toggleComplete = useTaskStore((s) => s.toggleComplete);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Elapsed timer
  useEffect(() => {
    if (active) {
      timerRef.current = setInterval(tickElapsed, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [active, tickElapsed]);

  // Auto-link pomodoro to focus task
  useEffect(() => {
    if (active && taskId && taskTitle) {
      pomoLink(taskId, taskTitle);
    }
  }, [active, taskId, taskTitle, pomoLink]);

  const handleStartPomo = () => {
    pomoStart(workMin, breakMin);
  };

  const handleComplete = () => {
    if (taskId) toggleComplete(taskId);
    stopFocus();
  };

  if (!active) return null;

  const pomoColor = pomoMode === "work" ? "google-red" : "google-green";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 z-[2000] flex flex-col items-center justify-center"
      >
        {/* Ambient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-lumina-950 via-lumina-900 to-lumina-950" />
        <motion.div
          className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-google-blue-500/8 blur-[120px]"
          animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/3 w-80 h-80 rounded-full bg-google-green-500/6 blur-[100px]"
          animate={{ x: [0, -30, 0], y: [0, 20, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center max-w-lg px-6 text-center">
          {/* Focus label */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2 mb-8"
          >
            <div className="w-2 h-2 rounded-full bg-google-green-400 animate-pulse" />
            <span className="text-xs font-medium text-lumina-400 uppercase tracking-widest">Focus Mode</span>
          </motion.div>

          {/* Task title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight"
          >
            {taskTitle}
          </motion.h1>

          {/* Elapsed time */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mb-10"
          >
            <span className="text-5xl md:text-6xl font-bold tabular-nums text-white/90">
              {formatElapsed(elapsedSeconds)}
            </span>
            <p className="text-xs text-lumina-500 mt-2">elapsed</p>
          </motion.div>

          {/* Pomodoro mini */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-10"
          >
            {pomoStatus === "idle" ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStartPomo}
                className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white text-sm font-medium rounded-2xl border border-white/10 hover:bg-white/15 transition-colors"
              >
                🍅 Start Pomodoro ({workMin} min)
              </motion.button>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full animate-pulse bg-${pomoColor}-500`} />
                  <span className={`text-sm font-medium text-${pomoColor}-400`}>
                    {pomoMode === "work" ? "🍅 Focus" : "☕ Break"}
                  </span>
                </div>
                <span className="text-3xl font-bold tabular-nums text-white/80">
                  {formatPomo(pomoSeconds)}
                </span>
                <div className="flex items-center gap-2">
                  {pomoStatus === "running" ? (
                    <button onClick={pomoPause} className="px-4 py-1.5 text-xs font-medium text-white/70 bg-white/10 rounded-xl hover:bg-white/15 transition-colors">
                      Pause
                    </button>
                  ) : (
                    <button onClick={pomoResume} className="px-4 py-1.5 text-xs font-medium text-white/70 bg-white/10 rounded-xl hover:bg-white/15 transition-colors">
                      Resume
                    </button>
                  )}
                </div>
              </div>
            )}
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex items-center gap-3"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleComplete}
              className="px-6 py-3 bg-google-green-500 text-white text-sm font-semibold rounded-2xl hover:bg-google-green-600 transition-colors shadow-lg"
            >
              ✓ Complete Task
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={stopFocus}
              className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white/70 text-sm font-medium rounded-2xl border border-white/10 hover:bg-white/15 transition-colors"
            >
              Exit Focus
            </motion.button>
          </motion.div>

          {/* Keyboard hint */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-8 text-[11px] text-lumina-600"
          >
            Press <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-lumina-400 font-mono text-[10px]">Esc</kbd> to exit
          </motion.p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
