import { create } from "zustand";

interface FocusState {
  active: boolean;
  taskId: string | null;
  taskTitle: string | null;
  startedAt: number | null;
  elapsedSeconds: number;
}

interface FocusActions {
  startFocus: (taskId: string, taskTitle: string) => void;
  stopFocus: () => void;
  tickElapsed: () => void;
}

export const useFocusStore = create<FocusState & FocusActions>((set, get) => ({
  active: false,
  taskId: null,
  taskTitle: null,
  startedAt: null,
  elapsedSeconds: 0,

  startFocus: (taskId, taskTitle) =>
    set({ active: true, taskId, taskTitle, startedAt: Date.now(), elapsedSeconds: 0 }),

  stopFocus: () =>
    set({ active: false, taskId: null, taskTitle: null, startedAt: null, elapsedSeconds: 0 }),

  tickElapsed: () => {
    const s = get();
    if (s.active && s.startedAt) {
      set({ elapsedSeconds: Math.floor((Date.now() - s.startedAt) / 1000) });
    }
  },
}));
