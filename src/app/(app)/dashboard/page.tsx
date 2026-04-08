"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import TaskIntelligencePanel from "@/components/ai/TaskIntelligencePanel";
import DailyBriefing from "@/components/dashboard/DailyBriefing";
import WeeklyReview from "@/components/dashboard/WeeklyReview";
import LumaLogo from "@/components/landing/LumaLogo";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import EventDetailModal from "@/components/calendar/EventDetailModal";
import { type CalendarEvent } from "@/components/calendar/mockData";

interface DashboardEvent {
  id: string;
  title: string;
  description: string;
  time: string;
  type: "meeting" | "focus";
  color: string;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
}

const mockEvents: DashboardEvent[] = [
  { id: "e1", title: "Team Standup", description: "Daily sync: blockers, progress, plans for today", time: "09:00 – 09:30", type: "meeting", color: "google-blue", startHour: 9, startMinute: 0, endHour: 9, endMinute: 30 },
  { id: "e2", title: "Deep Work: Q4 Report", description: "Compile quarterly financial data, create charts", time: "09:30 – 11:30", type: "focus", color: "google-green", startHour: 9, startMinute: 30, endHour: 11, endMinute: 30 },
  { id: "e3", title: "Design Review", description: "Review new UI mockups with design team", time: "13:00 – 14:00", type: "meeting", color: "google-blue", startHour: 13, startMinute: 0, endHour: 14, endMinute: 0 },
  { id: "e4", title: "Focus: Code Review", description: "Review 5 pending PRs from frontend team", time: "14:30 – 16:00", type: "focus", color: "google-green", startHour: 14, startMinute: 30, endHour: 16, endMinute: 0 },
  { id: "e5", title: "1:1 with Manager", description: "Career growth discussion, feedback on Q4 performance", time: "16:30 – 17:00", type: "meeting", color: "google-yellow", startHour: 16, startMinute: 30, endHour: 17, endMinute: 0 },
];

const mockTasks = [
  { id: "t1", title: "Prepare Q4 report", priority: "high" as const, deadline: "Today", progress: 60 },
  { id: "t2", title: "Review design mockups", priority: "high" as const, deadline: "Today", progress: 20 },
  { id: "t3", title: "Update API documentation", priority: "medium" as const, deadline: "Tomorrow", progress: 0 },
  { id: "t4", title: "Fix login page bug", priority: "medium" as const, deadline: "Wed", progress: 80 },
  { id: "t5", title: "Plan team offsite", priority: "low" as const, deadline: "Fri", progress: 10 },
];

const eventTypeStyles = {
  meeting: { bg: "bg-google-blue-50", border: "border-google-blue-200", dot: "bg-google-blue-500", text: "text-google-blue-700" },
  focus: { bg: "bg-google-green-50", border: "border-google-green-200", dot: "bg-google-green-500", text: "text-google-green-700" },
};

const priorityStyles = {
  high: { bg: "bg-google-red-50", text: "text-google-red-600", label: "High" },
  medium: { bg: "bg-google-yellow-50", text: "text-google-yellow-700", label: "Medium" },
  low: { bg: "bg-google-green-50", text: "text-google-green-600", label: "Low" },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 260, damping: 24 } },
};

