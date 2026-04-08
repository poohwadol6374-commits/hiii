"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGoalStore, type Goal } from "@/stores/goalStore";

const colorMap = {
  blue: { bg: "bg-google-blue-50 dark:bg-google-blue-900/20", bar: "bg-google-blue-500", text: "text-google-blue-600 dark:text-google-blue-400", ring: "#4285F4", border: "border-google-blue-200 dark:border-google-blue-800" },
  green: { bg: "bg-google-green-50 dark:bg-google-green-900/20", bar: "bg-google-green-500", text: "text-google-green-600 dark:text-google-green-400", ring: "#34A853", border: "border-google-green-200 dark:border-google-green-800" },
  red: { bg: "bg-google-red-50 dark:bg-google-red-900/20", bar: "bg-google-red-500", text: "text-google-red-600 dark:text-google-red-400", ring: "#EA4335", border: "border-google-red-200 dark:border-google-red-800" },
  yellow: { bg: "bg-google-yellow-50 dark:bg-google-yellow-900/20", bar: "bg-google-yellow-500", text: "text-google-yellow-700 dark:text-google-yellow-400", ring: "#FBBC05", border: "border-google-yellow-200 dark:border-google-yellow-800" },
};

const typeBadge = { weekly: "สัปดาห์", monthly: "เดือน", custom: "กำหนดเอง" };

