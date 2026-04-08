"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import TaskCreateModal from "@/components/tasks/TaskCreateModal";
import { usePomodoroStore } from "@/stores/pomodoroStore";
import { useTaskStore, type Task } from "@/stores/taskStore";
import { useToast } from "@/components/app/Toast";
import Link from "next/link";

interface Notification {
  id: string;
  type: "deadline" | "luma" | "complete" | "reminder";
  title: string;
  body: string;
  time: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  { id: "n1", type: "deadline", title: "Deadline approaching", body: "Prepare Q4 Financial Report — due tomorrow", time: "10 min ago", read: false },
  { id: "n2", type: "luma", title: "Luma suggestion", body: "Your best focus time is 9–11 AM. Schedule deep work now?", time: "30 min ago", read: false },
  { id: "n3", type: "complete", title: "Task completed", body: "Weekly Team Standup Notes marked as done", time: "1 hr ago", read: false },
  { id: "n4", type: "reminder", title: "Meeting in 30 min", body: "Design Review at 13:00–14:00", time: "2 hr ago", read: true },
  { id: "n5", type: "luma", title: "Weekly review ready", body: "Your weekly productivity report is ready to view", time: "5 hr ago", read: true },
];

const notifIcon: Record<string, React.ReactNode> = {
  deadline: <span className="text-google-red-500">⏰</span>,
  luma: <span className="text-google-blue-500">✨</span>,
  complete: <span className="text-google-green-500">✅</span>,
  reminder: <span className="text-google-yellow-500">🔔</span>,
};

