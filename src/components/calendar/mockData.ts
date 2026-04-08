// Mock calendar events for demo purposes
// Events are generated relative to the current week

export type EventCategory = "meeting" | "focus" | "break" | "personal";
export type RecurrenceType = "none" | "daily" | "weekdays" | "weekly" | "biweekly" | "monthly";

export interface CalendarEvent {
  id: string;
  title: string;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  dayOfWeek: number; // 0=Mon, 1=Tue, 2=Wed, 3=Thu, 4=Fri, 5=Sat, 6=Sun
  category: EventCategory;
  recurrence?: RecurrenceType;
  recurrenceId?: string; // shared ID for all instances of a recurring event
}

export const categoryStyles: Record<
  EventCategory,
  { bg: string; border: string; text: string; dot: string }
> = {
  meeting: {
    bg: "bg-google-blue-50",
    border: "border-google-blue-200",
    text: "text-google-blue-700",
    dot: "bg-google-blue-500",
  },
  focus: {
    bg: "bg-google-green-50",
    border: "border-google-green-200",
    text: "text-google-green-700",
    dot: "bg-google-green-500",
  },
  break: {
    bg: "bg-google-yellow-50",
    border: "border-google-yellow-200",
    text: "text-google-yellow-700",
    dot: "bg-google-yellow-500",
  },
  personal: {
    bg: "bg-google-red-50",
    border: "border-google-red-200",
    text: "text-google-red-700",
    dot: "bg-google-red-500",
  },
};

export const categoryLabels: Record<EventCategory, string> = {
  meeting: "Meeting",
  focus: "Focus",
  break: "Break",
  personal: "Personal",
};

export const mockEvents: CalendarEvent[] = [
  // Monday
  { id: "e1", title: "Team Standup", startHour: 9, startMinute: 0, endHour: 9, endMinute: 30, dayOfWeek: 0, category: "meeting", recurrence: "weekdays", recurrenceId: "rec-standup" },
  { id: "e2", title: "Deep Work: Q4 Report", startHour: 10, startMinute: 0, endHour: 12, endMinute: 0, dayOfWeek: 0, category: "focus" },
  { id: "e3", title: "Design Review", startHour: 14, startMinute: 0, endHour: 15, endMinute: 0, dayOfWeek: 0, category: "meeting", recurrence: "weekly", recurrenceId: "rec-design-review" },
  // Tuesday
  { id: "e4", title: "Team Standup", startHour: 9, startMinute: 0, endHour: 9, endMinute: 30, dayOfWeek: 1, category: "meeting", recurrence: "weekdays", recurrenceId: "rec-standup" },
  { id: "e5", title: "Client Presentation", startHour: 11, startMinute: 0, endHour: 12, endMinute: 30, dayOfWeek: 1, category: "meeting" },
  { id: "e6", title: "Focus: Code Review", startHour: 14, startMinute: 0, endHour: 16, endMinute: 0, dayOfWeek: 1, category: "focus" },
  // Wednesday
  { id: "e7", title: "Team Standup", startHour: 9, startMinute: 0, endHour: 9, endMinute: 30, dayOfWeek: 2, category: "meeting", recurrence: "weekdays", recurrenceId: "rec-standup" },
  { id: "e8", title: "1:1 with Manager", startHour: 10, startMinute: 0, endHour: 11, endMinute: 0, dayOfWeek: 2, category: "break", recurrence: "weekly", recurrenceId: "rec-1on1" },
  { id: "e9", title: "Lunch Break", startHour: 13, startMinute: 0, endHour: 14, endMinute: 0, dayOfWeek: 2, category: "break", recurrence: "daily", recurrenceId: "rec-lunch" },
  { id: "e10", title: "Sprint Planning", startHour: 15, startMinute: 0, endHour: 17, endMinute: 0, dayOfWeek: 2, category: "meeting", recurrence: "biweekly", recurrenceId: "rec-sprint" },
  // Thursday
  { id: "e11", title: "Team Standup", startHour: 9, startMinute: 0, endHour: 9, endMinute: 30, dayOfWeek: 3, category: "meeting", recurrence: "weekdays", recurrenceId: "rec-standup" },
  { id: "e12", title: "Deep Work: Feature Dev", startHour: 10, startMinute: 0, endHour: 12, endMinute: 0, dayOfWeek: 3, category: "focus" },
  { id: "e13", title: "Team Retrospective", startHour: 14, startMinute: 0, endHour: 15, endMinute: 30, dayOfWeek: 3, category: "meeting", recurrence: "biweekly", recurrenceId: "rec-retro" },
  // Friday
  { id: "e14", title: "Team Standup", startHour: 9, startMinute: 0, endHour: 9, endMinute: 30, dayOfWeek: 4, category: "meeting", recurrence: "weekdays", recurrenceId: "rec-standup" },
  { id: "e15", title: "Focus: Bug Fixes", startHour: 10, startMinute: 0, endHour: 11, endMinute: 30, dayOfWeek: 4, category: "focus" },
  { id: "e16", title: "Weekly Review", startHour: 13, startMinute: 0, endHour: 14, endMinute: 0, dayOfWeek: 4, category: "meeting", recurrence: "weekly", recurrenceId: "rec-weekly-review" },
  { id: "e17", title: "Personal: Gym", startHour: 15, startMinute: 0, endHour: 16, endMinute: 0, dayOfWeek: 4, category: "personal", recurrence: "weekly", recurrenceId: "rec-gym" },
];
