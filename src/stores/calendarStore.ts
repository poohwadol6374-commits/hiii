import { create } from "zustand";
import {
  type CalendarEvent,
  mockEvents as initialMockEvents,
} from "@/components/calendar/mockData";

interface CalendarStore {
  events: CalendarEvent[];
  moveEvent: (eventId: string, newDayOfWeek: number, newStartHour: number, newStartMinute: number) => void;
  addEvent: (event: CalendarEvent) => void;
  updateEvent: (eventId: string, updates: Partial<CalendarEvent>) => void;
  deleteEvent: (eventId: string) => void;
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

  updateEvent: (eventId, updates) =>
    set((state) => ({
      events: state.events.map((e) => e.id === eventId ? { ...e, ...updates } : e),
    })),

  deleteEvent: (eventId) =>
    set((state) => ({ events: state.events.filter((e) => e.id !== eventId) })),
}));