export default function TopBar() {
  const t = useTranslations("App");
  const [createOpen, setCreateOpen] = useState(false);
  const togglePomodoro = usePomodoroStore((s) => s.toggleOpen);
  const pomoStatus = usePomodoroStore((s) => s.status);
  const addTask = useTaskStore((s) => s.addTask);
  const { showToast } = useToast();

  // Quick Capture
  const [quickInput, setQuickInput] = useState("");
  const quickRef = useRef<HTMLInputElement>(null);

  const handleQuickCapture = useCallback(() => {
    const text = quickInput.trim();
    if (!text) return;
    const newTask: Task = {
      id: `t-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      title: text,
      category: "work",
      priority: "medium",
      status: "pending",
      estimatedDuration: 30,
      tags: [],
      energyLevel: "medium",
      createdAt: new Date().toISOString(),
    };
    addTask(newTask);
    setQuickInput("");
    showToast(`Added: ${text}`, "success");
  }, [quickInput, addTask, showToast]);

  // Notifications
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <>
      <header
        className="flex items-center justify-between h-14 px-4 md:px-6 bg-white/80 dark:bg-lumina-900/80 backdrop-blur-xl border-b border-lumina-200/60 dark:border-lumina-800/60 z-20"
        style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.03)" }}
      >
        {/* Left: Search */}
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative flex-1 hidden sm:block">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-lumina-400" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M11 11L14.5 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input type="text" placeholder={t("search")} readOnly
              className="w-full pl-9 pr-4 py-2 text-sm bg-lumina-100/80 dark:bg-lumina-800/80 rounded-xl border-none outline-none focus:ring-2 focus:ring-google-blue-200 focus:bg-white dark:focus:bg-lumina-800 transition-all placeholder:text-lumina-400 dark:text-lumina-100" />
          </div>
        </div>

        {/* Center: Quick Capture (functional) */}
        <div className="hidden lg:flex items-center flex-1 max-w-sm mx-4">
          <div className="relative w-full">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-lumina-400" width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1V13M1 7H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              ref={quickRef}
              type="text"
              value={quickInput}
              onChange={(e) => setQuickInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleQuickCapture(); }}
              placeholder={t("quickCapture")}
              className="w-full pl-9 pr-10 py-2 text-sm bg-google-blue-50/50 dark:bg-google-blue-900/20 rounded-xl border border-google-blue-100 dark:border-google-blue-800 outline-none focus:ring-2 focus:ring-google-blue-200 focus:bg-white dark:focus:bg-lumina-800 transition-all placeholder:text-lumina-400 dark:text-lumina-100"
            />
            {quickInput && (
              <button onClick={handleQuickCapture} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-google-blue-500 hover:text-google-blue-600 transition-colors">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M14 2L7 9M14 2L9.5 14L7 9M14 2L2 6.5L7 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Pomodoro */}
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={togglePomodoro}
            className={`relative p-2 rounded-xl transition-colors ${pomoStatus !== "idle" ? "text-google-red-500 bg-google-red-50 hover:bg-google-red-100" : "text-lumina-500 hover:bg-lumina-100 hover:text-lumina-700 dark:hover:bg-lumina-800 dark:hover:text-lumina-200"}`}
            aria-label="Pomodoro Timer">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
              <path d="M9 6V10L11.5 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M7 2H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            {pomoStatus !== "idle" && <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-google-red-500 rounded-full animate-pulse" />}
          </motion.button>

          {/* Add Task */}
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setCreateOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-google-blue-500 text-white text-sm font-medium rounded-xl hover:bg-google-blue-600 transition-colors shadow-sm"
            aria-label={t("addTask")}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1V13M1 7H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="hidden sm:inline">{t("addTask")}</span>
          </motion.button>

          {/* Notifications */}
          <div className="relative">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative p-2 rounded-xl text-lumina-500 hover:bg-lumina-100 hover:text-lumina-700 dark:hover:bg-lumina-800 dark:hover:text-lumina-200 transition-colors"
              aria-label={t("notifications")}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M13.5 6.75C13.5 5.5576 13.0259 4.41403 12.182 3.56802C11.338 2.72202 10.1935 2.24609 9 2.24609C7.80653 2.24609 6.66193 2.72202 5.81802 3.56802C4.97411 4.41403 4.5 5.5576 4.5 6.75C4.5 12 2.25 13.5 2.25 13.5H15.75C15.75 13.5 13.5 12 13.5 6.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M10.2975 15.75C10.1657 15.9773 9.97642 16.166 9.74878 16.2971C9.52114 16.4283 9.26287 16.4973 9 16.4973C8.73713 16.4973 8.47886 16.4283 8.25122 16.2971C8.02358 16.166 7.83434 15.9773 7.7025 15.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-google-red-500 rounded-full">
                  {unreadCount}
                </span>
              )}
            </motion.button>

            {/* Notification Dropdown */}
            <AnimatePresence>
              {notifOpen && (
                <>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className="absolute right-0 top-12 z-50 w-80 bg-white dark:bg-lumina-900 rounded-2xl border border-lumina-200 dark:border-lumina-800 overflow-hidden"
                    style={{ boxShadow: "var(--shadow-modal)" }}
                  >
                    <div className="flex items-center justify-between px-4 py-3 border-b border-lumina-100 dark:border-lumina-800">
                      <h3 className="text-sm font-semibold text-lumina-900 dark:text-lumina-100">{t("notifications")}</h3>
                      {unreadCount > 0 && (
                        <button onClick={markAllRead} className="text-[11px] text-google-blue-500 hover:text-google-blue-600 font-medium">
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.map((n) => (
                        <motion.div
                          key={n.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          onClick={() => markRead(n.id)}
                          className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-lumina-50 dark:hover:bg-lumina-800 ${!n.read ? "bg-google-blue-50/30 dark:bg-google-blue-900/10" : ""}`}
                        >
                          <div className="text-base mt-0.5 flex-shrink-0">{notifIcon[n.type]}</div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs font-medium truncate ${!n.read ? "text-lumina-900 dark:text-lumina-100" : "text-lumina-500 dark:text-lumina-400"}`}>{n.title}</p>
                            <p className="text-[11px] text-lumina-500 dark:text-lumina-400 truncate mt-0.5">{n.body}</p>
                            <p className="text-[10px] text-lumina-400 mt-1">{n.time}</p>
                          </div>
                          {!n.read && <div className="w-2 h-2 rounded-full bg-google-blue-500 mt-1.5 flex-shrink-0" />}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Profile Avatar */}
          <Link href="/profile">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-google-blue-400 to-google-blue-600 text-white text-xs font-bold cursor-pointer"
              aria-label={t("profile")}>
              U
            </motion.div>
          </Link>
        </div>
      </header>

      <TaskCreateModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </>
  );
}