export default function DashboardPage() {
  const t = useTranslations("Dashboard");
  const router = useRouter();
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  return (
    <motion.div
      className="p-4 md:p-6 lg:p-8 max-w-6xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      suppressHydrationWarning
    >
      {/* Welcome Header */}
      <motion.div variants={cardVariants} className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 gradient-bg flex items-center justify-center flex-shrink-0" style={{ borderRadius: 10 }}>
            <LumaLogo size={40} />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-lumina-900 dark:text-lumina-100">{t("title")}</h1>
            <p className="text-sm text-lumina-500 dark:text-lumina-400">{t("greeting")}</p>
          </div>
        </div>
      </motion.div>

      {/* Luma Daily Briefing */}
      <motion.div variants={cardVariants} className="mb-5">
        <DailyBriefing />
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Today's Schedule */}
        <motion.div
          variants={cardVariants}
          className="lg:col-span-2 bg-white dark:bg-lumina-900 rounded-2xl p-5 border border-lumina-100 dark:border-lumina-800 hover-lift border-highlight"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-lumina-900 dark:text-lumina-100">{t("todaySchedule")}</h2>
            <Link href="/calendar" className="text-xs text-pink-600 font-medium hover:text-pink-700 transition-colors">
              {t("viewAll")}
            </Link>
          </div>
          <div className="flex flex-col gap-2.5">
            {mockEvents.map((event, i) => {
              const style = eventTypeStyles[event.type];
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.06 }}
                  className={`flex items-center gap-3 p-3 rounded-xl ${style.bg} border ${style.border} cursor-pointer hover:shadow-sm transition-shadow press-effect`}
                  onClick={() => setSelectedEvent({
                    id: event.id,
                    title: event.title,
                    description: event.description,
                    startHour: event.startHour,
                    startMinute: event.startMinute,
                    endHour: event.endHour,
                    endMinute: event.endMinute,
                    dayOfWeek: 0,
                    category: event.type,
                  })}
                >
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${style.dot}`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${style.text}`}>{event.title}</p>
                  </div>
                  <span className="text-xs text-lumina-400 flex-shrink-0">{event.time}</span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Priority Tasks */}
        <motion.div
          variants={cardVariants}
          className="bg-white dark:bg-lumina-900 rounded-2xl p-5 border border-lumina-100 dark:border-lumina-800 hover-lift border-highlight"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-lumina-900 dark:text-lumina-100">{t("priorityTasks")}</h2>
            <Link href="/tasks" className="text-xs text-pink-600 font-medium hover:text-pink-700 transition-colors">
              {t("viewAll")}
            </Link>
          </div>
          <div className="flex flex-col gap-2.5">
            {mockTasks.map((task, i) => {
              const style = priorityStyles[task.priority];
              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.06 }}
                  className="p-3 rounded-xl bg-lumina-50/80 dark:bg-lumina-800/60 hover:bg-lumina-100/80 dark:hover:bg-lumina-800 transition-colors cursor-pointer group press-effect"
                  onClick={() => router.push("/tasks")}
                >
                  <div className="flex items-start justify-between mb-1.5">
                    <p className="text-sm font-medium text-lumina-800 dark:text-lumina-200 group-hover:text-lumina-900 dark:group-hover:text-lumina-100 truncate pr-2">
                      {task.title}
                    </p>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium flex-shrink-0 ${style.bg} ${style.text}`}>
                      {style.label}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-lumina-400">{task.deadline}</span>
                    {/* Progress bar */}
                    <div className="flex items-center gap-1.5">
                      <div className="w-16 h-1.5 bg-lumina-200 dark:bg-lumina-700 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-google-blue-400 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${task.progress}%` }}
                          transition={{ delay: 0.4 + i * 0.08, duration: 0.6, ease: "easeOut" }}
                        />
                      </div>
                      <span className="text-[10px] text-lumina-400">{task.progress}%</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Task Intelligence Panel */}
        <motion.div variants={cardVariants} className="lg:col-span-3">
          <TaskIntelligencePanel />
        </motion.div>

        {/* Weekly Review */}
        <motion.div variants={cardVariants} className="lg:col-span-3">
          <WeeklyReview />
        </motion.div>

        {/* AI Insights */}
        <motion.div variants={cardVariants} className="lg:col-span-3">
          <h2 className="text-base font-semibold text-lumina-900 dark:text-lumina-100 mb-3">{t("aiInsights")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InsightCard
              icon={
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M10 6V10L13 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              }
              title={t("bestFocusTime")}
              description={t("bestFocusDesc")}
              color="blue"
              delay={0.35}
              onClick={() => router.push("/analytics")}
            />
            <InsightCard
              icon={
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2L10 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M10 15L10 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="10" cy="10" r="4" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M2 10H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M15 10H18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              }
              title={t("tasksAtRisk")}
              description={t("tasksAtRiskDesc")}
              color="red"
              delay={0.42}
              onClick={() => router.push("/tasks")}
            />
            <InsightCard
              icon={
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <rect x="2" y="10" width="4" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" />
                  <rect x="8" y="6" width="4" height="12" rx="1" stroke="currentColor" strokeWidth="1.5" />
                  <rect x="14" y="2" width="4" height="16" rx="1" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              }
              title={t("weeklyCompletion")}
              description={t("weeklyCompletionDesc")}
              color="green"
              delay={0.49}
              onClick={() => router.push("/analytics")}
            />
          </div>
        </motion.div>
      </div>

      {/* Event Detail Modal */}
      <EventDetailModal event={selectedEvent} open={!!selectedEvent} onClose={() => setSelectedEvent(null)} />
    </motion.div>
  );
}

function InsightCard({
  icon,
  title,
  description,
  color,
  delay,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: "blue" | "red" | "green";
  delay: number;
  onClick?: () => void;
}) {
  const colorMap = {
    blue: { bg: "bg-google-blue-50", iconBg: "bg-google-blue-100", iconText: "text-google-blue-600", border: "border-google-blue-100" },
    red: { bg: "bg-google-red-50", iconBg: "bg-google-red-100", iconText: "text-google-red-600", border: "border-google-red-100" },
    green: { bg: "bg-google-green-50", iconBg: "bg-google-green-100", iconText: "text-google-green-600", border: "border-google-green-100" },
  };
  const c = colorMap[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: "spring" as const, stiffness: 260, damping: 24 }}
      className={`${c.bg} rounded-2xl p-4 border ${c.border} cursor-pointer hover-lift hover-glow transition-all`}
      onClick={onClick}
    >
      <div className={`w-9 h-9 rounded-xl ${c.iconBg} ${c.iconText} flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-lumina-900 dark:text-lumina-100 mb-1">{title}</h3>
      <p className="text-xs text-lumina-500 dark:text-lumina-400 leading-relaxed">{description}</p>
    </motion.div>
  );
}
