import type { Task } from "@/stores/taskStore";
import type { LumaPersonality } from "@/stores/settingsStore";
import { calculatePriorityScore } from "./priorityScore";
import { explainPriority } from "./explainPriority";

// ── Types ────────────────────────────────────────────────

export type LumaIntent =
  | "schedule_today"
  | "most_important"
  | "summarize"
  | "free_time"
  | "break_suggestion"
  | "block_tasks"
  | "deadline_check"
  | "productivity_tips"
  | "energy_advice"
  | "greeting"
  | "thanks"
  | "help"
  | "unknown";

export interface LumaChatResponse {
  text: string;
  intent: LumaIntent;
  quickActions?: string[];
}

// ── Intent detection (expanded pattern matching) ─────────

const PATTERNS: { intent: LumaIntent; patterns: RegExp[] }[] = [
  {
    intent: "schedule_today",
    patterns: [/จัดตาราง/i, /schedule/i, /optimize/i, /จัดการวันนี้/i, /วางแผน/i, /plan.*today/i, /จัดงาน/i],
  },
  {
    intent: "most_important",
    patterns: [/สำคัญที่สุด/i, /most\s*important/i, /ควรทำอะไรก่อน/i, /priority/i, /งานไหน.*ก่อน/i, /what.*first/i, /ทำอะไรดี/i],
  },
  {
    intent: "summarize",
    patterns: [/สรุป/i, /summarize/i, /summary/i, /ภาพรวม/i, /overview/i, /วันนี้เป็นไง/i, /how.*going/i, /status/i],
  },
  {
    intent: "free_time",
    patterns: [/เวลาว่าง/i, /free\s*time/i, /ว่าง/i, /มีเวลา/i, /have.*time/i, /\d+\s*(ชั่วโมง|ชม|hour|hr|min|นาที)/i],
  },
  {
    intent: "break_suggestion",
    patterns: [/พัก/i, /break/i, /เหนื่อย/i, /tired/i, /rest/i, /หมดแรง/i, /burnout/i, /ไม่ไหว/i],
  },
  {
    intent: "block_tasks",
    patterns: [/รวมงาน/i, /block/i, /group.*task/i, /จัดกลุ่ม/i, /batch/i, /รวม/i],
  },
  {
    intent: "deadline_check",
    patterns: [/deadline/i, /กำหนดส่ง/i, /ใกล้.*deadline/i, /due.*soon/i, /เลยกำหนด/i, /overdue/i, /ใกล้หมดเวลา/i],
  },
  {
    intent: "productivity_tips",
    patterns: [/เคล็ดลับ/i, /tips/i, /แนะนำ/i, /advice/i, /ทำยังไงให้.*ดี/i, /improve/i, /productive/i, /เพิ่มประสิทธิภาพ/i],
  },
  {
    intent: "energy_advice",
    patterns: [/พลังงาน/i, /energy/i, /ช่วงไหน.*ดี/i, /best.*time/i, /เวลาไหน/i, /when.*should/i, /ตอนไหน/i],
  },
  {
    intent: "greeting",
    patterns: [/^(สวัสดี|หวัดดี|ดี|hi|hello|hey|yo|เฮ)/i],
  },
  {
    intent: "thanks",
    patterns: [/ขอบคุณ|thanks|thank you|thx|ขอบใจ/i],
  },
  {
    intent: "help",
    patterns: [/ช่วย|help|ทำอะไรได้/i, /คำสั่ง/i, /command/i],
  },
];

export function detectIntent(message: string): LumaIntent {
  const trimmed = message.trim();
  if (!trimmed) return "unknown";
  for (const { intent, patterns } of PATTERNS) {
    if (patterns.some((p) => p.test(trimmed))) return intent;
  }
  return "unknown";
}

// ── Personality wrappers ─────────────────────────────────

function wrap(text: string, personality: LumaPersonality): string {
  switch (personality) {
    case "formal":
      return text.replace(/!$/gm, "ครับ").replace(/นะ/g, "นะครับ");
    case "cheerful":
      return text + (text.includes("🎉") ? "" : " ✨");
    case "motivational":
      return text + (text.includes("💪") ? "" : " 💪 คุณทำได้!");
    case "minimal":
      // Strip emoji and shorten
      return text.replace(/[🎉✨💪☕🍅📊📋💡🔥⚡]/g, "").replace(/\n{2,}/g, "\n").trim();
    default: // friendly
      return text;
  }
}

