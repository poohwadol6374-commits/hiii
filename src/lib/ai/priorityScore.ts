import type { Task } from "@/stores/taskStore";

/**
 * Calculate a deterministic priority score (0.0–1.0) for a task.
 *
 * Weighted factors:
 *   - Urgency from deadline  30%
 *   - Importance from priority  25%
 *   - Energy match to time-of-day  15%
 *   - Duration efficiency (quick-win bonus)  10%
 *   - Base constant  20%
 *
 * Same inputs always produce the same output.
 */
export function calculatePriorityScore(
  task: Task,
  currentTime: Date = new Date(),
): number {
  const urgency = calcUrgency(task, currentTime);
  const importance = calcImportance(task);
  const energy = calcEnergyMatch(task, currentTime);
  const duration = calcDurationEfficiency(task);
  const base = 0.5; // neutral baseline

  const raw =
    urgency * 0.3 +
    importance * 0.25 +
    energy * 0.15 +
    duration * 0.1 +
    base * 0.2;

  return clamp(raw, 0, 1);
}

// ── helpers ──────────────────────────────────────────────

function calcUrgency(task: Task, now: Date): number {
  if (!task.deadline) return 0.3; // no deadline → moderate-low urgency

  const deadlineMs = new Date(task.deadline).getTime();
  const nowMs = now.getTime();
  const hoursLeft = (deadlineMs - nowMs) / (1000 * 60 * 60);

  if (hoursLeft <= 0) return 1.0;   // overdue
  if (hoursLeft <= 6) return 0.95;
  if (hoursLeft <= 24) return 0.85;
  if (hoursLeft <= 48) return 0.7;
  if (hoursLeft <= 72) return 0.55;
  if (hoursLeft <= 168) return 0.35; // within a week
  return 0.15;
}

function calcImportance(task: Task): number {
  const map: Record<string, number> = { high: 1.0, medium: 0.6, low: 0.3 };
  return map[task.priority] ?? 0.5;
}

function calcEnergyMatch(task: Task, now: Date): number {
  const hour = now.getHours();
  const timeEnergy = getTimeOfDayEnergy(hour);
  if (task.energyLevel === timeEnergy) return 1.0;
  // one step away
  const levels = ["low", "medium", "high"];
  const diff = Math.abs(levels.indexOf(task.energyLevel) - levels.indexOf(timeEnergy));
  return diff === 1 ? 0.6 : 0.3;
}

export function getTimeOfDayEnergy(hour: number): "high" | "medium" | "low" {
  if (hour >= 6 && hour < 12) return "high";
  if (hour >= 12 && hour < 17) return "medium";
  return "low";
}

function calcDurationEfficiency(task: Task): number {
  const mins = task.estimatedDuration;
  if (mins <= 30) return 1.0;   // quick win
  if (mins <= 60) return 0.8;
  if (mins <= 120) return 0.5;
  return 0.3;
}

function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}
