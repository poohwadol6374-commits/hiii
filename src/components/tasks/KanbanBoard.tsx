"use client";

import { useCallback } from "react";
import { motion } from "framer-motion";
import { useTaskStore, type Task } from "@/stores/taskStore";

const priorityDot: Record<string, string> = {
  high: "bg-google-red-500",
  medium: "bg-google-yellow-500",
  low: "bg-google-green-500",
};

const columns: { key: Task["status"]; label: string; color: string; bg: string }[] = [
  { key: "pending", label: "📋 รอดำเนินการ", color: "border-lumina-300 dark:border-lumina-700", bg: "bg-lumina-50/50 dark:bg-lumina-800/30" },
  { key: "in_progress", label: "🔄 กำลังทำ", color: "border-google-blue-300 dark:border-google-blue-800", bg: "bg-google-blue-50/30 dark:bg-google-blue-900/10" },
  { key: "completed", label: "✅ เสร็จแล้ว", color: "border-google-green-300 dark:border-google-green-800", bg: "bg-google-green-50/30 dark:bg-google-green-900/10" },
];

interface KanbanBoardProps {
  onTaskClick: (task: Task) => void;
}

export default function KanbanBoard({ onTaskClick }: KanbanBoardProps) {
  const tasks = useTaskStore((s) => s.tasks);
  const updateTask = useTaskStore((s) => s.updateTask);

  const handleDrop = useCallback((e: React.DragEvent, status: Task["status"]) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    if (taskId) updateTask(taskId, { status });
  }, [updateTask]);

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("taskId", taskId);
    e.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 min-h-[400px]">
      {columns.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.key);
        return (
          <div
            key={col.key}
            onDrop={(e) => handleDrop(e, col.key)}
            onDragOver={handleDragOver}
            className={`rounded-2xl border-2 border-dashed ${col.color} ${col.bg} p-3 transition-colors`}
          >
            {/* Column header */}
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="text-sm font-semibold text-lumina-700 dark:text-lumina-300">{col.label}</h3>
              <span className="text-[11px] font-medium text-lumina-400 bg-lumina-100 dark:bg-lumina-800 px-2 py-0.5 rounded-full">
                {colTasks.length}
              </span>
            </div>

            {/* Cards */}
            <div className="space-y-2">
              {colTasks.map((task, i) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  draggable
                  onDragStart={(e) => handleDragStart(e as unknown as React.DragEvent, task.id)}
                  onClick={() => onTaskClick(task)}
                  className="bg-white dark:bg-lumina-900 rounded-xl p-3 border border-lumina-200/60 dark:border-lumina-800 cursor-grab active:cursor-grabbing hover:shadow-card transition-all group"
                  style={{ boxShadow: "var(--shadow-soft)" }}
                >
                  <div className="flex items-start gap-2 mb-2">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${priorityDot[task.priority]}`} />
                    <p className={`text-sm font-medium flex-1 truncate ${
                      task.status === "completed" ? "line-through text-lumina-400" : "text-lumina-800 dark:text-lumina-200"
                    }`}>
                      {task.title}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] text-lumina-400">{task.estimatedDuration} min</span>
                    {task.subtasks && task.subtasks.length > 0 && (
                      <span className="text-[10px] text-lumina-400">
                        ☑ {task.subtasks.filter((st) => st.completed).length}/{task.subtasks.length}
                      </span>
                    )}
                    {task.deadline && (
                      <span className="text-[10px] text-lumina-400">
                        📅 {new Date(task.deadline).getDate()}/{new Date(task.deadline).getMonth() + 1}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
              {colTasks.length === 0 && (
                <div className="py-8 text-center">
                  <p className="text-xs text-lumina-400">ลากงานมาวางที่นี่</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