// ── Helpers ──────────────────────────────────────────────

function getHourGreeting(hour: number): string {
  if (hour < 6) return "ดึกแล้วนะ 🌙";
  if (hour < 12) return "อรุณสวัสดิ์ ☀️";
  if (hour < 17) return "สวัสดีตอนบ่าย 🌤️";
  if (hour < 21) return "สวัสดีตอนเย็น 🌅";
  return "ดึกแล้วนะ 🌙";
}

function extractMinutes(message: string): number | null {
  const hourMatch = message.match(/(\d+)\s*(ชั่วโมง|ชม|hour|hr)/i);
  const minMatch = message.match(/(\d+)\s*(นาที|min)/i);
  let total = 0;
  if (hourMatch) total += parseInt(hourMatch[1]) * 60;
  if (minMatch) total += parseInt(minMatch[1]);
  return total > 0 ? total : null;
}

function getPendingTasks(tasks: Task[]): Task[] {
  return tasks.filter((t) => t.status !== "completed");
}

function getHighPriority(tasks: Task[]): Task[] {
  return tasks.filter((t) => t.priority === "high" && t.status !== "completed");
}

function getOverdueTasks(tasks: Task[]): Task[] {
  const now = Date.now();
  return tasks.filter((t) => t.deadline && new Date(t.deadline).getTime() < now && t.status !== "completed");
}

function getUpcomingDeadlines(tasks: Task[], withinDays: number): Task[] {
  const now = Date.now();
  const limit = now + withinDays * 24 * 60 * 60 * 1000;
  return tasks.filter((t) => t.deadline && new Date(t.deadline).getTime() > now && new Date(t.deadline).getTime() < limit && t.status !== "completed");
}

// ── Response generation ──────────────────────────────────

export function generateResponse(
  message: string,
  tasks: Task[],
  currentTime: Date = new Date(),
  personality: LumaPersonality = "friendly",
): LumaChatResponse {
  const intent = detectIntent(message);
  let response: LumaChatResponse;

  switch (intent) {
    case "schedule_today": response = handleScheduleToday(tasks, currentTime); break;
    case "most_important": response = handleMostImportant(tasks, currentTime); break;
    case "summarize": response = handleSummarize(tasks, currentTime); break;
    case "free_time": response = handleFreeTime(message, tasks, currentTime); break;
    case "break_suggestion": response = handleBreakSuggestion(tasks, currentTime); break;
    case "block_tasks": response = handleBlockTasks(tasks, currentTime); break;
    case "deadline_check": response = handleDeadlineCheck(tasks, currentTime); break;
    case "productivity_tips": response = handleProductivityTips(tasks, currentTime); break;
    case "energy_advice": response = handleEnergyAdvice(currentTime); break;
    case "greeting": response = handleGreeting(tasks, currentTime); break;
    case "thanks": response = handleThanks(); break;
    case "help": response = handleHelp(); break;
    default: response = handleUnknown(); break;
  }

  response.text = wrap(response.text, personality);
  return response;
}

// ── Intent handlers ──────────────────────────────────────

function handleScheduleToday(tasks: Task[], now: Date): LumaChatResponse {
  const pending = getPendingTasks(tasks);
  const scored = pending.map((t) => ({ task: t, score: calculatePriorityScore(t, now) })).sort((a, b) => b.score - a.score);

  if (scored.length === 0) {
    return { text: "วันนี้ไม่มีงานค้าง เยี่ยมเลย! 🎉 พักผ่อนหรือทำโปรเจกต์ส่วนตัวได้เลย", intent: "schedule_today" };
  }

  const totalMin = scored.reduce((a, s) => a + s.task.estimatedDuration, 0);
  const hours = Math.floor(totalMin / 60);
  const mins = totalMin % 60;

  const lines = scored.slice(0, 6).map((s, i) => {
    const emoji = s.task.priority === "high" ? "🔴" : s.task.priority === "medium" ? "🟡" : "🟢";
    return `${i + 1}. ${emoji} ${s.task.title} (${s.task.estimatedDuration} min)`;
  });

  return {
    text: `📋 แนะนำลำดับงานวันนี้ (${scored.length} งาน, ~${hours}ชม. ${mins}นาที):\n\n${lines.join("\n")}\n\n💡 เริ่มจากงานสำคัญสูงก่อน แล้วสลับกับงานเบาๆ เพื่อรักษาพลังงาน`,
    intent: "schedule_today",
    quickActions: ["งานไหนสำคัญที่สุด", "แนะนำเวลาพัก", "ดู deadline"],
  };
}