export default function GoalsPage() {
  const goals = useGoalStore((s) => s.goals);
  const incrementProgress = useGoalStore((s) => s.incrementProgress);
  const addGoal = useGoalStore((s) => s.addGoal);
  const deleteGoal = useGoalStore((s) => s.deleteGoal);
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-lumina-900 dark:text-lumina-100">เป้าหมาย</h1>
          <p className="text-sm text-lumina-500 dark:text-lumina-400 mt-1">ตั้งเป้าหมายและติดตามความก้าวหน้า</p>
        </div>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-google-blue-500 text-white text-sm font-medium rounded-xl hover:bg-google-blue-600 transition-colors shadow-sm">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2V14M2 8H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          เพิ่มเป้าหมาย
        </motion.button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: "ทั้งหมด", value: goals.length, icon: "🎯" },
          { label: "สำเร็จ", value: goals.filter((g) => g.currentCount >= g.targetCount).length, icon: "✅" },
          { label: "กำลังทำ", value: goals.filter((g) => g.currentCount < g.targetCount).length, icon: "🔥" },
          { label: "เฉลี่ย", value: goals.length > 0 ? Math.round(goals.reduce((a, g) => a + (g.currentCount / g.targetCount) * 100, 0) / goals.length) + "%" : "0%", icon: "📊" },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-white dark:bg-lumina-900 rounded-2xl p-4 border border-lumina-100 dark:border-lumina-800 text-center" style={{ boxShadow: "var(--shadow-card)" }}>
            <span className="text-2xl">{stat.icon}</span>
            <p className="text-lg font-bold text-lumina-900 dark:text-lumina-100 mt-1">{stat.value}</p>
            <p className="text-[11px] text-lumina-500">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Goal list */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {goals.map((goal, i) => {
            const c = colorMap[goal.color];
            const pct = Math.round((goal.currentCount / goal.targetCount) * 100);
            const done = pct >= 100;
            const circumference = 2 * Math.PI * 20;
            const offset = circumference * (1 - Math.min(pct, 100) / 100);

            return (
              <motion.div key={goal.id} layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.04, type: "spring", stiffness: 400, damping: 30 }}
                className={`bg-white dark:bg-lumina-900 rounded-2xl border ${c.border} p-4 transition-all hover:shadow-card`}
                style={{ boxShadow: "var(--shadow-soft)" }}>
                <div className="flex items-center gap-4">
                  {/* Ring */}
                  <div className="relative w-12 h-12 flex-shrink-0">
                    <svg viewBox="0 0 48 48" className="w-full h-full -rotate-90">
                      <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" className="text-lumina-100 dark:text-lumina-800" strokeWidth="4" />
                      <motion.circle cx="24" cy="24" r="20" fill="none" stroke={c.ring} strokeWidth="4" strokeLinecap="round"
                        strokeDasharray={circumference} initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: offset }} transition={{ duration: 0.8, delay: 0.2 + i * 0.05 }} />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className={`text-[10px] font-bold ${c.text}`}>{pct}%</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`text-sm font-semibold truncate ${done ? "line-through text-lumina-400" : "text-lumina-900 dark:text-lumina-100"}`}>{goal.title}</h3>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium ${c.bg} ${c.text}`}>{typeBadge[goal.type]}</span>
                    </div>
                    {goal.description && <p className="text-xs text-lumina-500 truncate mb-2">{goal.description}</p>}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-lumina-100 dark:bg-lumina-800 rounded-full overflow-hidden">
                        <motion.div className={`h-full rounded-full ${c.bar}`} initial={{ width: 0 }}
                          animate={{ width: `${Math.min(pct, 100)}%` }} transition={{ duration: 0.6, delay: 0.3 + i * 0.05 }} />
                      </div>
                      <span className="text-[11px] text-lumina-400 flex-shrink-0">{goal.currentCount}/{goal.targetCount} {goal.unit}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {!done && (
                      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => incrementProgress(goal.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-xl bg-google-green-50 dark:bg-google-green-900/20 text-google-green-600 hover:bg-google-green-100 dark:hover:bg-google-green-900/30 transition-colors" title="+1">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 3V11M3 7H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                      </motion.button>
                    )}
                    <button onClick={() => deleteGoal(goal.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-xl text-lumina-400 hover:text-google-red-500 hover:bg-google-red-50 dark:hover:bg-google-red-900/20 transition-colors">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 3L11 11M11 3L3 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Create Goal Modal */}
      <AnimatePresence>
        {showCreate && <CreateGoalModal onClose={() => setShowCreate(false)} onAdd={addGoal} />}
      </AnimatePresence>
    </div>
  );
}

function CreateGoalModal({ onClose, onAdd }: { onClose: () => void; onAdd: (g: Goal) => void }) {
  const [title, setTitle] = useState("");
  const [target, setTarget] = useState(5);
  const [unit, setUnit] = useState("tasks");
  const [type, setType] = useState<Goal["type"]>("weekly");
  const [color, setColor] = useState<Goal["color"]>("blue");

  const handleSubmit = () => {
    if (!title.trim()) return;
    onAdd({
      id: `g-${Date.now()}`,
      title: title.trim(),
      type,
      targetCount: target,
      currentCount: 0,
      unit,
      color,
      createdAt: new Date().toISOString(),
    });
    onClose();
  };

  const colors: Goal["color"][] = ["blue", "green", "red", "yellow"];
  const colorDot = { blue: "bg-google-blue-500", green: "bg-google-green-500", red: "bg-google-red-500", yellow: "bg-google-yellow-500" };

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="bg-white dark:bg-lumina-900 rounded-2xl shadow-modal w-full max-w-md overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-lumina-200/60 dark:border-lumina-800">
            <h2 className="text-lg font-semibold text-lumina-900 dark:text-lumina-100">เพิ่มเป้าหมาย</h2>
            <button onClick={onClose} className="p-1.5 rounded-lg text-lumina-400 hover:text-lumina-700 dark:hover:text-lumina-200 hover:bg-lumina-100 dark:hover:bg-lumina-800 transition-colors">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4.5 4.5L13.5 13.5M4.5 13.5L13.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            </button>
          </div>
          <div className="px-6 py-5 space-y-4">
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="ชื่อเป้าหมาย..."
              className="w-full px-4 py-3 text-sm bg-lumina-50 dark:bg-lumina-800 rounded-xl border border-lumina-200 dark:border-lumina-700 outline-none focus:ring-2 focus:ring-google-blue-200 placeholder:text-lumina-400 dark:text-lumina-100" autoFocus />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-lumina-500 mb-1.5">เป้าหมาย</label>
                <input type="number" value={target} onChange={(e) => setTarget(Number(e.target.value))} min={1}
                  className="w-full px-3 py-2.5 text-sm bg-lumina-50 dark:bg-lumina-800 rounded-xl border border-lumina-200 dark:border-lumina-700 outline-none focus:ring-2 focus:ring-google-blue-200 dark:text-lumina-100" />
              </div>
              <div>
                <label className="block text-xs font-medium text-lumina-500 mb-1.5">หน่วย</label>
                <input type="text" value={unit} onChange={(e) => setUnit(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm bg-lumina-50 dark:bg-lumina-800 rounded-xl border border-lumina-200 dark:border-lumina-700 outline-none focus:ring-2 focus:ring-google-blue-200 placeholder:text-lumina-400 dark:text-lumina-100" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-lumina-500 mb-1.5">ประเภท</label>
              <div className="flex gap-2">
                {(["weekly", "monthly", "custom"] as const).map((t) => (
                  <button key={t} onClick={() => setType(t)}
                    className={`flex-1 px-3 py-2 text-xs font-medium rounded-xl border transition-all ${type === t ? "bg-google-blue-500 text-white border-google-blue-500" : "border-lumina-200 dark:border-lumina-700 text-lumina-500 hover:bg-lumina-50 dark:hover:bg-lumina-800"}`}>
                    {{ weekly: "สัปดาห์", monthly: "เดือน", custom: "กำหนดเอง" }[t]}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-lumina-500 mb-1.5">สี</label>
              <div className="flex gap-2">
                {colors.map((c) => (
                  <button key={c} onClick={() => setColor(c)}
                    className={`w-8 h-8 rounded-full ${colorDot[c]} transition-all ${color === c ? "ring-2 ring-offset-2 ring-lumina-400" : "opacity-60 hover:opacity-100"}`} />
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-lumina-200/60 dark:border-lumina-800">
            <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-lumina-600 dark:text-lumina-300 hover:bg-lumina-100 dark:hover:bg-lumina-800 rounded-xl transition-colors">ยกเลิก</button>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={handleSubmit}
              className="px-5 py-2 text-sm font-medium bg-google-blue-500 text-white rounded-xl hover:bg-google-blue-600 transition-colors shadow-sm">สร้าง</motion.button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
