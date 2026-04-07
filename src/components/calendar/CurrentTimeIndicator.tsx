"use client";

import { useEffect, useState } from "react";
import { START_HOUR, END_HOUR, HOUR_HEIGHT } from "./calendarUtils";

/** Red line + dot showing the current time on the calendar grid */
export default function CurrentTimeIndicator() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(timer);
  }, []);

  if (!now) return null;

  const hour = now.getHours();
  const minute = now.getMinutes();

  // Only show if within visible range
  if (hour < START_HOUR || hour >= END_HOUR) return null;

  const top = (hour - START_HOUR + minute / 60) * HOUR_HEIGHT;

  return (
    <div
      className="absolute left-0 right-0 z-30 pointer-events-none"
      style={{ top: `${top}px` }}
    >
      <div className="relative flex items-center">
        <div className="w-2.5 h-2.5 rounded-full bg-google-red-500 -ml-1 flex-shrink-0 shadow-sm" />
        <div className="flex-1 h-[2px] bg-google-red-500" />
      </div>
    </div>
  );
}
