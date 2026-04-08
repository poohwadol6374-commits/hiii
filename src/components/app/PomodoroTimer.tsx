"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePomodoroStore } from "@/stores/pomodoroStore";
import { useSettingsStore } from "@/stores/settingsStore";

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function PomodoroTimer() {
  const isOpen = usePomodoroStore((s) => s.isOpen);
  const status = usePomodoroStore((s) => s.status);
  const mode = usePomodoroStore((s) => s.mode);
  const secondsRemaining = usePomodoroStore((s) => s.secondsRemaining);
  const totalSeconds = usePomodoroStore((s) => s.totalSeconds);
  const currentSession = usePomodoroStore((s) => s.currentSession);
  const totalSessions = usePomodoroStore((s) => s.totalSessions);
  const completedSessions = usePomodoroStore((s) => s.completedSessions);
  const linkedTaskTitle = usePomodoroStore((s) => s.linkedTaskTitle);
  const start = usePomodoroStore((s) => s.start);
  const pause = usePomodoroStore((s) => s.pause);
  const resume = usePomodoroStore((s) => s.resume);
  const stop = usePomodoroStore((s) => s.stop);
  const skip = usePomodoroStore((s) => s.skip);
  const tick = usePomodoroStore((s) => s.tick);
  const setOpen = usePomodoroStore((s) => s.setOpen);
  const workMinutes = useSettingsStore((s) => s.pomodoroWorkMinutes);
  const breakMinutes = useSettingsStore((s) => s.pomodoroBreakMinutes);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    clearTimer();
    if (status === "running") {
      intervalRef.current = setInterval(() => {
        const result = tick();
        if (result && result.finished) {
          skip(workMinutes, breakMinutes);
        }
      }, 1000);
    }
    return clearTimer;
  }, [status, tick, skip, workMinutes, breakMinutes, clearTimer]);

  const progress = totalSeconds > 0 ? ((totalSeconds - secondsRemaining) / totalSeconds) * 100 : 0;
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  const modeColor = mode === "work" ? "google-red" : "google-green";

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="fixed top-16 right-4 z-50 w-72 bg-white dark:bg-lumina-900 rounded-2xl border border-lumina-200 dark:border-lumina-800 overflow-hidden"
        style={{ boxShadow: "var(--shadow-modal)" }}
      >
        <div className={`flex items-center justify-between px-4 py-3 ${
          mode === "work"
            ? "bg-google-red-50 dark:bg-google-red-900/20"
            : "bg-google-green-50 dark:bg-google-green-900/20"
        }`}>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${status === "running" ? "animate-pulse" : ""} bg-${modeColor}-500`} />
            <span className={`text-sm font-semibold text-${modeColor}-700 dark:text-${modeColor}-300`}>
              {mode === "work" ? "Focus Time" : "Break Time"}
            </span>
          </div>
          <button onClick={() => setOpen(false)} className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors" aria-label="Close">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 3L11 11M11 3L3 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="flex flex-col items-center py-5 px-4">
          <div className="relative w-32 h-32 mb-3">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" className="text-lumina-100 dark:text-lumina-800" strokeWidth="6" />
              <circle cx="60" cy="60" r="54" fill="none" className={`text-${modeColor}-500`} stroke="currentColor" strokeWidth="6" strokeLinecap="round"
                strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} style={{ transition: "stroke-dashoffset 0.5s ease" }} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold tabular-nums text-lumina-900 dark:text-lumina-100">{formatTime(secondsRemaining)}</span>
              <span className="text-[10px] text-lumina-400 mt-0.5">Session {currentSession}/{totalSessions}</span>
            </div>
          </div>
          {linkedTaskTitle && (
            <div className="w-full mb-3 px-2">
              <div className="text-[11px] text-lumina-400 text-center truncate">{linkedTaskTitle}</div>
            </div>
          )}
          <div className="flex items-center gap-1.5 mb-4">
            {Array.from({ length: totalSessions }).map((_, i) => (
              <div key={i} className={`w-2.5 h-2.5 rounded-full transition-colors ${
                i < completedSessions ? `bg-${modeColor}-500`
                  : i === currentSession - 1 && status !== "idle" ? `bg-${modeColor}-300 animate-pulse`
                  : "bg-lumina-200 dark:bg-lumina-700"
              }`} />
            ))}
          </div>
          <div className="flex items-center gap-2">
            {status === "idle" ? (
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => start(workMinutes, breakMinutes)}
                className="px-5 py-2 bg-google-red-500 text-white text-sm font-medium rounded-xl hover:bg-google-red-600 transition-colors">
                Start
              </motion.button>
            ) : (
              <>
                {status === "running" ? (
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={pause}
                    className="px-4 py-2 bg-lumina-100 dark:bg-lumina-800 text-lumina-700 dark:text-lumina-200 text-sm font-medium rounded-xl hover:bg-lumina-200 dark:hover:bg-lumina-700 transition-colors">
                    Pause
                  </motion.button>
                ) : (
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={resume}
                    className="px-4 py-2 bg-google-green-500 text-white text-sm font-medium rounded-xl hover:bg-google-green-600 transition-colors">
                    Resume
                  </motion.button>
                )}
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => skip(workMinutes, breakMinutes)}
                  className="px-3 py-2 text-lumina-500 hover:text-lumina-700 dark:hover:text-lumina-300 text-sm rounded-xl hover:bg-lumina-100 dark:hover:bg-lumina-800 transition-colors">
                  Skip
                </motion.button>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={stop}
                  className="px-3 py-2 text-google-red-500 hover:text-google-red-600 text-sm rounded-xl hover:bg-google-red-50 dark:hover:bg-google-red-900/20 transition-colors">
                  Stop
                </motion.button>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
