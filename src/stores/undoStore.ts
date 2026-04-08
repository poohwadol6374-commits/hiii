import { create } from "zustand";

export interface UndoAction {
  id: string;
  label: string;
  undo: () => void;
  redo: () => void;
  timestamp: number;
}

interface UndoStore {
  history: UndoAction[];
  future: UndoAction[];
  push: (action: Omit<UndoAction, "id" | "timestamp">) => void;
  undo: () => UndoAction | null;
  redo: () => UndoAction | null;
  canUndo: () => boolean;
  canRedo: () => boolean;
  lastAction: () => UndoAction | null;
}

const MAX_HISTORY = 30;

export const useUndoStore = create<UndoStore>((set, get) => ({
  history: [],
  future: [],

  push: (action) => {
    const entry: UndoAction = {
      ...action,
      id: `undo-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      timestamp: Date.now(),
    };
    set((s) => ({
      history: [...s.history.slice(-MAX_HISTORY + 1), entry],
      future: [], // clear redo stack on new action
    }));
  },

  undo: () => {
    const s = get();
    if (s.history.length === 0) return null;
    const action = s.history[s.history.length - 1];
    action.undo();
    set({
      history: s.history.slice(0, -1),
      future: [action, ...s.future],
    });
    return action;
  },

  redo: () => {
    const s = get();
    if (s.future.length === 0) return null;
    const action = s.future[0];
    action.redo();
    set({
      history: [...s.history, action],
      future: s.future.slice(1),
    });
    return action;
  },

  canUndo: () => get().history.length > 0,
  canRedo: () => get().future.length > 0,
  lastAction: () => {
    const h = get().history;
    return h.length > 0 ? h[h.length - 1] : null;
  },
}));
