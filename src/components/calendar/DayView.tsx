"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import EventBlock from "./EventBlock";
import TimeColumn from "./TimeColumn";
import CurrentTimeIndicator from "./CurrentTimeIndicator";
import { useCalendarStore } from "@/stores/calendarStore";
import { useToast } from "@/components/app/Toast";
import {
  START_HOUR,
  END_HOUR,
  HOUR_HEIGHT,
  isSameDay,
  getMonday,
  DAY_NAMES_SHORT,
  MONTH_NAMES,
} from "./calendarUtils";

interface DayViewProps {
  date: Date;
}

export default function DayView({ date }: DayViewProps) {
  const t = useTranslations("CalendarPage");
  const today = new Date();
  const isToday = isSameDay(date, today);
  const totalHours = END_HOUR - START_HOUR;
  const gridHeight = totalHours * HOUR_HEIGHT;
  const scrollRef = useRef<HTMLDivElement>(null);
  const events = useCalendarStore((s) => s.events);
  const moveEvent = useCalendarStore((s) => s.moveEvent);
  const { showToast } = useToast();

  const monday = getMonday(date);
  const dayOfWeek = Math.round(
    (date.getTime() - monday.getTime()) / (1000 * 60 * 60 * 24),
  );

  const dayEvents = events.filter((e) => e.dayOfWeek === dayOfWeek);

  const [isDragOver, setIsDragOver] = useState(false);
  const [dropHour, setDropHour] = useState<number | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = HOUR_HEIGHT * 1.5;
    }
  }, []);

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      setIsDragOver(true);
      const rect = e.currentTarget.getBoundingClientRect();
      const y = e.clientY - rect.top;
      const hour = Math.floor(y / HOUR_HEIGHT) + START_HOUR;
      setDropHour(Math.max(START_HOUR, Math.min(hour, END_HOUR - 1)));
    },
    [],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const eventId = e.dataTransfer.getData("text/plain");
      if (!eventId) return;

      const rect = e.currentTarget.getBoundingClientRect();
      const y = e.clientY - rect.top;
      const totalMinutes = (y / HOUR_HEIGHT) * 60 + START_HOUR * 60;
      const snappedMinutes = Math.round(totalMinutes / 15) * 15;
      const newHour = Math.floor(snappedMinutes / 60);
      const newMinute = snappedMinutes % 60;
      const clampedHour = Math.max(START_HOUR, Math.min(newHour, END_HOUR - 1));

      const draggedEvent = events.find((ev) => ev.id === eventId);
      if (!draggedEvent) return;

      const duration =
        (draggedEvent.endHour - draggedEvent.startHour) * 60 +
        (draggedEvent.endMinute - draggedEvent.startMinute);
      const newEndMinutes = clampedHour * 60 + newMinute + duration;
      const newEndHour = Math.floor(newEndMinutes / 60);
      const newEndMin = newEndMinutes % 60;

      const hasConflict = events.some((ev) => {
        if (ev.id === eventId || ev.dayOfWeek !== dayOfWeek) return false;
        const evStart = ev.startHour * 60 + ev.startMinute;
        const evEnd = ev.endHour * 60 + ev.endMinute;
        const newStart = clampedHour * 60 + newMinute;
        const newEnd = newEndHour * 60 + newEndMin;
        return newStart < evEnd && newEnd > evStart;
      });

      moveEvent(eventId, dayOfWeek, clampedHour, newMinute);

      if (hasConflict) {
        showToast("Event overlaps with another event", "warning");
      } else {
        showToast(`Moved "${draggedEvent.title}" to ${clampedHour}:${String(newMinute).padStart(2, "0")}`, "success");
      }
      setIsDragOver(false);
      setDropHour(null);
    },
    [events, moveEvent, showToast, dayOfWeek],
  );

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
    setDropHour(null);
  }, []);

  const dayLabel = `${DAY_NAMES_SHORT[dayOfWeek] ?? ""} ${date.getDate()} ${MONTH_NAMES[date.getMonth()]}`;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col h-full"
    >
      {/* Day header */}
      <div className="flex items-center gap-3 border-b border-lumina-200 bg-white/80 backdrop-blur-sm sticky top-0 z-20 px-4 py-3">
        <div
          className={`w-10 h-10 flex items-center justify-center rounded-full text-lg font-bold ${
            isToday
              ? "bg-google-blue-500 text-white"
              : "bg-lumina-100 text-lumina-700"
          }`}
        >
          {date.getDate()}
        </div>
        <div>
          <p className="text-sm font-semibold text-lumina-900">{dayLabel}</p>
          {isToday && (
            <p className="text-[10px] text-google-blue-600 font-medium">{t("today")}</p>
          )}
        </div>
        <span className="ml-auto text-xs text-lumina-400">
          {dayEvents.length} {t("events")}
        </span>
      </div>

      {/* Scrollable time grid */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="flex" style={{ minHeight: gridHeight }}>
          <TimeColumn />
          <div
            className={`flex-1 relative border-l border-lumina-100 transition-colors ${
              isToday ? "bg-google-blue-50/20" : ""
            } ${isDragOver ? "bg-google-blue-50/40" : ""}`}
            style={{ height: gridHeight }}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragLeave={handleDragLeave}
          >
            {Array.from({ length: totalHours }, (_, i) => (
              <div
                key={i}
                className="absolute left-0 right-0 border-t border-lumina-100"
                style={{ top: i * HOUR_HEIGHT }}
              />
            ))}

            {/* Drop indicator */}
            {isDragOver && dropHour !== null && (
              <div
                className="absolute left-0 right-0 h-0.5 bg-google-blue-400 z-20 pointer-events-none"
                style={{ top: (dropHour - START_HOUR) * HOUR_HEIGHT }}
              >
                <div className="absolute -left-1 -top-1 w-2.5 h-2.5 rounded-full bg-google-blue-400" />
              </div>
            )}

            {dayEvents.map((event) => (
              <EventBlock
                key={event.id}
                event={event}
                positioned
                showTag
                draggable
              />
            ))}
            {isToday && <CurrentTimeIndicator />}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
