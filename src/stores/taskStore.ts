import { create } from "zustand";

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: string;
  priority: "high" | "medium" | "low";
  status: "pending" | "in_progress" | "completed";
  deadline?: string;
  estimatedDuration: number;
  tags: string[];
  energyLevel: "high" | "medium" | "low";
  createdAt: string;
}

const mockTasks: Task[] = [
  {
    id: "t1",
    title: "Prepare Q4 Financial Report",
    description: "Compile quarterly financial data and create presentation slides for the board meeting.",
    category: "work",
    priority: "high",
    status: "in_progress",
    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    estimatedDuration: 120,
    tags: ["finance", "report"],
    energyLevel: "high",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "t2",
    title: "Review Pull Requests",
    description: "Review and approve pending PRs from the frontend team.",
    category: "development",
    priority: "high",
    status: "pending",
    deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    estimatedDuration: 60,
    tags: ["code-review", "team"],
    energyLevel: "medium",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "t3",
    title: "Design System Update",
    description: "Update color tokens and component library to match new brand guidelines.",
    category: "design",
    priority: "medium",
    status: "pending",
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    estimatedDuration: 90,
    tags: ["design", "ui"],
    energyLevel: "high",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "t4",
    title: "Weekly Team Standup Notes",
    description: "Summarize action items from this week's standup meetings.",
    category: "work",
    priority: "low",
    status: "completed",
    estimatedDuration: 30,
    tags: ["meeting", "notes"],
    energyLevel: "low",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "t5",
    title: "Set Up CI/CD Pipeline",
    description: "Configure GitHub Actions for automated testing and deployment.",
    category: "development",
    priority: "high",
    status: "pending",
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    estimatedDuration: 180,
    tags: ["devops", "automation"],
    energyLevel: "high",
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "t6",
    title: "Write Blog Post on React Patterns",
    description: "Draft a technical blog post about advanced React patterns and hooks.",
    category: "personal",
    priority: "medium",
    status: "in_progress",
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    estimatedDuration: 90,
    tags: ["writing", "react"],
    energyLevel: "medium",
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "t7",
    title: "Organize Desktop & Downloads",
    description: "Clean up files, archive old projects, and organize folder structure.",
    category: "personal",
    priority: "low",
    status: "pending",
    estimatedDuration: 45,
    tags: ["cleanup"],
    energyLevel: "low",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

interface TaskStore {
  tasks: Task[];
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleComplete: (id: string) => void;
  getTasksByPriority: () => Task[];
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: mockTasks,

  addTask: (task) =>
    set((state) => ({ tasks: [task, ...state.tasks] })),

  updateTask: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, ...updates } : t
      ),
    })),

  deleteTask: (id) =>
    set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),

  toggleComplete: (id) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id
          ? { ...t, status: t.status === "completed" ? "pending" : "completed" }
          : t
      ),
    })),

  getTasksByPriority: () => {
    const order = { high: 0, medium: 1, low: 2 };
    return [...get().tasks].sort((a, b) => order[a.priority] - order[b.priority]);
  },
}));
