import { create } from "zustand";

export type PomodoroMode = "work" | "break";
export type PomodoroStatus = "idle" | "running" | "paused";

interface PomodoroState {
  isOpen: boolean;
  status: PomodoroStatus;
  mode: PomodoroMode;
  secondsRemaining: number;
  totalSeconds: number;
  currentSession: number;
  totalSessions: number;
  linkedTaskId: string | null;
  linkedTaskTitle: string | null;
  completedSessions: number;
}

interface PomodoroActions {
  toggleOpen: () => void;
  setOpen: (open: boolean) => void;
  start: (workMinutes: number, breakMinutes: number) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  skip: (workMinutes: number, breakMinutes: number) => void;
  tick: () => { finished: boolean; workMinutes: number; breakMinutes: number } | null;
  linkTask: (taskId: string, taskTitle: string) => void;
  unlinkTask: () => void;
}

export const usePomodoroStore = create<PomodoroState & PomodoroActions>((set, get) => ({
  isOpen: false,
  status: "idle",
  mode: "work",
  secondsRemaining: 25 * 60,
  totalSeconds: 25 * 60,
  currentSession: 1,
  totalSessions: 4,
  linkedTaskId: null,
  linkedTaskTitle: null,
  completedSessions: 0,

  toggleOpen: () => set((s) => ({ isOpen: !s.isOpen })),
  setOpen: (open) => set({ isOpen: open }),

  start: (workMinutes, breakMinutes) => {
    void breakMinutes;
    const total = workMinutes * 60;
    set({
      status: "running",
      mode: "work",
      secondsRemaining: total,
      totalSeconds: total,
      currentSession: get().status === "idle" ? 1 : get().currentSession,
    });
  },

  pause: () => set({ status: "paused" }),
  resume: () => set({ status: "running" }),

  stop: () =>
    set({
      status: "idle",
      mode: "work",
      secondsRemaining: 25 * 60,
      totalSeconds: 25 * 60,
      currentSession: 1,
      completedSessions: 0,
      linkedTaskId: null,
      linkedTaskTitle: null,
    }),

  skip: (workMinutes, breakMinutes) => {
    const s = get();
    if (s.mode === "work") {
      // Skip to break
      const total = breakMinutes * 60;
      set({
        mode: "break",
        secondsRemaining: total,
        totalSeconds: total,
        status: "running",
        completedSessions: s.completedSessions + 1,
      });
    } else {
      // Skip to next work session
      const nextSession = s.currentSession + 1;
      const total = workMinutes * 60;
      if (nextSession > s.totalSessions) {
        // All sessions done
        set({
          status: "idle",
          mode: "work",
          secondsRemaining: workMinutes * 60,
          totalSeconds: workMinutes * 60,
          currentSession: 1,
          completedSessions: 0,
        });
      } else {
        set({
          mode: "work",
          secondsRemaining: total,
          totalSeconds: total,
          currentSession: nextSession,
          status: "running",
        });
      }
    }
  },

  tick: () => {
    const s = get();
    if (s.status !== "running") return null;
    const next = s.secondsRemaining - 1;
    if (next <= 0) {
      // Timer finished
      return { finished: true, workMinutes: 25, breakMinutes: 5 };
    }
    set({ secondsRemaining: next });
    return null;
  },

  linkTask: (taskId, taskTitle) => set({ linkedTaskId: taskId, linkedTaskTitle: taskTitle }),
  unlinkTask: () => set({ linkedTaskId: null, linkedTaskTitle: null }),
}));
