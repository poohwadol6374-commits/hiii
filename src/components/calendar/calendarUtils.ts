// Calendar utility functions

/** Start hour of the calendar grid */
export const START_HOUR = 0;
/** End hour of the calendar grid */
export const END_HOUR = 24;
/** Height in pixels per hour */
export const HOUR_HEIGHT = 64;

/** Format a number as two-digit time string */
export function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

/** Format time range string */
export function formatTimeRange(
  startHour: number,
  startMinute: number,
  endHour: number,
  endMinute: number,
): string {
  return `${pad(startHour)}:${pad(startMinute)} – ${pad(endHour)}:${pad(endMinute)}`;
}

/** Get the Monday of the week containing the given date */
export function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  // getDay: 0=Sun, 1=Mon ... 6=Sat → offset to Monday
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Get array of 7 dates for the week starting from Monday */
export function getWeekDates(monday: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

/** Check if two dates are the same calendar day */
export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** Get top position in px for a given hour:minute */
export function getTopPosition(hour: number, minute: number): number {
  return (hour - START_HOUR + minute / 60) * HOUR_HEIGHT;
}

/** Get height in px for a duration */
export function getEventHeight(
  startHour: number,
  startMinute: number,
  endHour: number,
  endMinute: number,
): number {
  const durationMinutes =
    (endHour - startHour) * 60 + (endMinute - startMinute);
  return (durationMinutes / 60) * HOUR_HEIGHT;
}

/** Short day names */
export const DAY_NAMES_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const DAY_NAMES_TH = ["จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส.", "อา."];

/** Month names */
export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
export const MONTH_NAMES_TH = [
  "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
  "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม",
];

/** Get the first day of the month */
export function getFirstDayOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

/** Get number of days in a month */
export function getDaysInMonth(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

/** Get the day of week for a date (0=Mon, 6=Sun) */
export function getDayOfWeekMondayStart(date: Date): number {
  const day = date.getDay();
  return day === 0 ? 6 : day - 1;
}
