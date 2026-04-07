import type { Task } from "@/stores/taskStore";
import { calculatePriorityScore, getTimeOfDayEnergy } from "./priorityScore";

// ── Types ────────────────────────────────────────────────

export interface WorkingHours {
  start: number; // e.g. 9  (09:00)
  end: number;   // e.g. 18 (18:00)
}

export interface ScheduledSlot {
  taskId: string;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
}

export interface OptimizeResult {
  scheduled: ScheduledSlot[];
  overflow: { taskId: string; reason: string }[];
}

export interface ScheduleSnapshot {
  id: string;
  timestamp: string;
  slots: ScheduledSlot[];
}

// ── Optimizer ────────────────────────────────────────────

/**
 * Assign each non-completed task to a time slot within working hours,
 * ordered by priority score and energy matching.
 *
 * Rules:
 *  - High-energy tasks → morning slots
 *  - Low-energy tasks → afternoon slots
 *  - No overlapping slots
 *  - Tasks that don't fit → overflow list
 *  - scheduledEnd - scheduledStart >= estimatedDuration
 */
export function optimizeSchedule(
  tasks: Task[],
  workingHours: WorkingHours = { start: 9, end: 18 },
  currentTime: Date = new Date(),
): OptimizeResult {
  // Filter to only pending / in-progress tasks
  const eligible = tasks.filter((t) => t.status !== "completed");

  // Score and sort by priority (descending)
  const scored = eligible
    .map((t) => ({ task: t, score: calculatePriorityScore(t, currentTime) }))
    .sort((a, b) => b.score - a.score);

  // Separate by energy preference for slot assignment
  const highEnergy = scored.filter((s) => s.task.energyLevel === "high");
  const mediumEnergy = scored.filter((s) => s.task.energyLevel === "medium");
  const lowEnergy = scored.filter((s) => s.task.energyLevel === "low");

  // Build ordered list: high-energy first (morning), then medium, then low (afternoon)
  const ordered = [...highEnergy, ...mediumEnergy, ...lowEnergy];

  const scheduled: ScheduledSlot[] = [];
  const overflow: { taskId: string; reason: string }[] = [];

  // Track occupied minutes within working hours
  let cursorMinutes = workingHours.start * 60; // start of day in minutes
  const endMinutes = workingHours.end * 60;

  for (const { task } of ordered) {
    const duration = task.estimatedDuration;

    if (cursorMinutes + duration > endMinutes) {
      overflow.push({
        taskId: task.id,
        reason: `Not enough time in working hours (need ${duration} min, ${endMinutes - cursorMinutes} min left)`,
      });
      continue;
    }

    const startH = Math.floor(cursorMinutes / 60);
    const startM = cursorMinutes % 60;
    const endTotal = cursorMinutes + duration;
    const endH = Math.floor(endTotal / 60);
    const endM = endTotal % 60;

    scheduled.push({
      taskId: task.id,
      startHour: startH,
      startMinute: startM,
      endHour: endH,
      endMinute: endM,
    });

    cursorMinutes = endTotal;
  }

  return { scheduled, overflow };
}

// ── Snapshot helpers (in-memory) ─────────────────────────

let snapshots: ScheduleSnapshot[] = [];

export function createSnapshot(slots: ScheduledSlot[]): ScheduleSnapshot {
  const snap: ScheduleSnapshot = {
    id: `snap_${Date.now()}`,
    timestamp: new Date().toISOString(),
    slots: slots.map((s) => ({ ...s })),
  };
  snapshots.push(snap);
  return snap;
}

export function undoScheduleChange(): ScheduleSnapshot | null {
  if (snapshots.length === 0) return null;
  return snapshots.pop()!;
}

export function getSnapshots(): ScheduleSnapshot[] {
  return [...snapshots];
}

export function clearSnapshots(): void {
  snapshots = [];
}