function handleMostImportant(tasks: Task[], now: Date): LumaChatResponse {
  const pending = getPendingTasks(tasks);
  if (pending.length === 0) {
    return { text: "ไม่มีงานค้างเลย ว่างแล้ว! 🎉", intent: "most_important" };
  }

  const scored = pending.map((t) => ({ task: t, score: calculatePriorityScore(t, now) })).sort((a, b) => b.score - a.score);
  const top = scored[0];
  const reason = explainPriority(top.task, now);
  const runner = scored[1];

  let text = `🎯 งานสำคัญที่สุดตอนนี้:\n\n"${top.task.title}"\n📊 Priority Score: ${(top.score * 100).toFixed(0)}%\n⏱️ ใช้เวลาประมาณ ${top.task.estimatedDuration} นาที\n💡 ${reason}`;

  if (runner) {
    text += `\n\n📌 ถัดไป: "${runner.task.title}" (${(runner.score * 100).toFixed(0)}%)`;
  }

  return {
    text,
    intent: "most_important",
    quickActions: ["เริ่ม Focus Mode", "จัดตารางวันนี้", "ดู deadline"],
  };
}

function handleSummarize(tasks: Task[], now: Date): LumaChatResponse {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "completed").length;
  const pending = total - completed;
  const high = getHighPriority(tasks).length;
  const overdue = getOverdueTasks(tasks).length;
  const upcoming = getUpcomingDeadlines(tasks, 3).length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  const totalMin = getPendingTasks(tasks).reduce((a, t) => a + t.estimatedDuration, 0);
  const estHours = Math.floor(totalMin / 60);
  const estMins = totalMin % 60;

  let mood = "📊";
  if (pct >= 80) mood = "🎉 เยี่ยมมาก!";
  else if (pct >= 50) mood = "👍 ดีเลย!";
  else if (overdue > 0) mood = "⚠️ มีงานเลยกำหนด!";

  return {
    text: `${mood}\n\n📋 สรุปวันนี้:\n• งานทั้งหมด: ${total}\n• เสร็จแล้ว: ${completed} (${pct}%)\n• รอดำเนินการ: ${pending}\n• งานสำคัญสูง: ${high}\n${overdue > 0 ? `• ⚠️ เลยกำหนด: ${overdue}\n` : ""}${upcoming > 0 ? `• ⏰ deadline ใน 3 วัน: ${upcoming}\n` : ""}\n⏱️ เวลาที่ต้องใช้: ~${estHours}ชม. ${estMins}นาที`,
    intent: "summarize",
    quickActions: ["จัดตารางวันนี้", "ดู deadline", "แนะนำเวลาพัก"],
  };
}

function handleFreeTime(message: string, tasks: Task[], now: Date): LumaChatResponse {
  const minutes = extractMinutes(message) || 60;
  const pending = getPendingTasks(tasks);
  const scored = pending
    .map((t) => ({ task: t, score: calculatePriorityScore(t, now) }))
    .sort((a, b) => b.score - a.score);

  // Find tasks that fit within the time
  const fits: typeof scored = [];
  let remaining = minutes;
  for (const s of scored) {
    if (s.task.estimatedDuration <= remaining) {
      fits.push(s);
      remaining -= s.task.estimatedDuration;
    }
  }

  if (fits.length === 0) {
    return {
      text: `${minutes} นาทีอาจไม่พอสำหรับงานที่เหลือ ลองใช้เวลานี้:\n• 🧘 พักผ่อน 10 นาที\n• 📧 ตอบอีเมลสั้นๆ\n• 📝 วางแผนงานพรุ่งนี้`,
      intent: "free_time",
      quickActions: ["จัดตารางวันนี้", "แนะนำเวลาพัก"],
    };
  }

  const lines = fits.map((s, i) => `${i + 1}. ${s.task.title} (${s.task.estimatedDuration} min)`);
  const usedMin = minutes - remaining;

  return {
    text: `⏰ มี ${minutes} นาที แนะนำงานเหล่านี้:\n\n${lines.join("\n")}\n\n📊 ใช้เวลา ${usedMin} นาที เหลือ ${remaining} นาทีพัก`,
    intent: "free_time",
    quickActions: ["เริ่ม Focus Mode", "งานไหนสำคัญที่สุด"],
  };
}

