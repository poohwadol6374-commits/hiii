"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { type CalendarEvent, type EventCategory, categoryStyles, categoryLabels } from "./mockData";
import { useCalendarStore } from "@/stores/calendarStore";

interface EventDetailModalProps {
  event: CalendarEvent | null;
  open: boolean;
  onClose: () => void;
}

function fmt(h: number, m: number) {
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

const recurrenceLabels: Record<string, string> = {
  daily: "ทุกวัน", weekdays: "จันทร์-ศุกร์", weekly: "ทุกสัปดาห์", biweekly: "ทุก 2 สัปดาห์", monthly: "ทุกเดือน",
};

const categories: EventCategory[] = ["meeting", "focus", "break", "personal"];

export default function EventDetailModal({ event, open, onClose }: EventDetailModalProps) {
  const updateEvent = useCalendarStore((s) => s.updateEvent);
  const deleteEvent = useCalendarStore((s) => s.deleteEvent);
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editCategory, setEditCategory] = useState<EventCategory>("meeting");
  const [editDay, setEditDay] = useState(0);
  const [editStartH, setEditStartH] = useState(9);
  const [editStartM, setEditStartM] = useState(0);
  const [editDuration, setEditDuration] = useState(60);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const dayLabels = ["จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส.", "อา."];

  if (!event) return null;
  const style = categoryStyles[event.category];
  const duration = (event.endHour * 60 + event.endMinute) - (event.startHour * 60 + event.startMinute);
  const hours = Math.floor(duration / 60);
  const mins = duration % 60;

  const startEdit = () => {
    setEditTitle(event.title);
    setEditDesc(event.description || "");
    setEditCategory(event.category);
    setEditDay(event.dayOfWeek);
    setEditStartH(event.startHour);
    setEditStartM(event.startMinute);
    setEditDuration((event.endHour * 60 + event.endMinute) - (event.startHour * 60 + event.startMinute));
    setEditing(true);
    setConfirmDelete(false);
  };

  const saveEdit = () => {
    if (!editTitle.trim()) return;
    const endMin = editStartH * 60 + editStartM + editDuration;
    updateEvent(event.id, {
      title: editTitle.trim(),
      description: editDesc.trim() || undefined,
      category: editCategory,
      dayOfWeek: editDay,
      startHour: editStartH,
      startMinute: editStartM,
      endHour: Math.floor(endMin / 60),
      endMinute: endMin % 60,
    });
    setEditing(false);
    onClose();
  };

  const handleDelete = () => {
    deleteEvent(event.id);
    setConfirmDelete(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50" onClick={onClose} />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="bg-white dark:bg-lumina-900 rounded-2xl shadow-modal w-full max-w-md overflow-hidden">
              {/* Header */}
              <div className={`${style.bg} border-b ${style.border} px-6 py-3`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${style.dot}`} />
                    <span className={`text-xs font-medium ${style.text}`}>{categoryLabels[event.category]}</span>
                    {event.recurrence && event.recurrence !== "none" && (
                      <span className="text-[10px] text-lumina-400">🔄 {recurrenceLabels[event.recurrence]}</span>
                    )}
                  </div>
                  <button onClick={onClose} className="p-1 rounded-lg text-lumina-400 hover:text-lumina-700 dark:hover:text-lumina-200 hover:bg-white/50 transition-colors">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 3L11 11M11 3L3 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 py-5 space-y-4">
                {editing ? (
                  <>
                    <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full px-3 py-2 text-lg font-semibold bg-lumina-50 dark:bg-lumina-800 rounded-xl border border-lumina-200 dark:border-lumina-700 outline-none focus:ring-2 focus:ring-pink-200 dark:text-lumina-100" autoFocus />
                    <textarea value={editDesc} onChange={(e) => setEditDesc(e.target.value)} rows={3}
                      className="w-full px-3 py-2 text-sm bg-lumina-50 dark:bg-lumina-800 rounded-xl border border-lumina-200 dark:border-lumina-700 outline-none focus:ring-2 focus:ring-pink-200 resize-none dark:text-lumina-100"
                      placeholder="รายละเอียด..." />
                    <div>
                      <p className="text-xs font-medium text-lumina-500 mb-2">หมวดหมู่</p>
                      <div className="flex gap-2">
                        {categories.map((cat) => {
                          const cs = categoryStyles[cat];
                          return (
                            <button key={cat} onClick={() => setEditCategory(cat)}
                              className={`flex-1 px-2 py-1.5 text-[11px] font-medium rounded-lg border transition-all ${
                                editCategory === cat ? `${cs.bg} ${cs.text} ${cs.border}` : "border-lumina-200 dark:border-lumina-700 text-lumina-500"
                              }`}>
                              {categoryLabels[cat]}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    {/* Date picker */}
                    <div>
                      <p className="text-xs font-medium text-lumina-500 mb-2">วันที่</p>
                      <input type="date"
                        defaultValue={new Date().toISOString().split("T")[0]}
                        onChange={(e) => {
                          const d = new Date(e.target.value);
                          const dow = d.getDay();
                          setEditDay(dow === 0 ? 6 : dow - 1);
                        }}
                        className="w-full px-3 py-2 text-sm bg-lumina-50 dark:bg-lumina-800 rounded-xl border border-lumina-200 dark:border-lumina-700 outline-none focus:ring-2 focus:ring-pink-200 dark:text-lumina-100"
                      />
                      <p className="text-[10px] text-lumina-400 mt-1">
                        {dayLabels[editDay]}
                      </p>
                    </div>
                    {/* Time selector */}
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <p className="text-xs font-medium text-lumina-500 mb-1.5">เริ่ม</p>
                        <select value={editStartH * 60 + editStartM} onChange={(e) => { const v = Number(e.target.value); setEditStartH(Math.floor(v / 60)); setEditStartM(v % 60); }}
                          className="w-full px-2 py-2 text-sm bg-lumina-50 dark:bg-lumina-800 rounded-xl border border-lumina-200 dark:border-lumina-700 outline-none dark:text-lumina-100">
                          {Array.from({ length: 48 }, (_, i) => { const h = Math.floor((i * 30) / 60) + 6; const m = (i * 30) % 60; if (h > 22) return null;
                            return <option key={i} value={h * 60 + m}>{fmt(h, m)}</option>; })}
                        </select>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-lumina-500 mb-1.5">ระยะเวลา</p>
                        <select value={editDuration} onChange={(e) => setEditDuration(Number(e.target.value))}
                          className="w-full px-2 py-2 text-sm bg-lumina-50 dark:bg-lumina-800 rounded-xl border border-lumina-200 dark:border-lumina-700 outline-none dark:text-lumina-100">
                          {[15, 30, 45, 60, 90, 120, 180, 240].map((d) => (
                            <option key={d} value={d}>{d < 60 ? `${d} นาที` : `${d / 60} ชม.`}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-lumina-500 mb-1.5">สิ้นสุด</p>
                        <div className="px-2 py-2 text-sm bg-lumina-100 dark:bg-lumina-800 rounded-xl text-lumina-500 text-center">
                          {fmt(Math.floor((editStartH * 60 + editStartM + editDuration) / 60), (editStartH * 60 + editStartM + editDuration) % 60)}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="text-lg font-semibold text-lumina-900 dark:text-lumina-100">{event.title}</h2>
                    {event.description && <p className="text-sm text-lumina-600 dark:text-lumina-400 leading-relaxed">{event.description}</p>}
                    <div className="flex items-center gap-3 py-2 border-t border-lumina-100 dark:border-lumina-800">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-lumina-400"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" /><path d="M8 5V8L10 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                      <div>
                        <p className="text-sm font-medium text-lumina-800 dark:text-lumina-200">{fmt(event.startHour, event.startMinute)} - {fmt(event.endHour, event.endMinute)}</p>
                        <p className="text-[11px] text-lumina-400">{hours > 0 ? `${hours} ชม. ` : ""}{mins > 0 ? `${mins} นาที` : ""}</p>
                      </div>
                    </div>
                  </>
                )}

                {/* Delete confirmation */}
                <AnimatePresence>
                  {confirmDelete && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                      className="bg-google-red-50 dark:bg-google-red-900/20 rounded-xl p-3 border border-google-red-200 dark:border-google-red-800">
                      <p className="text-xs font-medium text-google-red-700 dark:text-google-red-400 mb-2">ลบกิจกรรมนี้?</p>
                      <div className="flex gap-2">
                        <button onClick={() => setConfirmDelete(false)} className="px-3 py-1 text-xs font-medium text-lumina-600 bg-white dark:bg-lumina-800 rounded-lg border border-lumina-200 dark:border-lumina-700">ยกเลิก</button>
                        <button onClick={handleDelete} className="px-3 py-1 text-xs font-medium text-white bg-google-red-500 rounded-lg hover:bg-google-red-600">ลบ</button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="px-6 py-3 border-t border-lumina-100 dark:border-lumina-800 flex items-center gap-2">
                {editing ? (
                  <>
                    <button onClick={() => setEditing(false)} className="px-4 py-2 text-sm font-medium text-lumina-600 dark:text-lumina-300 hover:bg-lumina-100 dark:hover:bg-lumina-800 rounded-xl transition-colors">
                      ยกเลิก
                    </button>
                    <motion.button whileTap={{ scale: 0.97 }} onClick={saveEdit}
                      className="px-4 py-2 text-sm font-medium gradient-bg text-white rounded-xl hover:opacity-90 transition-all">
                      บันทึก
                    </motion.button>
                  </>
                ) : (
                  <>
                    <motion.button whileTap={{ scale: 0.97 }} onClick={startEdit}
                      className="flex-1 px-4 py-2 text-sm font-medium text-lumina-700 dark:text-lumina-200 bg-lumina-100 dark:bg-lumina-800 hover:bg-lumina-200 dark:hover:bg-lumina-700 rounded-xl transition-colors">
                      แก้ไข
                    </motion.button>
                    <button onClick={() => setConfirmDelete(true)}
                      className="p-2 rounded-xl text-google-red-400 hover:bg-google-red-50 dark:hover:bg-google-red-900/20 hover:text-google-red-600 transition-colors">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M3 4H13M5.5 4V3C5.5 2.44772 5.94772 2 6.5 2H9.5C10.0523 2 10.5 2.44772 10.5 3V4M6.5 7V11.5M9.5 7V11.5M4 4L4.8 13C4.8 13.5523 5.24772 14 5.8 14H10.2C10.7523 14 11.2 13.5523 11.2 13L12 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    <button onClick={onClose}
                      className="px-4 py-2 text-sm font-medium text-lumina-500 hover:bg-lumina-100 dark:hover:bg-lumina-800 rounded-xl transition-colors">
                      ปิด
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
