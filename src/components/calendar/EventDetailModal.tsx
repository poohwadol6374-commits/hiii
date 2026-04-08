"use client";

import { motion, AnimatePresence } from "framer-motion";
import { type CalendarEvent, categoryStyles, categoryLabels } from "./mockData";

interface EventDetailModalProps {
  event: CalendarEvent | null;
  open: boolean;
  onClose: () => void;
}

function fmt(h: number, m: number) {
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

const recurrenceLabels: Record<string, string> = {
  daily: "ทุกวัน",
  weekdays: "วันจันทร์-ศุกร์",
  weekly: "ทุกสัปดาห์",
  biweekly: "ทุก 2 สัปดาห์",
  monthly: "ทุกเดือน",
};

export default function EventDetailModal({ event, open, onClose }: EventDetailModalProps) {
  if (!event) return null;
  const style = categoryStyles[event.category];
  const duration = (event.endHour * 60 + event.endMinute) - (event.startHour * 60 + event.startMinute);
  const hours = Math.floor(duration / 60);
  const mins = duration % 60;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="bg-white dark:bg-lumina-900 rounded-2xl shadow-modal w-full max-w-md overflow-hidden">
              {/* Header with category color */}
              <div className={`${style.bg} border-b ${style.border} px-6 py-4`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${style.dot}`} />
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${style.bg} ${style.text} border ${style.border}`}>
                      {categoryLabels[event.category]}
                    </span>
                    {event.recurrence && event.recurrence !== "none" && (
                      <span className="text-[10px] text-lumina-500">🔄 {recurrenceLabels[event.recurrence] || event.recurrence}</span>
                    )}
                  </div>
                  <button onClick={onClose} className="p-1.5 rounded-lg text-lumina-400 hover:text-lumina-700 dark:hover:text-lumina-200 hover:bg-white/50 transition-colors">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 py-5 space-y-4">
                <h2 className="text-lg font-semibold text-lumina-900 dark:text-lumina-100">{event.title}</h2>

                {event.description && (
                  <p className="text-sm text-lumina-600 dark:text-lumina-400 leading-relaxed">{event.description}</p>
                )}

                {/* Time info */}
                <div className="space-y-2.5">
                  <div className="flex items-center gap-3 py-2 border-b border-lumina-100 dark:border-lumina-800">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-lumina-400 flex-shrink-0">
                      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M8 5V8L10 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-lumina-800 dark:text-lumina-200">
                        {fmt(event.startHour, event.startMinute)} - {fmt(event.endHour, event.endMinute)}
                      </p>
                      <p className="text-[11px] text-lumina-400">
                        {hours > 0 ? `${hours} ชม. ` : ""}{mins > 0 ? `${mins} นาที` : ""}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-lumina-100 dark:border-lumina-800 flex justify-end">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={onClose}
                  className="px-5 py-2 text-sm font-medium text-lumina-600 dark:text-lumina-300 hover:bg-lumina-100 dark:hover:bg-lumina-800 rounded-xl transition-colors">
                  ปิด
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
