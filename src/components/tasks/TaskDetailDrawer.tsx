"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { useTaskStore, type Task } from "@/stores/taskStore";
import { useFocusStore } from "@/stores/focusStore";
import { useUndoStore } from "@/stores/undoStore";

interface TaskDetailDrawerProps {
  task: Task | null;
  open: boolean;
  onClose: () => void;
}

const priorityBadge: Record<string, string> = {
  high: "bg-google-red-50 text-google-red-600 border-google-red-200",
  medium: "bg-google-yellow-50 text-google-yellow-700 border-google-yellow-200",
  low: "bg-google-green-50 text-google-green-600 border-google-green-200",
};

const statusBadge: Record<string, string> = {
  pending: "bg-lumina-100 text-lumina-600",
  in_progress: "bg-google-blue-50 text-google-blue-600",
  completed: "bg-google-green-50 text-google-green-600",
};

const categoryKeys: Record<string, string> = {
  work: "categoryWork",
  development: "categoryDevelopment",
  design: "categoryDesign",
  personal: "categoryPersonal",
  meeting: "categoryMeeting",
  other: "categoryOther",
};

export default function TaskDetailDrawer({ task, open, onClose }: TaskDetailDrawerProps) {
  const t = useTranslations("Tasks");
  const tTask = useTranslations("Task");
  const tActions = useTranslations("Actions");
  const { updateTask, deleteTask, toggleComplete, addSubtask, toggleSubtask, deleteSubtask, updateNotes, addTask } = useTaskStore();
  const startFocus = useFocusStore((s) => s.startFocus);
  const pushUndo = useUndoStore((s) => s.push);

  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);
  const [newSubtask, setNewSubtask] = useState("");
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesText, setNotesText] = useState("");

  const startEdit = () => {
    if (!task) return;
    setEditTitle(task.title);
    setEditDescription(task.description || "");
    setEditing(true);
  };

  const saveEdit = () => {
    if (!task || !editTitle.trim()) return;
    updateTask(task.id, {
      title: editTitle.trim(),
      description: editDescription.trim() || undefined,
    });
    setEditing(false);
  };

  const handleDelete = () => {
    if (!task) return;
    const deletedTask = { ...task };
    deleteTask(task.id);
    pushUndo({
      label: `Delete "${task.title}"`,
      undo: () => addTask(deletedTask),
      redo: () => deleteTask(deletedTask.id),
    });
    setShowDeleteConfirm(false);
    onClose();
  };

  const handleToggleComplete = () => {
    if (!task) return;
    const wasCompleted = task.status === "completed";
    if (!wasCompleted) {
      setJustCompleted(true);
      setTimeout(() => setJustCompleted(false), 1200);
    }
    toggleComplete(task.id);
    pushUndo({
      label: wasCompleted ? `Mark "${task.title}" incomplete` : `Complete "${task.title}"`,
      undo: () => toggleComplete(task.id),
      redo: () => toggleComplete(task.id),
    });
  };

  const formatDeadline = (deadline?: string) => {
    if (!deadline) return tTask("noDeadline");
    const d = new Date(deadline);
    const now = new Date();
    const diff = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const formatted = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    if (diff < 0) return `${formatted} · ${t("overdue")}`;
    if (diff === 0) return `${formatted} · ${t("dueToday")}`;
    return `${formatted} · ${t("dueIn", { days: diff })}`;
  };

  const statusKey = (s: string) => {
    if (s === "in_progress") return "inProgress";
    return s;
  };

  return (
    <AnimatePresence>
      {open && task && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 350, damping: 35 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-lumina-900 shadow-modal z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-lumina-200/60 dark:border-lumina-800">
              <h2 className="text-base font-semibold text-lumina-900 dark:text-lumina-100">{t("taskDetails")}</h2>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-lumina-400 hover:text-lumina-700 dark:hover:text-lumina-200 hover:bg-lumina-100 dark:hover:bg-lumina-800 transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M4.5 4.5L13.5 13.5M4.5 13.5L13.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              {/* Completion animation */}
              <AnimatePresence>
                {justCompleted && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center justify-center py-4"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.3, 1] }}
                      transition={{ duration: 0.5 }}
                      className="w-16 h-16 rounded-full bg-google-green-50 flex items-center justify-center"
                    >
                      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <motion.path
                          d="M8 16L14 22L24 10"
                          stroke="#34A853"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.4, delay: 0.2 }}
                        />
                      </svg>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Title */}
              {editing ? (
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 text-lg font-semibold bg-lumina-50 rounded-xl border border-lumina-200 outline-none focus:ring-2 focus:ring-google-blue-200"
                  autoFocus
                />
              ) : (
                <h3 className={`text-lg font-semibold ${task.status === "completed" ? "line-through text-lumina-400" : "text-lumina-900 dark:text-lumina-100"}`}>
                  {task.title}
                </h3>
              )}

              {/* Badges row */}
              <div className="flex flex-wrap gap-2">
                <span className={`px-2.5 py-1 text-xs font-medium rounded-lg border ${priorityBadge[task.priority]}`}>
                  {tTask(`priority${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}`)}
                </span>
                <span className={`px-2.5 py-1 text-xs font-medium rounded-lg ${statusBadge[task.status]}`}>
                  {t(statusKey(task.status))}
                </span>
                <span className="px-2.5 py-1 text-xs font-medium rounded-lg bg-lumina-100 text-lumina-600">
                  {t(categoryKeys[task.category] || "categoryOther")}
                </span>
              </div>

              {/* Description */}
              {editing ? (
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 text-sm bg-lumina-50 rounded-xl border border-lumina-200 outline-none focus:ring-2 focus:ring-google-blue-200 resize-none"
                />
              ) : task.description ? (
                <p className="text-sm text-lumina-600 dark:text-lumina-400 leading-relaxed">{task.description}</p>
              ) : null}

              {/* Details grid */}
              <div className="space-y-3">
                <DetailRow label={tTask("deadline")} value={formatDeadline(task.deadline)} />
                <DetailRow label={tTask("estimatedDuration")} value={`${task.estimatedDuration} ${tTask("minutes")}`} />
                <DetailRow
                  label={tTask("energyLevel")}
                  value={t(`energy${task.energyLevel.charAt(0).toUpperCase() + task.energyLevel.slice(1)}`)}
                />
                <DetailRow
                  label={tTask("createdAt")}
                  value={(() => { const d = new Date(task.createdAt); return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`; })()}
                />
              </div>

              {/* Tags */}
              {task.tags.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-lumina-500 mb-2">{tTask("tags")}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {task.tags.map((tag) => (
                      <span key={tag} className="px-2.5 py-1 text-xs font-medium bg-google-blue-50 text-google-blue-700 rounded-lg">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Subtasks */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-lumina-500">Subtasks</p>
                  {task.subtasks && task.subtasks.length > 0 && (
                    <span className="text-[10px] text-lumina-400">
                      {task.subtasks.filter((st) => st.completed).length}/{task.subtasks.length}
                    </span>
                  )}
                </div>
                {task.subtasks && task.subtasks.length > 0 && (
                  <div className="space-y-1.5 mb-2">
                    {task.subtasks.map((st) => (
                      <div key={st.id} className="flex items-center gap-2 group">
                        <button onClick={() => toggleSubtask(task.id, st.id)}
                          className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${
                            st.completed ? "bg-google-green-500 border-google-green-500" : "border-lumina-300 dark:border-lumina-600 hover:border-google-blue-400"
                          }`}>
                          {st.completed && (
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                              <path d="M2 5L4 7L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </button>
                        <span className={`text-sm flex-1 ${st.completed ? "line-through text-lumina-400" : "text-lumina-700 dark:text-lumina-300"}`}>
                          {st.title}
                        </span>
                        <button onClick={() => deleteSubtask(task.id, st.id)}
                          className="opacity-0 group-hover:opacity-100 p-0.5 text-lumina-400 hover:text-google-red-500 transition-all">
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M3 3L9 9M9 3L3 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newSubtask}
                    onChange={(e) => setNewSubtask(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newSubtask.trim()) {
                        addSubtask(task.id, newSubtask.trim());
                        setNewSubtask("");
                      }
                    }}
                    placeholder="เพิ่ม subtask..."
                    className="flex-1 px-3 py-1.5 text-xs bg-lumina-50 dark:bg-lumina-800 rounded-lg border border-lumina-200 dark:border-lumina-700 outline-none focus:ring-1 focus:ring-google-blue-200 placeholder:text-lumina-400 dark:text-lumina-100"
                  />
                  {newSubtask.trim() && (
                    <button onClick={() => { addSubtask(task.id, newSubtask.trim()); setNewSubtask(""); }}
                      className="p-1.5 text-google-blue-500 hover:text-google-blue-600">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M7 2V12M2 7H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-lumina-500">Notes</p>
                  {!editingNotes && (
                    <button onClick={() => { setNotesText(task.notes || ""); setEditingNotes(true); }}
                      className="text-[10px] text-google-blue-500 hover:text-google-blue-600 font-medium">
                      {task.notes ? "แก้ไข" : "เพิ่ม"}
                    </button>
                  )}
                </div>
                {editingNotes ? (
                  <div>
                    <textarea
                      value={notesText}
                      onChange={(e) => setNotesText(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 text-sm bg-lumina-50 dark:bg-lumina-800 rounded-xl border border-lumina-200 dark:border-lumina-700 outline-none focus:ring-1 focus:ring-google-blue-200 resize-none dark:text-lumina-100"
                      autoFocus
                    />
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => { updateNotes(task.id, notesText); setEditingNotes(false); }}
                        className="px-3 py-1 text-xs font-medium bg-google-blue-500 text-white rounded-lg hover:bg-google-blue-600 transition-colors">
                        บันทึก
                      </button>
                      <button onClick={() => setEditingNotes(false)}
                        className="px-3 py-1 text-xs font-medium text-lumina-500 hover:bg-lumina-100 dark:hover:bg-lumina-800 rounded-lg transition-colors">
                        ยกเลิก
                      </button>
                    </div>
                  </div>
                ) : task.notes ? (
                  <p className="text-sm text-lumina-600 dark:text-lumina-400 leading-relaxed whitespace-pre-line bg-lumina-50 dark:bg-lumina-800/50 rounded-xl p-3">
                    {task.notes}
                  </p>
                ) : (
                  <p className="text-xs text-lumina-400 italic">ยังไม่มี notes</p>
                )}
              </div>

              {/* Delete confirmation */}
              <AnimatePresence>
                {showDeleteConfirm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-google-red-50 rounded-xl p-4 border border-google-red-200"
                  >
                    <p className="text-sm font-medium text-google-red-700">{t("deleteConfirm")}</p>
                    <p className="text-xs text-google-red-500 mt-1">{t("deleteConfirmDesc")}</p>
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="px-3 py-1.5 text-xs font-medium text-lumina-600 bg-white rounded-lg border border-lumina-200 hover:bg-lumina-50 transition-colors"
                      >
                        {tActions("cancel")}
                      </button>
                      <button
                        onClick={handleDelete}
                        className="px-3 py-1.5 text-xs font-medium text-white bg-google-red-500 rounded-lg hover:bg-google-red-600 transition-colors"
                      >
                        {tActions("delete")}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer actions */}
            <div className="px-6 py-4 border-t border-lumina-200/60 dark:border-lumina-800 flex items-center gap-2">
              {editing ? (
                <>
                  <button
                    onClick={() => setEditing(false)}
                    className="px-4 py-2 text-sm font-medium text-lumina-600 hover:bg-lumina-100 rounded-xl transition-colors"
                  >
                    {tActions("cancel")}
                  </button>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={saveEdit}
                    className="px-4 py-2 text-sm font-medium bg-google-blue-500 text-white rounded-xl hover:bg-google-blue-600 transition-colors"
                  >
                    {tActions("save")}
                  </motion.button>
                </>
              ) : (
                <>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleToggleComplete}
                    className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-xl transition-colors ${
                      task.status === "completed"
                        ? "bg-lumina-100 text-lumina-600 hover:bg-lumina-200"
                        : "bg-google-green-500 text-white hover:bg-google-green-600"
                    }`}
                  >
                    {task.status === "completed" ? t("markIncomplete") : t("markComplete")}
                  </motion.button>
                  <button
                    onClick={() => { if (task) { startFocus(task.id, task.title); onClose(); } }}
                    className="p-2.5 rounded-xl text-google-blue-500 hover:bg-google-blue-50 hover:text-google-blue-600 dark:hover:bg-google-blue-900/20 transition-colors"
                    aria-label="Focus Mode"
                    title="Focus Mode"
                  >
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.5" />
                      <circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.5" />
                      <circle cx="9" cy="9" r="1" fill="currentColor" />
                    </svg>
                  </button>
                  <button
                    onClick={startEdit}
                    className="p-2.5 rounded-xl text-lumina-500 hover:bg-lumina-100 hover:text-lumina-700 transition-colors"
                    aria-label={tActions("edit")}
                  >
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M11.5 3.5L14.5 6.5M2.5 15.5L3.5 11.5L13 2C13.5523 1.44772 14.4477 1.44772 15 2L16 3C16.5523 3.55228 16.5523 4.44772 16 5L6.5 14.5L2.5 15.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="p-2.5 rounded-xl text-google-red-400 hover:bg-google-red-50 hover:text-google-red-600 transition-colors"
                    aria-label={tActions("delete")}
                  >
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M3 5H15M6 5V3C6 2.44772 6.44772 2 7 2H11C11.5523 2 12 2.44772 12 3V5M7.5 8V13M10.5 8V13M4.5 5L5.5 15C5.5 15.5523 5.94772 16 6.5 16H11.5C12.0523 16 12.5 15.5523 12.5 15L13.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-lumina-100">
      <span className="text-xs font-medium text-lumina-500">{label}</span>
      <span className="text-sm text-lumina-800">{value}</span>
    </div>
  );
}
