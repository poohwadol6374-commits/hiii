"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCalendarStore } from "@/stores/calendarStore";
import { type EventCategory, type RecurrenceType } from "./mockData";

interface EventCreateModalProps {
  open: boolean;
  onClose: () => void;
  defaultDay?: number;
  defaultStartHour?: number;
  defaultStartMinute?: number;
}

const categories: { key: EventCategory; label: string; emoji: string }[] = [
  { key: "meeting", label: "ประชุม", emoji: "👥" },
  { key: "focus", label: "โฟกัส", emoji: "🎯" },
  { key: "break", label: "พัก", emoji: "☕" },
  { key: "personal", label: "ส่วนตัว", emoji: "🏠" },
];

const recurrenceOptions: { key: RecurrenceType; label: string }[] = [
  { key: "none", label: "ไม่ทำซ้ำ" },
  { key: "daily", label: "ทุกวัน" },
  { key: "weekdays", label: "วันทำงาน" },
  { key: "weekly", label: "ทุกสัปดาห์" },
  { key: "monthly", label: "ทุกเดือน" },
];

const dayLabels = ["จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์", "อาทิตย์"];

export default function EventCreateModal({ open, onClose, defaultDay = 0, defaultStartHour = 9, defaultStartMinute = 0 }: EventCreateModalProps) {
  const addEvent = useCalendarStore((s) => s.addEvent);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<EventCategory>("meeting");
  const [day, setDay] = useState(defaultDay);
  const [startH, setStartH] = useState(defaultStartHour);
  const [startM, setStartM] = useState(defaultStartMinute);
  const [duration, setDuration] = useState(60);
  const [recurrence, setRecurrence] = useState<RecurrenceType>("none");

  const handleSubmit = () => {
    if (!title.trim()) return;
    const endMinutes = startH * 60 + startM + duration;
    addEvent({
      id: `ev-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      title: title.trim(),
      startHour: startH,
      startMinute: startM,
      endHour: Math.floor(endMinutes / 60),
      endMinute: endMinutes % 60,
      dayOfWeek: day,
      category,
      recurrence: recurrence !== "none" ? recurrence : undefined,
      recurrenceId: recurrence !== "none" ? `rec-${Date.now()}` : undefined,
    });
    onClose();
    setTitle("");
  };

  const fmt = (h: number, m: number) => `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  const endMin = startH * 60 + startM + duration;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50" onClick={onClose} />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="bg-white dark:bg-lumina-900 rounded-2xl shadow-modal w-full max-w-md overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-lumina-200/60 dark:border-lumina-800">
                <h2 className="text-base font-semibold text-lumina-900 dark:text-lumina-100">สร้างกิจกรรม</h2>
                <button onClick={onClose} className="p-1.5 rounded-lg text-lumina-400 hover:text-lumina-700 dark:hover:text-lumina-200 hover:bg-lumina-100 dark:hover:bg-lumina-800 transition-colors">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                </button>
              </div>

              <div className="px-5 py-4 space-y-4">
                {/* Title */}
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="ชื่อกิจกรรม..."
                  className="w-full px-4 py-3 text-sm bg-lumina-50 dark:bg-lumina-800 rounded-xl border border-lumina-200 dark:border-lumina-700 outline-none focus:ring-2 focus:ring-google-blue-200 placeholder:text-lumina-400 dark:text-lumina-100" autoFocus
                  onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }} />

                {/* Category */}
                <div className="flex gap-2">
                  {categories.map((c) => (
                    <button key={c.key} onClick={() => setCategory(c.key)}
                      className={`flex-1 px-2 py-2 text-xs font-medium rounded-xl border transition-all text-center ${
                        category === c.key ? "bg-google-blue-500 text-white border-google-blue-500" : "border-lumina-200 dark:border-lumina-700 text-lumina-500 hover:bg-lumina-50 dark:hover:bg-lumina-800"
                      }`}>
                      {c.emoji} {c.label}
                    </button>
                  ))}
                </div>

                {/* Day */}
                <div>
                  <label className="block text-xs font-medium text-lumina-500 mb-1.5">วัน</label>
                  <div className="flex gap-1">
                    {dayLabels.map((d, i) => (
                      <button key={i} onClick={() => setDay(i)}
                        className={`flex-1 py-1.5 text-[10px] font-medium rounded-lg transition-all ${
                          day === i ? "bg-google-blue-500 text-white" : "bg-lumina-50 dark:bg-lumina-800 text-lumina-500 hover:bg-lumina-100"
                        }`}>
                        {d.slice(0, 2)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-lumina-500 mb-1.5">เริ่ม</label>
                    <select value={startH * 60 + startM} onChange={(e) => { const v = Number(e.target.value); setStartH(Math.floor(v / 60)); setStartM(v % 60); }}
                      className="w-full px-2 py-2 text-sm bg-lumina-50 dark:bg-lumina-800 rounded-xl border border-lumina-200 dark:border-lumina-700 outline-none dark:text-lumina-100">
                      {Array.from({ length: 48 }, (_, i) => { const h = Math.floor((i * 30) / 60) + 6; const m = (i * 30) % 60; if (h > 22) return null;
                        return <option key={i} value={h * 60 + m}>{fmt(h, m)}</option>; })}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-lumina-500 mb-1.5">ระยะเวลา</label>
                    <select value={duration} onChange={(e) => setDuration(Number(e.target.value))}
                      className="w-full px-2 py-2 text-sm bg-lumina-50 dark:bg-lumina-800 rounded-xl border border-lumina-200 dark:border-lumina-700 outline-none dark:text-lumina-100">
                      {[15, 30, 45, 60, 90, 120, 180].map((d) => (
                        <option key={d} value={d}>{d < 60 ? `${d} นาที` : `${d / 60} ชม.`}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-lumina-500 mb-1.5">สิ้นสุด</label>
                    <div className="px-2 py-2 text-sm bg-lumina-100 dark:bg-lumina-800 rounded-xl text-lumina-500 text-center">
                      {fmt(Math.floor(endMin / 60), endMin % 60)}
                    </div>
                  </div>
                </div>

                {/* Recurrence */}
                <div>
                  <label className="block text-xs font-medium text-lumina-500 mb-1.5">ทำซ้ำ</label>
                  <div className="flex flex-wrap gap-1.5">
                    {recurrenceOptions.map((r) => (
                      <button key={r.key} onClick={() => setRecurrence(r.key)}
                        className={`px-2.5 py-1.5 text-[11px] font-medium rounded-lg border transition-all ${
                          recurrence === r.key ? "bg-google-blue-500 text-white border-google-blue-500" : "border-lumina-200 dark:border-lumina-700 text-lumina-500 hover:bg-lumina-50"
                        }`}>
                        {r.key !== "none" && "🔄 "}{r.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 px-5 py-3 border-t border-lumina-200/60 dark:border-lumina-800">
                <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-lumina-600 dark:text-lumina-300 hover:bg-lumina-100 dark:hover:bg-lumina-800 rounded-xl transition-colors">ยกเลิก</button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={handleSubmit}
                  className="px-5 py-2 text-sm font-medium bg-google-blue-500 text-white rounded-xl hover:bg-google-blue-600 transition-colors shadow-sm">
                  สร้าง
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
