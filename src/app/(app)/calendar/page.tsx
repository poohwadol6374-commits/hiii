"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import CalendarHeader, {
  type CalendarViewType,
} from "@/components/calendar/CalendarHeader";
import WeekView from "@/components/calendar/WeekView";
import DayView from "@/components/calendar/DayView";
import MonthView from "@/components/calendar/MonthView";
import ShortcutsHelp from "@/components/app/ShortcutsHelp";
import { useKeyboardShortcuts, type ShortcutDef } from "@/hooks/useKeyboardShortcuts";
import { useToast } from "@/components/app/Toast";
import { usePomodoroStore } from "@/stores/pomodoroStore";
import { useSwipe } from "@/hooks/useSwipe";
import {
  getMonday,
  MONTH_NAMES,
} from "@/components/calendar/calendarUtils";

export default function CalendarPage() {
  const t = useTranslations("CalendarPage");
  const { showToast } = useToast();
  const togglePomodoro = usePomodoroStore((s) => s.toggleOpen);

  const [view, setView] = useState<CalendarViewType>("week");
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setView("day");
    }
  }, []);

  const monday = getMonday(currentDate);

  const navigate = useCallback(
    (direction: "prev" | "next" | "today") => {
      if (direction === "today") {
        setCurrentDate(new Date());
        return;
      }
      const d = new Date(currentDate);
      const delta = direction === "prev" ? -1 : 1;
      if (view === "day") {
        d.setDate(d.getDate() + delta);
      } else if (view === "week") {
        d.setDate(d.getDate() + delta * 7);
      } else {
        d.setMonth(d.getMonth() + delta);
      }
      setCurrentDate(d);
    },
    [currentDate, view],
  );

  const handleDayClick = useCallback((date: Date) => {
    setCurrentDate(date);
    setView("day");
  }, []);

  // Keyboard shortcuts
  const shortcuts: ShortcutDef[] = useMemo(
    () => [
      {
        key: "d",
        label: "D",
        description: "Switch to Day view",
        action: () => {
          setView("day");
          showToast("Switched to Day view", "info");
        },
      },
      {
        key: "w",
        label: "W",
        description: "Switch to Week view",
        action: () => {
          setView("week");
          showToast("Switched to Week view", "info");
        },
      },
      {
        key: "m",
        label: "M",
        description: "Switch to Month view",
        action: () => {
          setView("month");
          showToast("Switched to Month view", "info");
        },
      },
      {
        key: "t",
        label: "T",
        description: "Go to Today",
        action: () => {
          setCurrentDate(new Date());
          showToast("Jumped to Today", "info");
        },
      },
      {
        key: "ArrowLeft",
        label: "←",
        description: "Navigate to previous period",
        action: () => navigate("prev"),
      },
      {
        key: "ArrowRight",
        label: "→",
        description: "Navigate to next period",
        action: () => navigate("next"),
      },
      {
        key: "n",
        label: "N",
        description: "New task",
        action: () => showToast("New task modal coming soon", "info"),
      },
      {
        key: "q",
        label: "Q",
        description: "Quick Capture",
        action: () => showToast("Quick Capture coming soon", "info"),
      },
      {
        key: "l",
        label: "L",
        description: "Toggle Luma panel",
        action: () => showToast("Toggle Luma panel", "info"),
      },
      {
        key: "p",
        label: "P",
        description: "Toggle Pomodoro Timer",
        action: () => togglePomodoro(),
      },
    ],
    [navigate, showToast, togglePomodoro],
  );

  const { helpOpen, closeHelp } = useKeyboardShortcuts({ shortcuts });

  // Swipe gestures for mobile
  const swipeHandlers = useSwipe(
    () => navigate("next"),
    () => navigate("prev"),
  );

  // Build date label
  const dateLabel = (() => {
    if (view === "day") {
      return `${currentDate.getDate()} ${MONTH_NAMES[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    }
    if (view === "week") {
      const sun = new Date(monday);
      sun.setDate(monday.getDate() + 6);
      if (monday.getMonth() === sun.getMonth()) {
        return `${monday.getDate()} – ${sun.getDate()} ${MONTH_NAMES[monday.getMonth()]} ${monday.getFullYear()}`;
      }
      return `${monday.getDate()} ${MONTH_NAMES[monday.getMonth()].slice(0, 3)} – ${sun.getDate()} ${MONTH_NAMES[sun.getMonth()].slice(0, 3)} ${sun.getFullYear()}`;
    }
    return `${MONTH_NAMES[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
  })();

  return (
    <div className="flex flex-col h-full p-3 md:p-4">
      <CalendarHeader
        view={view}
        onViewChange={setView}
        dateLabel={dateLabel}
        onPrev={() => navigate("prev")}
        onNext={() => navigate("next")}
        onToday={() => navigate("today")}
      />

      <div
        className="flex-1 bg-white dark:bg-lumina-900 rounded-2xl border border-lumina-100 dark:border-lumina-800 overflow-hidden"
        style={{ boxShadow: "var(--shadow-card)" }}
        {...swipeHandlers}
      >
        <AnimatePresence mode="wait">
          {view === "week" && <WeekView key="week" monday={monday} />}
          {view === "day" && <DayView key="day" date={currentDate} />}
          {view === "month" && (
            <MonthView
              key="month"
              date={currentDate}
              onDayClick={handleDayClick}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Keyboard shortcuts help overlay */}
      <ShortcutsHelp
        open={helpOpen}
        onClose={closeHelp}
        shortcuts={shortcuts}
      />
    </div>
  );
}
