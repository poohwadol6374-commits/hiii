"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { useTaskStore, type Task } from "@/stores/taskStore";

interface TaskCreateModalProps {
  open: boolean;
  onClose: () => void;
}

const categories = [
  "work",
  "development",
  "design",
  "personal",
  "meeting",
  "other",
] as const;

const categoryKeys: Record<string, string> = {
  work: "categoryWork",
  development: "categoryDevelopment",
  design: "categoryDesign",
  personal: "categoryPersonal",
  meeting: "categoryMeeting",
  other: "categoryOther",
};

const priorities = ["high", "medium", "low"] as const;
const energyLevels = ["high", "medium", "low"] as const;

const priorityColors: Record<string, string> = {
  high: "bg-google-red-500 text-white",
  medium: "bg-google-yellow-500 text-white",
  low: "bg-google-green-500 text-white",
};

const priorityOutline: Record<string, string> = {
  high: "border-google-red-200 text-google-red-600 hover:bg-google-red-50",
  medium: "border-google-yellow-200 text-google-yellow-700 hover:bg-google-yellow-50",
  low: "border-google-green-200 text-google-green-600 hover:bg-google-green-50",
};

export default function TaskCreateModal({ open, onClose }: TaskCreateModalProps) {
  const t = useTranslations("Tasks");
  const tTask = useTranslations("Task");
  const tActions = useTranslations("Actions");
  const addTask = useTaskStore((s) => s.addTask);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>("work");
  const [priority, setPriority] = useState<Task["priority"]>("medium");
  const [estimatedDuration, setEstimatedDuration] = useState(30);
  const [deadline, setDeadline] = useState("");
  const [energyLevel, setEnergyLevel] = useState<Task["energyLevel"]>("medium");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [recurrence, setRecurrence] = useState<Task["recurrence"]>("none");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const resetForm = useCallback(() => {
    setTitle("");
    setDescription("");
    setCategory("work");
    setPriority("medium");
    setEstimatedDuration(30);
    setDeadline("");
    setEnergyLevel("medium");
    setTags([]);
    setTagInput("");
    setRecurrence("none");
    setErrors({});
  }, []);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (estimatedDuration <= 0) newErrors.duration = "Duration must be > 0";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const newTask: Task = {
      id: `t-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      title: title.trim(),
      description: description.trim() || undefined,
      category,
      priority,
      status: "pending",
      deadline: deadline ? new Date(deadline).toISOString() : undefined,
      estimatedDuration,
      tags,
      energyLevel,
      createdAt: new Date().toISOString(),
      recurrence: recurrence !== "none" ? recurrence : undefined,
    };
    addTask(newTask);
    resetForm();
    onClose();
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => setTags(tags.filter((t) => t !== tag));

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
          >
            <div className="bg-white dark:bg-lumina-900 rounded-2xl shadow-modal w-full max-w-lg max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-lumina-200/60 dark:border-lumina-800">
                <h2 className="text-lg font-semibold text-lumina-900 dark:text-lumina-100">{t("createTitle")}</h2>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-lumina-400 hover:text-lumina-700 dark:hover:text-lumina-200 hover:bg-lumina-100 dark:hover:bg-lumina-800 transition-colors"
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M4.5 4.5L13.5 13.5M4.5 13.5L13.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              {/* Body */}
              <div className="px-6 py-5 space-y-5">
                {/* Title */}
                <div>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={t("titlePlaceholder")}
                    className={`w-full px-4 py-3 text-base bg-lumina-50 rounded-xl border outline-none transition-all placeholder:text-lumina-400 ${
                      errors.title
                        ? "border-google-red-300 focus:ring-2 focus:ring-google-red-200"
                        : "border-lumina-200 focus:ring-2 focus:ring-google-blue-200 focus:border-google-blue-300"
                    }`}
                    autoFocus
                  />
                  {errors.title && (
                    <p className="mt-1 text-xs text-google-red-500">{errors.title}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={t("descriptionPlaceholder")}
                    rows={3}
                    className="w-full px-4 py-3 text-sm bg-lumina-50 rounded-xl border border-lumina-200 outline-none focus:ring-2 focus:ring-google-blue-200 focus:border-google-blue-300 transition-all placeholder:text-lumina-400 resize-none"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-medium text-lumina-500 mb-2">{tTask("category")}</label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                          category === cat
                            ? "bg-pink-600 text-white border-pink-600"
                            : "border-lumina-200 text-lumina-600 hover:bg-lumina-100"
                        }`}
                      >
                        {t(categoryKeys[cat])}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-xs font-medium text-lumina-500 mb-2">{tTask("priority")}</label>
                  <div className="flex gap-2">
                    {priorities.map((p) => (
                      <button
                        key={p}
                        onClick={() => setPriority(p)}
                        className={`flex-1 px-3 py-2 text-xs font-medium rounded-xl border transition-all ${
                          priority === p ? priorityColors[p] : priorityOutline[p]
                        }`}
                      >
                        {tTask(`priority${p.charAt(0).toUpperCase() + p.slice(1)}`)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Duration + Deadline row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-lumina-500 mb-2">
                      {tTask("estimatedDuration")} ({tTask("minutes")})
                    </label>
                    <input
                      type="number"
                      value={estimatedDuration}
                      onChange={(e) => setEstimatedDuration(Number(e.target.value))}
                      min={1}
                      className={`w-full px-3 py-2.5 text-sm bg-lumina-50 rounded-xl border outline-none transition-all ${
                        errors.duration
                          ? "border-google-red-300 focus:ring-2 focus:ring-google-red-200"
                          : "border-lumina-200 focus:ring-2 focus:ring-google-blue-200"
                      }`}
                    />
                    {errors.duration && (
                      <p className="mt-1 text-xs text-google-red-500">{errors.duration}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-lumina-500 mb-2">{tTask("deadline")}</label>
                    <input
                      type="date"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      className="w-full px-3 py-2.5 text-sm bg-lumina-50 rounded-xl border border-lumina-200 outline-none focus:ring-2 focus:ring-google-blue-200 transition-all"
                    />
                  </div>
                </div>

                {/* Energy Level */}
                <div>
                  <label className="block text-xs font-medium text-lumina-500 mb-2">{tTask("energyLevel")}</label>
                  <div className="flex gap-2">
                    {energyLevels.map((e) => (
                      <button
                        key={e}
                        onClick={() => setEnergyLevel(e)}
                        className={`flex-1 px-3 py-2 text-xs font-medium rounded-xl border transition-all ${
                          energyLevel === e
                            ? "bg-pink-50 border-pink-300 text-pink-700"
                            : "border-lumina-200 text-lumina-500 hover:bg-lumina-50"
                        }`}
                      >
                        {t(`energy${e.charAt(0).toUpperCase() + e.slice(1)}`)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recurrence */}
                <div>
                  <label className="block text-xs font-medium text-lumina-500 mb-2">ทำซ้ำ</label>
                  <div className="flex flex-wrap gap-1.5">
                    {([["none", "ไม่ทำซ้ำ"], ["daily", "ทุกวัน"], ["weekdays", "วันทำงาน"], ["weekly", "ทุกสัปดาห์"], ["biweekly", "ทุก 2 สัปดาห์"], ["monthly", "ทุกเดือน"]] as const).map(([val, label]) => (
                      <button key={val} onClick={() => setRecurrence(val)}
                        className={`px-2.5 py-1.5 text-[11px] font-medium rounded-lg border transition-all ${
                          recurrence === val
                            ? "bg-pink-600 text-white border-pink-600"
                            : "border-lumina-200 text-lumina-500 hover:bg-lumina-50"
                        }`}>
                        {val !== "none" && "🔄 "}{label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-xs font-medium text-lumina-500 mb-2">{tTask("tags")}</label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-pink-50 text-pink-700 rounded-lg"
                      >
                        {tag}
                        <button onClick={() => removeTag(tag)} className="hover:text-google-red-500 transition-colors">
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    placeholder={t("tagsPlaceholder")}
                    className="w-full px-3 py-2.5 text-sm bg-lumina-50 rounded-xl border border-lumina-200 outline-none focus:ring-2 focus:ring-google-blue-200 transition-all placeholder:text-lumina-400"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-lumina-200/60 dark:border-lumina-800">
                <button
                  onClick={() => { resetForm(); onClose(); }}
                  className="px-4 py-2 text-sm font-medium text-lumina-600 dark:text-lumina-300 hover:bg-lumina-100 dark:hover:bg-lumina-800 rounded-xl transition-colors"
                >
                  {tActions("cancel")}
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSubmit}
                  className="px-5 py-2 text-sm font-medium bg-pink-600 text-white rounded-xl hover:bg-pink-700 transition-colors shadow-sm"
                >
                  {t("addTask")}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