function handleBreakSuggestion(tasks: Task[], now: Date): LumaChatResponse {
  const hour = now.getHours();
  const pending = getPendingTasks(tasks);
  const totalMin = pending.reduce((a, t) => a + t.estimatedDuration, 0);

  let suggestion: string;
  if (hour < 10) {
    suggestion = "ยังเช้าอยู่ ลองทำงานสำคัญก่อนสัก 1-2 ชั่วโมง แล้วค่อยพัก 10 นาที";
  } else if (hour < 12) {
    suggestion = "ใกล้เที่ยงแล้ว พักทานข้าวสัก 30-45 นาที แล้วกลับมาทำงานเบาๆ ก่อน";
  } else if (hour < 15) {
    suggestion = "ช่วงบ่ายพลังงานมักจะลด ลองพัก 15 นาที เดินเล่น หรือยืดเส้นยืดสาย";
  } else if (hour < 18) {
    suggestion = "ใกล้เลิกงานแล้ว ถ้าเหนื่อยมากลองพัก 10 นาที แล้วทำงานเบาๆ ปิดท้าย";
  } else {
    suggestion = "เลิกงานได้แล้ว! พักผ่อนเต็มที่ ออกกำลังกาย หรือทำกิจกรรมที่ชอบ";
  }

  const breakSchedule = [
    "☕ 10:00 — พักสั้น 10 นาที",
    "🍽️ 12:00 — พักเที่ยง 45 นาที",
    "🚶 14:30 — เดินเล่น 15 นาที",
    "☕ 16:00 — พักสั้น 10 นาที",
  ];

  return {
    text: `🧘 ${suggestion}\n\n📅 ตารางพักแนะนำ:\n${breakSchedule.join("\n")}\n\n${totalMin > 300 ? "⚠️ วันนี้งานเยอะ อย่าลืมพักบ่อยๆ นะ" : "✨ วันนี้งานไม่เยอะมาก พักได้สบายๆ"}`,
    intent: "break_suggestion",
    quickActions: ["จัดตารางวันนี้", "สรุปวันนี้"],
  };
}

function handleBlockTasks(tasks: Task[], now: Date): LumaChatResponse {
  const pending = getPendingTasks(tasks);

  // Group by category
  const groups: Record<string, Task[]> = {};
  for (const t of pending) {
    if (!groups[t.category]) groups[t.category] = [];
    groups[t.category].push(t);
  }

  const categoryEmoji: Record<string, string> = {
    work: "💼", development: "💻", design: "🎨", personal: "🏠", meeting: "👥", other: "📌",
  };

  const blocks = Object.entries(groups)
    .filter(([, tasks]) => tasks.length > 1)
    .map(([cat, tasks]) => {
      const totalMin = tasks.reduce((a, t) => a + t.estimatedDuration, 0);
      return `${categoryEmoji[cat] || "📌"} ${cat} (${tasks.length} งาน, ${totalMin} min)\n   ${tasks.map((t) => `• ${t.title}`).join("\n   ")}`;
    });

  if (blocks.length === 0) {
    return {
      text: "งานแต่ละอันอยู่คนละหมวด ไม่จำเป็นต้องรวม block ทำทีละอันได้เลย!",
      intent: "block_tasks",
      quickActions: ["จัดตารางวันนี้", "งานไหนสำคัญที่สุด"],
    };
  }

  return {
    text: `📦 แนะนำรวมงานเป็น block:\n\n${blocks.join("\n\n")}\n\n💡 ทำงานประเภทเดียวกันรวดเดียวจะมีประสิทธิภาพมากกว่า (context switching น้อยลง)`,
    intent: "block_tasks",
    quickActions: ["จัดตารางวันนี้", "แนะนำเวลาพัก"],
  };
}

