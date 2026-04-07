import { create } from "zustand";
import {
  type CalendarEvent,
  mockEvents as initialMockEvents,
} from "@/components/calendar/mockData";

interface CalendarStore {
  events: CalendarEvent[];
  /** Move an event to a new day/time */
  moveEvent: (
    eventId: string,
    newDayOfWeek: number,
    newStartHour: number,
    newStartMinute: number,
  ) => void;
  /** Add a new event */
  addEvent: (event: CalendarEvent) => void;
}

export const useCalendarStore = create<CalendarStore>((set) => ({
  events: [...initialMockEvents],

  moveEvent: (eventId, newDayOfWeek, newStartHour, newStartMinute) =>
    set((state) => ({
      events: state.events.map((e) => {
        if (e.id !== eventId) return e;
        const durationMinutes =
          (e.endHour - e.startHour) * 60 + (e.endMinute - e.startMinute);
        const totalEndMinutes = newStartHour * 60 + newStartMinute + durationMinutes;
        return {
          ...e,
          dayOfWeek: newDayOfWeek,
          startHour: newStartHour,
          startMinute: newStartMinute,
          endHour: Math.floor(totalEndMinutes / 60),
          endMinute: totalEndMinutes % 60,
        };
      }),
    })),

  addEvent: (event) =>
    set((state) => ({ events: [...state.events, event] })),
}));
