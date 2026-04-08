"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useCalendarStore } from "@/stores/calendarStore";
import { EventDot } from "./EventBlock";
import {
  isSameDay,
  getFirstDayOfMonth,
  getDaysInMonth,
  getDayOfWeekMondayStart,
  getMonday,
  DAY_NAMES_SHORT,
} from "./calendarUtils";

interface MonthViewProps {
  date: Date;
  onDayClick?: (date: Date) => void;
}

export default function MonthView({ date, onDayClick }: MonthViewProps) {
  const t = useTranslations("CalendarPage");
  const today = new Date();
  const events = useCalendarStore((s) => s.events);
  const firstDay = getFirstDayOfMonth(date);
  const daysInMonth = getDaysInMonth(date);
  const startOffset = getDayOfWeekMondayStart(firstDay);

  // Build 6-row grid (42 cells)
  const cells: (Date | null)[] = [];
  // Previous month padding
  for (let i = 0; i < startOffset; i++) {
    const d = new Date(firstDay);
    d.setDate(d.getDate() - (startOffset - i));
    cells.push(d);
  }
  // Current month
  for (let i = 1; i <= daysInMonth; i++) {
    cells.push(new Date(date.getFullYear(), date.getMonth(), i));
  }
  // Next month padding
  while (cells.length < 42) {
    const last = cells[cells.length - 1]!;
    const d = new Date(last);
    d.setDate(d.getDate() + 1);
    cells.push(d);
  }

  // Get events for a specific date
  function getEventsForDate(d: Date) {
    const monday = getMonday(d);
    const dayOfWeek = Math.round(
      (d.getTime() - monday.getTime()) / (1000 * 60 * 60 * 24),
    );
    // Only show events for weekdays (0-4) since our mock data is Mon-Fri
    if (dayOfWeek < 0 || dayOfWeek > 6) return [];
    return events.filter((e) => e.dayOfWeek === dayOfWeek);
  }

  const isCurrentMonth = (d: Date) =>
    d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col h-full"
    >
      {/* Day name headers */}
      <div className="grid grid-cols-7 border-b border-lumina-200 dark:border-lumina-800 bg-white/80 dark:bg-lumina-900/80 backdrop-blur-sm sticky top-0 z-20">
        {DAY_NAMES_SHORT.map((name) => (
          <div
            key={name}
            className="py-2 text-center text-[10px] font-medium text-lumina-400 uppercase tracking-wide"
          >
            {name}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="flex-1 grid grid-cols-7 grid-rows-6 border-l border-lumina-100 dark:border-lumina-800">
        {cells.map((cellDate, i) => {
          if (!cellDate) return <div key={i} />;
          const isToday = isSameDay(cellDate, today);
          const inMonth = isCurrentMonth(cellDate);
          const events = getEventsForDate(cellDate);
          const visibleEvents = events.slice(0, 3);
          const moreCount = events.length - 3;

          // Heatmap intensity based on event count
          const intensity = events.length;
          const heatmapBg = intensity === 0 ? "" : intensity <= 1 ? "bg-google-blue-50/30 dark:bg-google-blue-900/10" : intensity <= 2 ? "bg-google-blue-50/50 dark:bg-google-blue-900/15" : intensity <= 3 ? "bg-google-blue-100/50 dark:bg-google-blue-900/20" : "bg-google-blue-100/70 dark:bg-google-blue-900/30";

          return (
            <motion.div
              key={i}
              whileHover={{ backgroundColor: "rgba(66,133,244,0.04)" }}
              onClick={() => onDayClick?.(cellDate)}
              className={`border-r border-b border-lumina-100 dark:border-lumina-800 p-1 md:p-1.5 min-h-[60px] md:min-h-[100px] cursor-pointer transition-colors ${
                inMonth ? "" : "opacity-40"
              } ${heatmapBg}`}
            >
              <span
                className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium mb-1 ${
                  isToday
                    ? "bg-google-blue-500 text-white"
                    : "text-lumina-700 dark:text-lumina-300"
                }`}
              >
                {cellDate.getDate()}
              </span>

              {/* Event dots / chips */}
              <div className="flex flex-col gap-0.5">
                {visibleEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center gap-1 truncate"
                  >
                    <EventDot category={event.category} />
                    <span className="text-[10px] text-lumina-600 dark:text-lumina-400 truncate hidden md:inline">
                      {event.title}
                    </span>
                  </div>
                ))}
                {moreCount > 0 && (
                  <span className="text-[10px] text-lumina-400 font-medium">
                    +{moreCount} {t("more")}
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