function handleDeadlineCheck(tasks: Task[], now: Date): LumaChatResponse {
  const overdue = getOverdueTasks(tasks);
  const upcoming3 = getUpcomingDeadlines(tasks, 3);
  const upcoming7 = getUpcomingDeadlines(tasks, 7);

  const lines: string[] = [];

  if (overdue.length > 0) {
    lines.push("🚨 เลยกำหนดแล้ว:");
    overdue.forEach((t) => {
      const d = new Date(t.deadline!);
      lines.push(`   • ${t.title} (${d.getDate()}/${d.getMonth() + 1})`);
    });
  }

  if (upcoming3.length > 0) {
    lines.push("\n⏰ ภายใน 3 วัน:");
    upcoming3.forEach((t) => {
      const d = new Date(t.deadline!);
      lines.push(`   • ${t.title} (${d.getDate()}/${d.getMonth() + 1})`);
    });
  }

  if (upcoming7.length > 0) {
    const only7 = upcoming7.filter((t) => !upcoming3.includes(t));
    if (only7.length > 0) {
      lines.push("\n📅 ภายใน 7 วัน:");
      only7.forEach((t) => {
        const d = new Date(t.deadline!);
        lines.push(`   • ${t.title} (${d.getDate()}/${d.getMonth() + 1})`);
      });
    }
  }

  if (lines.length === 0) {
    return {
      text: "✅ ไม่มี deadline ใกล้เข้ามา สบายใจได้!",
      intent: "deadline_check",
      quickActions: ["จัดตารางวันนี้", "สรุปวันนี้"],
    };
  }

  return {
    text: `📅 สถานะ Deadline:\n\n${lines.join("\n")}`,
    intent: "deadline_check",
    quickActions: ["จัดตารางวันนี้", "งานไหนสำคัญที่สุด"],
  };
}

function handleProductivityTips(tasks: Task[], now: Date): LumaChatResponse {
  const hour = now.getHours();
  const pending = getPendingTasks(tasks);
  const high = getHighPriority(tasks);

  const tips = [
    "🍅 ใช้ Pomodoro Technique: ทำงาน 25 นาที พัก 5 นาที ทำ 4 รอบแล้วพักยาว",
    "🎯 ทำงานสำคัญที่สุดก่อน (Eat the Frog) อย่าเลื่อนงานยากออกไป",
    "📵 ปิด notification ตอนทำ deep work ใช้ Focus Mode ของ Lumina",
    "📦 รวมงานประเภทเดียวกันทำพร้อมกัน (Batching) ลด context switching",
    "⏰ ตั้ง deadline ให้ตัวเอง แม้งานไม่มี deadline จริง",
    "🧘 พักทุก 90 นาที สมองต้องการเวลาฟื้นตัว",
    "📝 เขียนงาน 3 อย่างที่ต้องทำให้เสร็จวันนี้ตอนเช้า",
    "🌅 ทำงานสร้างสรรค์ตอนเช้า งาน routine ตอนบ่าย",
  ];

  // Pick 3 relevant tips
  const selected = tips.sort(() => Math.random() - 0.5).slice(0, 3);

  let contextTip = "";
  if (high.length >= 3) contextTip = "\n\n⚡ คุณมีงานสำคัญสูง " + high.length + " งาน ลองใช้ Focus Mode ทำทีละงาน";
  else if (pending.length === 0) contextTip = "\n\n🎉 ไม่มีงานค้าง! ลองวางแผนงานพรุ่งนี้ล่วงหน้า";

  return {
    text: `💡 เคล็ดลับเพิ่มประสิทธิภาพ:\n\n${selected.join("\n\n")}${contextTip}`,
    intent: "productivity_tips",
    quickActions: ["จัดตารางวันนี้", "เริ่ม Focus Mode", "แนะนำเวลาพัก"],
  };
}

