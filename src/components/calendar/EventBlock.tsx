"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  type CalendarEvent,
  type EventCategory,
  categoryStyles,
  categoryLabels,
} from "./mockData";
import {
  formatTimeRange,
  getTopPosition,
  getEventHeight,
} from "./calendarUtils";

interface EventBlockProps {
  event: CalendarEvent;
  showTag?: boolean;
  positioned?: boolean;
  draggable?: boolean;
  onDragStartCallback?: (event: CalendarEvent) => void;
}

export default function EventBlock({
  event,
  showTag = false,
  positioned = true,
  draggable = false,
  onDragStartCallback,
}: EventBlockProps) {
  const style = categoryStyles[event.category];
  const timeStr = formatTimeRange(
    event.startHour,
    event.startMinute,
    event.endHour,
    event.endMinute,
  );
  const height = getEventHeight(
    event.startHour,
    event.startMinute,
    event.endHour,
    event.endMinute,
  );
  const top = getTopPosition(event.startHour, event.startMinute);
  const isShort = height < 40;
  const ref = useRef<HTMLDivElement>(null);

  // Attach native HTML5 drag events via ref to avoid Framer Motion conflict
  useEffect(() => {
    const el = ref.current;
    if (!el || !draggable) return;

    const handleNativeDragStart = (e: DragEvent) => {
      if (e.dataTransfer) {
        e.dataTransfer.setData("text/plain", event.id);
        e.dataTransfer.effectAllowed = "move";
      }
      onDragStartCallback?.(event);
    };

    el.addEventListener("dragstart", handleNativeDragStart);
    return () => el.removeEventListener("dragstart", handleNativeDragStart);
  }, [draggable, event, onDragStartCallback]);

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02, boxShadow: "0 4px 16px rgba(0,0,0,0.10)" }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      draggable={draggable}
      className={`${style.bg} ${style.border} border rounded-lg px-2.5 overflow-hidden cursor-pointer select-none group ${
        positioned ? "absolute left-1 right-1" : "relative"
      } ${draggable ? "active:opacity-60 active:shadow-lg" : ""}`}
      style={
        positioned
          ? { top: `${top}px`, height: `${Math.max(height, 22)}px`, zIndex: 10 }
          : { minHeight: "22px" }
      }
    >
      {/* Drag handle dots */}
      {draggable && (
        <div className="absolute top-0.5 left-1/2 -translate-x-1/2 flex gap-0.5 opacity-0 group-hover:opacity-60 transition-opacity">
          <span className="w-1 h-1 rounded-full bg-lumina-400" />
          <span className="w-1 h-1 rounded-full bg-lumina-400" />
          <span className="w-1 h-1 rounded-full bg-lumina-400" />
        </div>
      )}
      <div
        className={`flex ${isShort ? "flex-row items-center gap-2" : "flex-col justify-center gap-0.5"} h-full py-1`}
      >
        <p className={`text-xs font-semibold ${style.text} truncate leading-tight`}>
          {event.title}
        </p>
        {!isShort && (
          <p className="text-[10px] text-lumina-500 leading-tight">{timeStr}</p>
        )}
        {isShort && (
          <p className="text-[10px] text-lumina-400 leading-tight flex-shrink-0">
            {timeStr}
          </p>
        )}
        {showTag && !isShort && (
          <span
            className={`inline-flex items-center gap-1 text-[10px] font-medium ${style.text} mt-0.5`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
            {categoryLabels[event.category]}
          </span>
        )}
      </div>
    </motion.div>
  );
}

/** Small dot/chip for month view */
export function EventDot({ category }: { category: EventCategory }) {
  const style = categoryStyles[category];
  return <span className={`w-1.5 h-1.5 rounded-full ${style.dot} inline-block`} />;
}
