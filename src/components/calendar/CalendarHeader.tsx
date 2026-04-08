"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export type CalendarViewType = "day" | "week" | "month";

interface CalendarHeaderProps {
  view: CalendarViewType;
  onViewChange: (view: CalendarViewType) => void;
  dateLabel: string;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

const views: CalendarViewType[] = ["day", "week", "month"];

export default function CalendarHeader({
  view,
  onViewChange,
  dateLabel,
  onPrev,
  onNext,
  onToday,
}: CalendarHeaderProps) {
  const t = useTranslations("CalendarPage");

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
      {/* Left: Navigation + Date */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToday}
          className="px-3 py-1.5 text-xs font-medium text-google-blue-600 bg-google-blue-50 hover:bg-google-blue-100 rounded-lg transition-colors"
        >
          {t("today")}
        </button>
        <div className="flex items-center gap-0.5">
          <button
            onClick={onPrev}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-lumina-500 hover:bg-lumina-100 dark:hover:bg-lumina-800 hover:text-lumina-700 dark:hover:text-lumina-300 transition-colors"
            aria-label={t("prev")}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            onClick={onNext}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-lumina-500 hover:bg-lumina-100 dark:hover:bg-lumina-800 hover:text-lumina-700 dark:hover:text-lumina-300 transition-colors"
            aria-label={t("next")}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        <h2 className="text-base md:text-lg font-semibold text-lumina-900 dark:text-lumina-100 ml-1">
          {dateLabel}
        </h2>
      </div>

      {/* Right: View Switcher */}
      <div className="relative flex items-center bg-lumina-100 dark:bg-lumina-800 rounded-xl p-0.5">
        {views.map((v) => (
          <button
            key={v}
            onClick={() => onViewChange(v)}
            className={`relative z-10 px-4 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              view === v ? "text-google-blue-700 dark:text-google-blue-300" : "text-lumina-500 hover:text-lumina-700 dark:hover:text-lumina-300"
            }`}
          >
            {view === v && (
              <motion.div
                layoutId="calendar-view-tab"
                className="absolute inset-0 bg-white dark:bg-lumina-700 rounded-lg shadow-soft"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{t(v)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