function handleEnergyAdvice(now: Date): LumaChatResponse {
  const hour = now.getHours();

  const schedule = [
    { range: "06:00–09:00", label: "🌅 ตื่นนอน + เตรียมตัว", energy: "กำลังเพิ่มขึ้น", tip: "ดื่มน้ำ ออกกำลังกายเบาๆ" },
    { range: "09:00–11:00", label: "⚡ Peak Performance", energy: "สูงสุด", tip: "ทำงาน deep work, งานสร้างสรรค์" },
    { range: "11:00–12:00", label: "📊 ยังดีอยู่", energy: "สูง", tip: "ประชุม, งานที่ต้องคิด" },
    { range: "12:00–14:00", label: "🍽️ พักเที่ยง", energy: "ลดลง", tip: "พัก ทานข้าว เดินเล่น" },
    { range: "14:00–16:00", label: "😴 Post-lunch dip", energy: "ต่ำ", tip: "งาน routine, ตอบอีเมล, จัดระเบียบ" },
    { range: "16:00–18:00", label: "📈 Second wind", energy: "กลับมา", tip: "งานที่ต้องร่วมมือ, review" },
    { range: "18:00+", label: "🌙 เลิกงาน", energy: "ลดลง", tip: "พักผ่อน, ออกกำลังกาย, งานอดิเรก" },
  ];

  const current = schedule.find((s) => {
    const [start] = s.range.split("–").map((t) => parseInt(t));
    const nextIdx = schedule.indexOf(s) + 1;
    const end = nextIdx < schedule.length ? parseInt(schedule[nextIdx].range) : 24;
    return hour >= start && hour < end;
  }) || schedule[schedule.length - 1];

  const lines = schedule.map((s) => `${s.range.padEnd(14)} ${s.label}\n${"".padEnd(15)}💡 ${s.tip}`);

  return {
    text: `⚡ ตอนนี้ (${String(hour).padStart(2, "0")}:00): ${current.label}\nพลังงาน: ${current.energy}\n💡 ${current.tip}\n\n📅 ตารางพลังงานทั้งวัน:\n${lines.join("\n")}`,
    intent: "energy_advice",
    quickActions: ["จัดตารางวันนี้", "แนะนำเวลาพัก", "เคล็ดลับ"],
  };
}

function handleGreeting(tasks: Task[], now: Date): LumaChatResponse {
  const hour = now.getHours();
  const greeting = getHourGreeting(hour);
  const pending = getPendingTasks(tasks);
  const high = getHighPriority(tasks);

  let status = "";
  if (pending.length === 0) status = "วันนี้ไม่มีงานค้าง สบายๆ ได้เลย!";
  else if (high.length > 0) status = `วันนี้มี ${pending.length} งาน (${high.length} งานสำคัญสูง) พร้อมช่วยจัดการ!`;
  else status = `วันนี้มี ${pending.length} งาน ไม่เยอะมาก ทำได้แน่นอน!`;

  return {
    text: `${greeting}\n\n${status}\n\nถามอะไรได้เลยนะ ฉันพร้อมช่วย!`,
    intent: "greeting",
    quickActions: ["จัดตารางวันนี้", "งานไหนสำคัญที่สุด", "สรุปวันนี้"],
  };
}

function handleThanks(): LumaChatResponse {
  const responses = [
    "ยินดีเสมอ! มีอะไรให้ช่วยอีกบอกได้นะ 😊",
    "ไม่เป็นไร! ฉันอยู่ตรงนี้เสมอ ✨",
    "ด้วยความยินดี! สู้ต่อไปนะ 💪",
    "เป็นเกียรติเลย! ถ้าต้องการอะไรอีกบอกได้เลย 🌟",
  ];
  return {
    text: responses[Math.floor(Math.random() * responses.length)],
    intent: "thanks",
  };
}

function handleHelp(): LumaChatResponse {
  return {
    text: `🤖 ฉันคือ Luma ผู้ช่วย AI ของคุณ! ถามได้เลย:\n\n📋 "จัดตารางวันนี้" — จัดลำดับงานให้\n🎯 "งานไหนสำคัญที่สุด" — แนะนำงานที่ควรทำก่อน\n📊 "สรุปวันนี้" — ดูภาพรวมงาน\n⏰ "มีเวลา 2 ชั่วโมง" — แนะนำงานที่เหมาะ\n🧘 "เหนื่อย" — แนะนำเวลาพัก\n📦 "รวมงาน" — จัดกลุ่มงานเป็น block\n📅 "ดู deadline" — เช็ค deadline ใกล้ๆ\n💡 "เคล็ดลับ" — tips เพิ่มประสิทธิภาพ\n⚡ "ช่วงไหนดี" — ตารางพลังงานทั้งวัน`,
    intent: "help",
    quickActions: ["จัดตารางวันนี้", "สรุปวันนี้", "เคล็ดลับ"],
  };
}

function handleUnknown(): LumaChatResponse {
  return {
    text: "ฉันยังไม่เข้าใจ ลองถามใหม่นะ 😊\nพิมพ์ \"ช่วย\" เพื่อดูสิ่งที่ฉันทำได้!",
    intent: "unknown",
    quickActions: ["ช่วย", "จัดตารางวันนี้", "สรุปวันนี้"],
  };
}
