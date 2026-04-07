"use client";

import { START_HOUR, END_HOUR, HOUR_HEIGHT, pad } from "./calendarUtils";

/** Renders the time labels column (7:00 – 22:00) */
export default function TimeColumn() {
  const hours = Array.from(
    { length: END_HOUR - START_HOUR },
    (_, i) => START_HOUR + i,
  );

  return (
    <div className="flex-shrink-0 w-14 relative" style={{ height: hours.length * HOUR_HEIGHT }}>
      {hours.map((hour) => (
        <div
          key={hour}
          className="absolute left-0 right-0 flex items-start justify-end pr-2"
          style={{ top: (hour - START_HOUR) * HOUR_HEIGHT - 6 }}
        >
          <span className="text-[10px] text-lumina-400 font-medium tabular-nums">
            {pad(hour)}:00
          </span>
        </div>
      ))}
    </div>
  );
}
