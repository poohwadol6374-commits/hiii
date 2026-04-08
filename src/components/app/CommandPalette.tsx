"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useTaskStore } from "@/stores/taskStore";
import { useGoalStore } from "@/stores/goalStore";
import { useFocusStore } from "@/stores/focusStore";
import { usePomodoroStore } from "@/stores/pomodoroStore";

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: string;
  category: "nav" | "task" | "goal" | "action";
  action: () => void;
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const tasks = useTaskStore((s) => s.tasks);
  const goals = useGoalStore((s) => s.goals);
  const toggleComplete = useTaskStore((s) => s.toggleComplete);
  const startFocus = useFocusStore((s) => s.startFocus);
  const togglePomodoro = usePomodoroStore((s) => s.toggleOpen);

  // Ctrl+K / Cmd+K to open
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const allItems: CommandItem[] = useMemo(() => {
    const nav: CommandItem[] = [
      { id: "nav-dashboard", label: "Dashboard", description: "แดชบอร์ด", icon: "📊", category: "nav", action: () => { router.push("/dashboard"); setOpen(false); } },
      { id: "nav-calendar", label: "Calendar", description: "ปฏิทิน", icon: "📅", category: "nav", action: () => { router.push("/calendar"); setOpen(false); } },
      { id: "nav-tasks", label: "Tasks", description: "งาน", icon: "✅", category: "nav", action: () => { router.push("/tasks"); setOpen(false); } },
      { id: "nav-analytics", label: "Analytics", description: "วิเคราะห์", icon: "📈", category: "nav", action: () => { router.push("/analytics"); setOpen(false); } },
      { id: "nav-goals", label: "Goals", description: "เป้าหมาย", icon: "🎯", category: "nav", action: () => { router.push("/goals"); setOpen(false); } },
      { id: "nav-settings", label: "Settings", description: "ตั้งค่า", icon: "⚙️", category: "nav", action: () => { router.push("/settings"); setOpen(false); } },
      { id: "nav-profile", label: "Profile", description: "โปรไฟล์", icon: "👤", category: "nav", action: () => { router.push("/profile"); setOpen(false); } },
    ];

    const actions: CommandItem[] = [
      { id: "act-pomodoro", label: "Toggle Pomodoro", description: "เปิด/ปิด Pomodoro Timer", icon: "🍅", category: "action", action: () => { togglePomodoro(); setOpen(false); } },
    ];

    const taskItems: CommandItem[] = tasks.filter((t) => t.status !== "completed").map((t) => ({
      id: `task-${t.id}`,
      label: t.title,
      description: `${t.priority} priority · ${t.estimatedDuration} min`,
      icon: t.priority === "high" ? "🔴" : t.priority === "medium" ? "🟡" : "🟢",
      category: "task" as const,
      action: () => { startFocus(t.id, t.title); setOpen(false); },
    }));

    const goalItems: CommandItem[] = goals.filter((g) => g.currentCount < g.targetCount).map((g) => ({
      id: `goal-${g.id}`,
      label: g.title,
      description: `${g.currentCount}/${g.targetCount} ${g.unit}`,
      icon: "🎯",
      category: "goal" as const,
      action: () => { router.push("/goals"); setOpen(false); },
    }));

    return [...nav, ...actions, ...taskItems, ...goalItems];
  }, [tasks, goals, router, togglePomodoro, startFocus]);

  const filtered = useMemo(() => {
    if (!query.trim()) return allItems.slice(0, 12);
    const q = query.toLowerCase();
    return allItems.filter((item) =>
      item.label.toLowerCase().includes(q) ||
      item.description?.toLowerCase().includes(q)
    ).slice(0, 12);
  }, [query, allItems]);

  // Reset selection when filtered changes
  useEffect(() => { setSelectedIndex(0); }, [filtered]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && filtered[selectedIndex]) {
      e.preventDefault();
      filtered[selectedIndex].action();
    }
  }, [filtered, selectedIndex]);

  const categoryLabel: Record<string, string> = { nav: "นำทาง", task: "Focus on Task", goal: "เป้าหมาย", action: "คำสั่ง" };

  if (!open) return null;

  // Group by category
  const grouped = filtered.reduce<Record<string, CommandItem[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  let flatIndex = 0;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[3000] flex items-start justify-center pt-[15vh]"
        onClick={() => setOpen(false)}>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="relative w-full max-w-lg bg-white dark:bg-lumina-900 rounded-2xl border border-lumina-200 dark:border-lumina-800 overflow-hidden"
          style={{ boxShadow: "0 25px 60px rgba(0,0,0,0.2)" }}
          onClick={(e) => e.stopPropagation()}>

          {/* Search input */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-lumina-100 dark:border-lumina-800">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="text-lumina-400 flex-shrink-0">
              <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M12.5 12.5L16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="ค้นหาหน้า, งาน, คำสั่ง..."
              className="flex-1 bg-transparent text-sm outline-none text-lumina-900 dark:text-lumina-100 placeholder:text-lumina-400"
            />
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-lumina-400 bg-lumina-100 dark:bg-lumina-800 rounded">Esc</kbd>
          </div>

          {/* Results */}
          <div className="max-h-80 overflow-y-auto py-2">
            {filtered.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <p className="text-sm text-lumina-400">ไม่พบผลลัพธ์สำหรับ &quot;{query}&quot;</p>
              </div>
            ) : (
              Object.entries(grouped).map(([cat, items]) => (
                <div key={cat}>
                  <p className="px-4 pt-2 pb-1 text-[10px] font-semibold text-lumina-400 uppercase tracking-wider">
                    {categoryLabel[cat] || cat}
                  </p>
                  {items.map((item) => {
                    const idx = flatIndex++;
                    const isSelected = idx === selectedIndex;
                    return (
                      <button
                        key={item.id}
                        onClick={item.action}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                          isSelected ? "bg-google-blue-50 dark:bg-google-blue-900/20" : "hover:bg-lumina-50 dark:hover:bg-lumina-800"
                        }`}>
                        <span className="text-base flex-shrink-0">{item.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${isSelected ? "text-google-blue-700 dark:text-google-blue-300" : "text-lumina-800 dark:text-lumina-200"}`}>{item.label}</p>
                          {item.description && <p className="text-[11px] text-lumina-400 truncate">{item.description}</p>}
                        </div>
                        {isSelected && (
                          <kbd className="text-[10px] font-mono text-lumina-400 bg-lumina-100 dark:bg-lumina-800 px-1.5 py-0.5 rounded">↵</kbd>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-lumina-100 dark:border-lumina-800 flex items-center gap-4">
            <span className="text-[10px] text-lumina-400 flex items-center gap-1">
              <kbd className="px-1 py-0.5 bg-lumina-100 dark:bg-lumina-800 rounded text-[9px] font-mono">↑↓</kbd> นำทาง
            </span>
            <span className="text-[10px] text-lumina-400 flex items-center gap-1">
              <kbd className="px-1 py-0.5 bg-lumina-100 dark:bg-lumina-800 rounded text-[9px] font-mono">↵</kbd> เลือก
            </span>
            <span className="text-[10px] text-lumina-400 flex items-center gap-1">
              <kbd className="px-1 py-0.5 bg-lumina-100 dark:bg-lumina-800 rounded text-[9px] font-mono">Esc</kbd> ปิด
            </span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
