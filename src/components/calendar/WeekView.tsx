"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useCalendarStore } from "@/stores/calendarStore";
import EventBlock from "./EventBlock";
import TimeColumn from "./TimeColumn";
import CurrentTimeIndicator from "./CurrentTimeIndicator";
import EventCreateModal from "./EventCreateModal";
import EventDetailModal from "./EventDetailModal";
import { useToast } from "@/components/app/Toast";
import { type CalendarEvent } from "./mockData";
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
  const events = useCalendarStore((s) => s.events);
  const moveEvent = useCalendarStore((s) => s.moveEvent);
  const { showToast } = useToast();

  const [createOpen, setCreateOpen] = useState(false);
  const [createDay, setCreateDay] = useState(0);
  const [createHour, setCreateHour] = useState(9);
  const [createMinute, setCreateMinute] = useState(0);
  const [detailEvent, setDetailEvent] = useState<CalendarEvent | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = HOUR_HEIGHT * 1.5;
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, dayIndex: number) => {
    e.preventDefault();
    const eventId = e.dataTransfer.getData("text/plain");
    if (!eventId) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const totalMin = Math.round(((y / HOUR_HEIGHT) * 60 + START_HOUR * 60) / 15) * 15;
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    moveEvent(eventId, dayIndex, Math.max(START_HOUR, Math.min(h, END_HOUR - 1)), m);
    const ev = events.find((e) => e.id === eventId);
    if (ev) showToast(`Moved "${ev.title}"`, "success");
  }, [events, moveEvent, showToast]);

  const handleColumnClick = useCallback((e: React.MouseEvent, dayIndex: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const totalMin = Math.round(((y / HOUR_HEIGHT) * 60 + START_HOUR * 60) / 15) * 15;
    setCreateDay(dayIndex);
    setCreateHour(Math.floor(totalMin / 60));
    setCreateMinute(totalMin % 60);
    setCreateOpen(true);
  }, []);

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }} className="flex flex-col h-full">
      {/* Day headers */}
      <div className="flex border-b border-lumina-200 dark:border-lumina-800 bg-white/80 dark:bg-lumina-900/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="flex-shrink-0 w-14" />
        {weekDates.map((date, i) => {
          const isToday = isSameDay(date, today);
          return (
            <div key={i} className="flex-1 flex flex-col items-center py-2 min-w-0">
              <span className="text-[10px] font-medium text-lumina-400 uppercase tracking-wide">{DAY_NAMES_SHORT[i]}</span>
              <span className={`mt-0.5 w-7 h-7 flex items-center justify-center rounded-full text-sm font-semibold ${
                isToday ? "bg-pink-600 text-white" : "text-lumina-800 dark:text-lumina-200"
              }`}>{date.getDate()}</span>
            </div>
          );
        })}
      </div>

      {/* Scrollable time grid */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="flex" style={{ minHeight: gridHeight }}>
          <TimeColumn />
          <div className="flex-1 flex relative">
            {Array.from({ length: totalHours }, (_, i) => (
              <div key={i} className="absolute left-0 right-0 border-t border-lumina-100 dark:border-lumina-800" style={{ top: i * HOUR_HEIGHT }} />
            ))}
            {weekDates.map((date, dayIndex) => {
              const isToday = isSameDay(date, today);
              const dayEvents = events.filter((e) => e.dayOfWeek === dayIndex);
              return (
                <div key={dayIndex}
                  className={`flex-1 relative border-l border-lumina-100 dark:border-lumina-800 min-w-0 ${isToday ? "bg-pink-50/20 dark:bg-pink-900/5" : ""}`}
                  style={{ height: gridHeight }}
                  onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; }}
                  onDrop={(e) => handleDrop(e, dayIndex)}
                  onClick={(e) => handleColumnClick(e, dayIndex)}>
                  {dayEvents.map((event) => (
                    <EventBlock key={event.id} event={event} positioned draggable
                      onClickEvent={() => setDetailEvent(event)} />
                  ))}
                  {isToday && <CurrentTimeIndicator />}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <EventCreateModal open={createOpen} onClose={() => setCreateOpen(false)} defaultDay={createDay} defaultStartHour={createHour} defaultStartMinute={createMinute} />
      <EventDetailModal event={detailEvent} open={!!detailEvent} onClose={() => setDetailEvent(null)} />
    </motion.div>
  );
}
