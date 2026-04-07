"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { type CalendarEvent, mockEvents } from "./mockData";
import EventBlock from "./EventBlock";
import TimeColumn from "./TimeColumn";
import CurrentTimeIndicator from "./CurrentTimeIndicator";
import {
  START_HOUR,
  END_HOUR,
  HOUR_HEIGHT,
  getWeekDates,
  isSameDay,
  DAY_NAMES_SHORT,
} from "./calendarUtils";

interface WeekViewProps {
  monday: Date;
}

export default function WeekView({ monday }: WeekViewProps) {
  const weekDates = getWeekDates(monday);
  const today = new Date();
  const totalHours = END_HOUR - START_HOUR;
  const gridHeight = totalHours * HOUR_HEIGHT;
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to ~8am on mount
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = HOUR_HEIGHT * 1.5; // 1.5 hours from top = ~8:30
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col h-full"
    >
      {/* Day headers */}
      <div className="flex border-b border-lumina-200 bg-white/80 backdrop-blur-sm sticky top-0 z-20">
        {/* Spacer for time column */}
        <div className="flex-shrink-0 w-14" />
        {weekDates.map((date, i) => {
          const isToday = isSameDay(date, today);
          return (
            <div
              key={i}
              className="flex-1 flex flex-col items-center py-2 min-w-0"
            >
              <span className="text-[10px] font-medium text-lumina-400 uppercase tracking-wide">
                {DAY_NAMES_SHORT[i]}
              </span>
              <span
                className={`mt-0.5 w-7 h-7 flex items-center justify-center rounded-full text-sm font-semibold ${
                  isToday
                    ? "bg-google-blue-500 text-white"
                    : "text-lumina-800"
                }`}
              >
                {date.getDate()}
              </span>
            </div>
          );
        })}
      </div>

      {/* Scrollable time grid */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="flex" style={{ minHeight: gridHeight }}>
          {/* Time labels */}
          <TimeColumn />

          {/* Day columns */}
          <div className="flex-1 flex relative">
            {/* Horizontal grid lines */}
            {Array.from({ length: totalHours }, (_, i) => (
              <div
                key={i}
                className="absolute left-0 right-0 border-t border-lumina-100"
                style={{ top: i * HOUR_HEIGHT }}
              />
            ))}

            {weekDates.map((date, dayIndex) => {
              const isToday = isSameDay(date, today);
              const dayEvents = mockEvents.filter(
                (e) => e.dayOfWeek === dayIndex,
              );

              return (
                <div
                  key={dayIndex}
                  className={`flex-1 relative border-l border-lumina-100 min-w-0 ${
                    isToday ? "bg-google-blue-50/30" : ""
                  }`}
                  style={{ height: gridHeight }}
                >
                  {/* Events */}
                  {dayEvents.map((event) => (
                    <EventBlock key={event.id} event={event} positioned />
                  ))}

                  {/* Current time indicator (only on today's column) */}
                  {isToday && <CurrentTimeIndicator />}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
