import { create } from "zustand";

export interface Goal {
  id: string;
  title: string;
  description?: string;
  type: "weekly" | "monthly" | "custom";
  targetCount: number;
  currentCount: number;
  unit: string;
  color: "blue" | "green" | "red" | "yellow";
  deadline?: string;
  createdAt: string;
}

const mockGoals: Goal[] = [
  {
    id: "g1",
    title: "Complete 10 tasks this week",
    description: "Stay productive and clear your backlog",
    type: "weekly",
    targetCount: 10,
    currentCount: 4,
    unit: "tasks",
    color: "blue",
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "g2",
    title: "5 hours of deep work daily",
    description: "Focus on high-priority tasks without interruptions",
    type: "weekly",
    targetCount: 25,
    currentCount: 18,
    unit: "hours",
    color: "green",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "g3",
    title: "Read 4 books this month",
    type: "monthly",
    targetCount: 4,
    currentCount: 1,
    unit: "books",
    color: "yellow",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "g4",
    title: "Exercise 3 times per week",
    description: "Stay healthy and energized",
    type: "weekly",
    targetCount: 3,
    currentCount: 2,
    unit: "sessions",
    color: "red",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

interface GoalStore {
  goals: Goal[];
  addGoal: (goal: Goal) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  incrementProgress: (id: string) => void;
}

export const useGoalStore = create<GoalStore>((set) => ({
  goals: mockGoals,
  addGoal: (goal) => set((s) => ({ goals: [goal, ...s.goals] })),
  updateGoal: (id, updates) => set((s) => ({ goals: s.goals.map((g) => g.id === id ? { ...g, ...updates } : g) })),
  deleteGoal: (id) => set((s) => ({ goals: s.goals.filter((g) => g.id !== id) })),
  incrementProgress: (id) => set((s) => ({
    goals: s.goals.map((g) => g.id === id ? { ...g, currentCount: Math.min(g.currentCount + 1, g.targetCount) } : g),
  })),
}));
