import { create } from "zustand";

export type Theme = "light" | "dark" | "auto";
export type CalendarView = "day" | "week" | "month";
export type AnimationLevel = "full" | "reduced" | "none";
export type LumaPersonality = "formal" | "friendly" | "cheerful" | "motivational" | "minimal";
export type AIAggressiveness = "conservative" | "balanced" | "proactive";
export type AppLocale = "th" | "en";

export interface SettingsState {
  // Profile
  displayName: string;
  email: string;
  // Appearance
  theme: Theme;
  animationLevel: AnimationLevel;
  // Calendar
  defaultCalendarView: CalendarView;
  workingHoursStart: string;
  workingHoursEnd: string;
  // Luma AI
  lumaPersonality: LumaPersonality;
  aiAggressiveness: AIAggressiveness;
  // Language
  locale: AppLocale;
  // Pomodoro
  pomodoroWorkMinutes: number;
  pomodoroBreakMinutes: number;
}

interface SettingsActions {
  setDisplayName: (name: string) => void;
  setTheme: (theme: Theme) => void;
  setAnimationLevel: (level: AnimationLevel) => void;
  setDefaultCalendarView: (view: CalendarView) => void;
  setWorkingHoursStart: (time: string) => void;
  setWorkingHoursEnd: (time: string) => void;
  setLumaPersonality: (personality: LumaPersonality) => void;
  setAIAggressiveness: (level: AIAggressiveness) => void;
  setLocale: (locale: AppLocale) => void;
  setPomodoroWorkMinutes: (minutes: number) => void;
  setPomodoroBreakMinutes: (minutes: number) => void;
}

export const useSettingsStore = create<SettingsState & SettingsActions>((set) => ({
  // Defaults
  displayName: "Demo User",
  email: "demo@lumina.app",
  theme: "light",
  animationLevel: "full",
  defaultCalendarView: "week",
  workingHoursStart: "09:00",
  workingHoursEnd: "18:00",
  lumaPersonality: "friendly",
  aiAggressiveness: "balanced",
  locale: "th",
  pomodoroWorkMinutes: 25,
  pomodoroBreakMinutes: 5,

  // Actions
  setDisplayName: (name) => set({ displayName: name }),
  setTheme: (theme) => set({ theme }),
  setAnimationLevel: (level) => set({ animationLevel: level }),
  setDefaultCalendarView: (view) => set({ defaultCalendarView: view }),
  setWorkingHoursStart: (time) => set({ workingHoursStart: time }),
  setWorkingHoursEnd: (time) => set({ workingHoursEnd: time }),
  setLumaPersonality: (personality) => set({ lumaPersonality: personality }),
  setAIAggressiveness: (level) => set({ aiAggressiveness: level }),
  setLocale: (locale) => set({ locale }),
  setPomodoroWorkMinutes: (minutes) => set({ pomodoroWorkMinutes: Math.max(1, Math.min(60, minutes)) }),
  setPomodoroBreakMinutes: (minutes) => set({ pomodoroBreakMinutes: Math.max(1, Math.min(30, minutes)) }),
}));
