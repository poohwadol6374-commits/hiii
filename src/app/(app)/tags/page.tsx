"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTagStore, tagColorMap, type Tag } from "@/stores/tagStore";
import { useTaskStore } from "@/stores/taskStore";

const colorOptions = ["blue", "green", "yellow", "red", "purple", "pink", "orange", "teal", "indigo", "cyan", "gray"];

export default function TagsPage() {
  const tags = useTagStore((s) => s.tags);
  const addTag = useTagStore((s) => s.addTag);
  const deleteTag = useTagStore((s) => s.deleteTag);
  const updateTag = useTagStore((s) => s.updateTag);
  const tasks = useTaskStore((s) => s.tasks);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const getTaskCount = (tagName: string) => tasks.filter((t) => t.tags.includes(tagName)).length;

  const handleAdd = () => {
    if (!newName.trim()) return;
    addTag(newName.trim());
    setNewName("");
  };

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-lumina-900 dark:text-lumina-100">แท็ก</h1>
        <p className="text-sm text-lumina-500 dark:text-lumina-400 mt-1">จัดการแท็กสำหรับจัดหมวดหมู่งาน</p>
      </div>

      {/* Add new tag */}
      <div className="flex items-center gap-2 mb-6">
        <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); }}
          placeholder="ชื่อแท็กใหม่..."
          className="flex-1 px-4 py-2.5 text-sm bg-white dark:bg-lumina-900 rounded-xl border border-lumina-200 dark:border-lumina-700 outline-none focus:ring-2 focus:ring-google-blue-200 placeholder:text-lumina-400 dark:text-lumina-100" />
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleAdd}
          className="px-4 py-2.5 bg-google-blue-500 text-white text-sm font-medium rounded-xl hover:bg-google-blue-600 transition-colors shadow-sm">
          เพิ่ม
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white dark:bg-lumina-900 rounded-2xl p-4 border border-lumina-100 dark:border-lumina-800 text-center" style={{ boxShadow: "var(--shadow-card)" }}>
          <p className="text-2xl font-bold text-lumina-900 dark:text-lumina-100">{tags.length}</p>
          <p className="text-[11px] text-lumina-500">แท็กทั้งหมด</p>
        </div>
        <div className="bg-white dark:bg-lumina-900 rounded-2xl p-4 border border-lumina-100 dark:border-lumina-800 text-center" style={{ boxShadow: "var(--shadow-card)" }}>
          <p className="text-2xl font-bold text-lumina-900 dark:text-lumina-100">{tags.filter((t) => getTaskCount(t.name) > 0).length}</p>
          <p className="text-[11px] text-lumina-500">ใช้งานอยู่</p>
        </div>
        <div className="bg-white dark:bg-lumina-900 rounded-2xl p-4 border border-lumina-100 dark:border-lumina-800 text-center" style={{ boxShadow: "var(--shadow-card)" }}>
          <p className="text-2xl font-bold text-lumina-900 dark:text-lumina-100">{tags.filter((t) => getTaskCount(t.name) === 0).length}</p>
          <p className="text-[11px] text-lumina-500">ไม่ได้ใช้</p>
        </div>
      </div>

      {/* Tag list */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {tags.map((tag, i) => {
            const colors = tagColorMap[tag.color] || tagColorMap.gray;
            const count = getTaskCount(tag.name);
            const isEditing = editingId === tag.id;

            return (
              <motion.div key={tag.id} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.02 }}
                className="flex items-center gap-3 bg-white dark:bg-lumina-900 rounded-xl p-3 border border-lumina-200/60 dark:border-lumina-800 hover:shadow-card transition-all"
                style={{ boxShadow: "var(--shadow-soft)" }}>
                {/* Color dot */}
                <div className={`w-3 h-3 rounded-full ${colors.bg} border ${colors.border}`} />

                {/* Name */}
                {isEditing ? (
                  <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { updateTag(tag.id, { name: editName.trim() }); setEditingId(null); } if (e.key === "Escape") setEditingId(null); }}
                    onBlur={() => { updateTag(tag.id, { name: editName.trim() }); setEditingId(null); }}
                    className="flex-1 px-2 py-1 text-sm bg-lumina-50 dark:bg-lumina-800 rounded-lg border border-lumina-200 dark:border-lumina-700 outline-none focus:ring-1 focus:ring-google-blue-200 dark:text-lumina-100"
                    autoFocus />
                ) : (
                  <span className={`flex-1 text-sm font-medium px-2 py-0.5 rounded-lg ${colors.bg} ${colors.text} cursor-pointer`}
                    onClick={() => { setEditingId(tag.id); setEditName(tag.name); }}>
                    #{tag.name}
                  </span>
                )}

                {/* Task count */}
                <span className="text-[11px] text-lumina-400">{count} งาน</span>

                {/* Color picker */}
                <div className="flex items-center gap-0.5">
                  {colorOptions.slice(0, 6).map((c) => (
                    <button key={c} onClick={() => updateTag(tag.id, { color: c })}
                      className={`w-4 h-4 rounded-full transition-all ${
                        tagColorMap[c]?.bg || "bg-lumina-200"
                      } ${tag.color === c ? "ring-2 ring-offset-1 ring-lumina-400 scale-110" : "opacity-50 hover:opacity-100"}`} />
                  ))}
                </div>

                {/* Delete */}
                <button onClick={() => deleteTag(tag.id)}
                  className="p-1.5 rounded-lg text-lumina-400 hover:text-google-red-500 hover:bg-google-red-50 dark:hover:bg-google-red-900/20 transition-colors">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3 3L11 11M11 3L3 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
