"use client";

import { motion } from "framer-motion";

const events = [
  { title: "Team Standup", time: "09:00", color: "bg-google-blue-100 border-google-blue-300 text-google-blue-700" },
  { title: "Deep Work: Q4 Report", time: "10:00", color: "bg-google-green-100 border-google-green-300 text-google-green-700" },
  { title: "Design Review", time: "14:00", color: "bg-google-yellow-100 border-google-yellow-300 text-google-yellow-700" },
  { title: "1:1 with Manager", time: "16:00", color: "bg-google-red-100 border-google-red-300 text-google-red-700" },
];

const tasks = [
  { title: "Prepare Q4 Report", priority: "bg-google-red-500", done: false },
  { title: "Review Pull Requests", priority: "bg-google-yellow-500", done: false },
  { title: "Update Documentation", priority: "bg-google-green-500", done: true },
];

export default function AppMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.9, ease: "easeOut" }}
      className="relative w-full max-w-4xl mx-auto mt-16"
    >
      {/* Glow behind */}
      <div className="absolute inset-0 bg-google-blue-400/10 blur-3xl rounded-3xl scale-95" />

      {/* Browser frame */}
      <div className="relative bg-white rounded-2xl border border-lumina-200/60 overflow-hidden"
        style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.04)" }}>

        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-3 bg-lumina-50 border-b border-lumina-100">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-google-red-400" />
            <div className="w-3 h-3 rounded-full bg-google-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-google-green-400" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="px-4 py-1 bg-white rounded-lg border border-lumina-200 text-[10px] text-lumina-400 font-mono">
              lumina.app/dashboard
            </div>
          </div>
          <div className="w-12" />
        </div>

        {/* App content */}
        <div className="flex h-[340px] md:h-[400px]">
          {/* Mini sidebar */}
          <div className="hidden sm:flex flex-col items-center w-14 bg-white border-r border-lumina-100 py-4 gap-3">
            <div className="w-7 h-7 rounded-lg gradient-bg flex items-center justify-center">
              <span className="text-white text-[8px] font-bold">L</span>
            </div>
            <div className="mt-2 space-y-2">
              {["📊", "📅", "✅", "📈", "🎯", "⚙️"].map((icon, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 + i * 0.05 }}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs ${i === 0 ? "bg-google-blue-50" : "hover:bg-lumina-50"} transition-colors`}>
                  {icon}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Main area */}
          <div className="flex-1 flex flex-col">
            {/* Top bar */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-lumina-100">
              <div className="flex items-center gap-2">
                <div className="w-32 h-7 bg-lumina-100 rounded-lg" />
              </div>
              <div className="flex items-center gap-2">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}
                  className="px-3 py-1.5 gradient-bg text-white text-[10px] font-semibold rounded-lg">+ เพิ่มงาน</motion.div>
                <div className="w-6 h-6 rounded-full gradient-bg" />
              </div>
            </div>

            {/* Content grid */}
            <div className="flex-1 flex overflow-hidden">
              {/* Calendar column */}
              <div className="flex-1 p-3 overflow-hidden">
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}
                  className="text-[11px] font-semibold text-lumina-900 mb-2">ตารางวันนี้</motion.p>
                <div className="space-y-1.5">
                  {events.map((ev, i) => (
                    <motion.div key={ev.title} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.3 + i * 0.08 }}
                      className={`flex items-center gap-2 px-2.5 py-2 rounded-lg border ${ev.color} text-[10px] font-medium`}>
                      <span className="text-lumina-400 font-mono">{ev.time}</span>
                      <span>{ev.title}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Tasks column */}
              <div className="w-48 border-l border-lumina-100 p-3 hidden md:block">
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
                  className="text-[11px] font-semibold text-lumina-900 mb-2">งานสำคัญ</motion.p>
                <div className="space-y-1.5">
                  {tasks.map((task, i) => (
                    <motion.div key={task.title} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.4 + i * 0.08 }}
                      className="flex items-center gap-2 py-1.5">
                      <div className={`w-2 h-2 rounded-full ${task.priority} flex-shrink-0`} />
                      <span className={`text-[10px] ${task.done ? "line-through text-lumina-400" : "text-lumina-700"}`}>{task.title}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Luma AI card */}
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.8 }}
                  className="mt-3 p-2.5 bg-google-blue-50 rounded-xl border border-google-blue-100">
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="w-4 h-4 rounded-full gradient-bg flex items-center justify-center">
                      <span className="text-white text-[6px] font-bold">L</span>
                    </div>
                    <span className="text-[9px] font-semibold text-google-blue-700">Luma AI</span>
                  </div>
                  <p className="text-[9px] text-google-blue-600 leading-relaxed">
                    เริ่มจาก Q4 Report ก่อนนะ — priority สูงสุดวันนี้
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2, type: "spring", stiffness: 200 }}
        className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-white rounded-full border border-lumina-200 shadow-lg"
      >
        <span className="text-xs text-lumina-500">✨ Powered by <span className="font-semibold text-google-blue-600">Luma AI</span></span>
      </motion.div>
    </motion.div>
  );
}
