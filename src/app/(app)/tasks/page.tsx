"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { useTaskStore, type Task } from "@/stores/taskStore";
import TaskCreateModal from "@/components/tasks/TaskCreateModal";
import TaskDetailDrawer from "@/components/tasks/TaskDetailDrawer";
import KanbanBoard from "@/components/tasks/KanbanBoard";

type FilterTab = "all" | "high" | "medium" | "low" | "completed";
type ViewMode = "list" | "kanban";

const priorityBadge: Record<string, string> = {
  high: "bg-google-red-50 text-google-red-600",
  medium: "bg-google-yellow-50 text-google-yellow-700",
  low: "bg-google-green-50 text-google-green-600",
};

const priorityDot: Record<string, string> = {
  high: "bg-google-red-500",
  medium: "bg-google-yellow-500",
  low: "bg-google-green-500",
};

const categoryKeys: Record<string, string> = {
  work: "categoryWork",
  development: "categoryDevelopment",
  design: "categoryDesign",
  personal: "categoryPersonal",
  meeting: "categoryMeeting",
  other: "categoryOther",
};

export default function TasksPage() {
  const t = useTranslations("Tasks");
  const tTask = useTranslations("Task");
  const tasks = useTaskStore((s) => s.tasks);

  const [filter, setFilter] = useState<FilterTab>("all");
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  const filteredTasks = useMemo(() => {
    let result = tasks;
    if (filter === "completed") {
      result = result.filter((t) => t.status === "completed");
    } else if (filter !== "all") {
      result = result.filter((t) => t.priority === filter && t.status !== "completed");
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }
    return result;
  }, [tasks, filter, search]);

  const openDetail = (task: Task) => {
    setSelectedTask(task);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setTimeout(() => setSelectedTask(null), 300);
  };

  // Keep selectedTask in sync with store
  const currentTask = selectedTask
    ? tasks.find((t) => t.id === selectedTask.id) || null
    : null;

  const filters: { key: FilterTab; label: string }[] = [
    { key: "all", label: t("filterAll") },
    { key: "high", label: t("filterHigh") },
    { key: "medium", label: t("filterMedium") },
    { key: "low", label: t("filterLow") },
    { key: "completed", label: t("filterCompleted") },
  ];

  const formatDeadline = (deadline?: string) => {
    if (!deadline) return null;
    const d = new Date(deadline);
    const now = new Date();
    const diff = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const formatted = `${d.getDate()}/${d.getMonth() + 1}`;
    if (diff < 0) return { text: formatted, urgent: true, label: t("overdue") };
    if (diff === 0) return { text: formatted, urgent: true, label: t("dueToday") };
    return { text: formatted, urgent: diff <= 2, label: t("dueIn", { days: diff }) };
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-lumina-900 dark:text-lumina-100">{t("pageTitle")}</h1>
          <p className="text-sm text-lumina-500 dark:text-lumina-400 mt-1">{t("pageSubtitle")}</p>
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center bg-lumina-100 dark:bg-lumina-800 rounded-xl p-0.5">
            <button onClick={() => setViewMode("list")}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${viewMode === "list" ? "bg-white dark:bg-lumina-700 text-lumina-900 dark:text-lumina-100 shadow-sm" : "text-lumina-500"}`}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="inline mr-1">
                <path d="M2 3H12M2 7H12M2 11H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              List
            </button>
            <button onClick={() => setViewMode("kanban")}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${viewMode === "kanban" ? "bg-white dark:bg-lumina-700 text-lumina-900 dark:text-lumina-100 shadow-sm" : "text-lumina-500"}`}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="inline mr-1">
                <rect x="1" y="1" width="3.5" height="12" rx="1" stroke="currentColor" strokeWidth="1.2" />
                <rect x="5.25" y="1" width="3.5" height="8" rx="1" stroke="currentColor" strokeWidth="1.2" />
                <rect x="9.5" y="1" width="3.5" height="10" rx="1" stroke="currentColor" strokeWidth="1.2" />
              </svg>
              Kanban
            </button>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setCreateOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-google-blue-500 text-white text-sm font-medium rounded-xl hover:bg-google-blue-600 transition-colors shadow-sm"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 2V14M2 8H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            {t("addTask")}
          </motion.button>
        </div>
      </div>

      {/* Kanban or List view */}
      {viewMode === "kanban" ? (
        <KanbanBoard onTaskClick={openDetail} />
      ) : (
      <>
      {/* Search */}
      <div className="relative mb-4">
        <svg
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lumina-400"
          width="16" height="16" viewBox="0 0 16 16" fill="none"
        >
          <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M11 11L14.5 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("searchPlaceholder")}
          className="w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-lumina-900 rounded-xl border border-lumina-200 dark:border-lumina-700 outline-none focus:ring-2 focus:ring-google-blue-200 focus:border-google-blue-300 transition-all placeholder:text-lumina-400 shadow-soft dark:text-lumina-100"
        />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1.5 mb-6 overflow-x-auto pb-1">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`relative px-4 py-2 text-sm font-medium rounded-xl whitespace-nowrap transition-all ${
              filter === f.key
                ? "bg-google-blue-500 text-white shadow-sm"
                : "text-lumina-500 hover:bg-lumina-100 dark:hover:bg-lumina-800 hover:text-lumina-700 dark:hover:text-lumina-200"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Task count */}
      <p className="text-xs text-lumina-400 mb-3">{t("taskCount", { count: filteredTasks.length })}</p>

      {/* Task list */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredTasks.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-lumina-100 flex items-center justify-center mb-4">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <path d="M4 8L8 12L14 4" stroke="#9AA0A9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M18 8H24" stroke="#9AA0A9" strokeWidth="2" strokeLinecap="round" />
                  <path d="M4 16L8 20L14 12" stroke="#9AA0A9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M18 16H24" stroke="#9AA0A9" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-lumina-700 mb-1">{t("emptyTitle")}</h3>
              <p className="text-sm text-lumina-400 max-w-xs">{t("emptyDescription")}</p>
            </motion.div>
          ) : (
            filteredTasks.map((task, i) => {
              const dl = formatDeadline(task.deadline);
              return (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.04, type: "spring", stiffness: 400, damping: 30 }}
                  onClick={() => openDetail(task)}
                  className="group bg-white dark:bg-lumina-900 rounded-2xl border border-lumina-200/60 dark:border-lumina-800 p-4 cursor-pointer hover:shadow-card hover:border-lumina-300/60 dark:hover:border-lumina-700 transition-all"
                  style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
                >
                  <div className="flex items-start gap-3">
                    {/* Priority dot */}
                    <div className="mt-1.5 flex-shrink-0">
                      <div className={`w-2.5 h-2.5 rounded-full ${priorityDot[task.priority]}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3
                          className={`text-sm font-semibold truncate ${
                            task.status === "completed"
                              ? "line-through text-lumina-400"
                              : "text-lumina-900 dark:text-lumina-100 group-hover:text-google-blue-600"
                          } transition-colors`}
                        >
                          {task.title}
                        </h3>
                        {task.status === "completed" && (
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="flex-shrink-0">
                            <circle cx="7" cy="7" r="6" fill="#34A853" fillOpacity="0.15" />
                            <path d="M4 7L6 9L10 5" stroke="#34A853" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>

                      {task.description && (
                        <p className="text-xs text-lumina-500 truncate mb-2">{task.description}</p>
                      )}

                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2 py-0.5 text-[10px] font-medium rounded-md ${priorityBadge[task.priority]}`}>
                          {tTask(`priority${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}`)}
                        </span>
                        <span className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-lumina-100 text-lumina-600">
                          {t(categoryKeys[task.category] || "categoryOther")}
                        </span>
                        <span className="text-[10px] text-lumina-400">
                          {task.estimatedDuration} {tTask("minutes")}
                        </span>
                        {dl && (
                          <span className={`text-[10px] font-medium ${dl.urgent ? "text-google-red-500" : "text-lumina-400"}`}>
                            {dl.text}
                          </span>
                        )}
                        {task.subtasks && task.subtasks.length > 0 && (
                          <span className="text-[10px] text-lumina-400 flex items-center gap-0.5">
                            ☑ {task.subtasks.filter((st) => st.completed).length}/{task.subtasks.length}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Arrow */}
                    <svg
                      width="16" height="16" viewBox="0 0 16 16" fill="none"
                      className="flex-shrink-0 mt-1 text-lumina-300 group-hover:text-lumina-500 transition-colors"
                    >
                      <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
      </>
      )}

      {/* Modals */}
      <TaskCreateModal open={createOpen} onClose={() => setCreateOpen(false)} />
      <TaskDetailDrawer task={currentTask} open={drawerOpen} onClose={closeDrawer} />
    </div>
  );
}
