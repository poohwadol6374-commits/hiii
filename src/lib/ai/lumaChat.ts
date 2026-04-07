import type { Task } from "@/stores/taskStore";
import { calculatePriorityScore } from "./priorityScore";
import { explainPriority } from "./explainPriority";

// ── Types ────────────────────────────────────────────────

export type LumaIntent =
  | "schedule_today"
  | "most_important"
  | "summarize"
  | "unknown";

export interface LumaChatResponse {
  text: string;
  intent: LumaIntent;
  quickActions?: string[];
}

// ── Intent detection (simple pattern matching) ───────────

const PATTERNS: { intent: LumaIntent; patterns: RegExp[] }[] = [
  {
    intent: "schedule_today",
    patterns: [
      /จัดตาราง/i,
      /schedule\s*today/i,
      /optimize/i,
      /จัดการวันนี้/i,
    ],
  },
  {
    intent: "most_important",
    patterns: [
      /สำคัญที่สุด/i,
      /most\s*important/i,
      /ควรทำอะไรก่อน/i,
      /priority/i,
      /งานไหน/i,
    ],
  },
  {
    intent: "summarize",
    patterns: [
      /สรุป/i,
      /summarize/i,
      /summary/i,
      /ภาพรวม/i,
      /overview/i,
    ],
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

// ── Response generation ──────────────────────────────────

export function generateResponse(
  message: string,
  tasks: Task[],
  currentTime: Date = new Date(),
): LumaChatResponse {
  const intent = detectIntent(message);

  switch (intent) {
    case "schedule_today":
      return handleScheduleToday(tasks, currentTime);
    case "most_important":
      return handleMostImportant(tasks, currentTime);
    case "summarize":
      return handleSummarize(tasks, currentTime);
    default:
      return {
        text: "ฉันยังไม่เข้าใจ ลองถามใหม่นะ 😊",
        intent: "unknown",
        quickActions: ["จัดตารางวันนี้", "งานไหนสำคัญที่สุด", "สรุปวันนี้"],
      };
  }
}

function handleScheduleToday(tasks: Task[], now: Date): LumaChatResponse {
  const pending = tasks.filter((t) => t.status !== "completed");
  const scored = pending
    .map((t) => ({ task: t, score: calculatePriorityScore(t, now) }))
    .sort((a, b) => b.score - a.score);

  if (scored.length === 0) {
    return {
      text: "วันนี้ไม่มีงานค้าง เยี่ยมเลย! 🎉",
      intent: "schedule_today",
    };
  }

  const lines = scored.slice(0, 5).map(
    (s, i) =>
      `${i + 1}. ${s.task.title} (${s.task.estimatedDuration} min) — score ${(s.score * 100).toFixed(0)}%`,
  );

  return {
    text: `แนะนำลำดับงานวันนี้:\n${lines.join("\n")}\n\nพร้อมจัดลงตารางเลยไหม?`,
    intent: "schedule_today",
    quickActions: ["ยืนยัน", "ปรับแก้"],
  };
}

function handleMostImportant(tasks: Task[], now: Date): LumaChatResponse {
  const pending = tasks.filter((t) => t.status !== "completed");
  if (pending.length === 0) {
    return {
      text: "ไม่มีงานค้างเลย ว่างแล้ว! 🎉",
      intent: "most_important",
    };
  }

  const top = pending
    .map((t) => ({ task: t, score: calculatePriorityScore(t, now) }))
    .sort((a, b) => b.score - a.score)[0];

  const reason = explainPriority(top.task, now);

  return {
    text: `งานสำคัญที่สุดตอนนี้คือ "${top.task.title}"\n📊 Score: ${(top.score * 100).toFixed(0)}%\n💡 ${reason}`,
    intent: "most_important",
  };
}

function handleSummarize(tasks: Task[], now: Date): LumaChatResponse {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "completed").length;
  const pending = total - completed;
  const highPriority = tasks.filter(
    (t) => t.priority === "high" && t.status !== "completed",
  ).length;

  return {
    text: `📋 สรุปวันนี้:\n• งานทั้งหมด: ${total}\n• เสร็จแล้ว: ${completed}\n• รอดำเนินการ: ${pending}\n• งานสำคัญสูง: ${highPriority}\n\nสู้ต่อไปนะ! 💪`,
    intent: "summarize",
  };
}
