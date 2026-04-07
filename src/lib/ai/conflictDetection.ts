/**
 * Conflict Detection — Algorithm 4
 *
 * Detects time overlaps between events. Symmetric: if A conflicts with B,
 * then B conflicts with A.
 */

export interface TimeEvent {
  id: string;
  title: string;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
}

export interface Conflict {
  eventA: string;
  eventB: string;
  overlapMinutes: number;
}

export type ConflictResolutionOption = "notify" | "suggest_new_time" | "auto_reschedule";

export interface ConflictResult {
  conflicts: Conflict[];
  options: ConflictResolutionOption[];
}

/**
 * Detect all pairwise time overlaps in a list of events.
 * Two events conflict if their time ranges overlap (touching edges are NOT conflicts).
 */
export function detectConflicts(events: TimeEvent[]): ConflictResult {
  const conflicts: Conflict[] = [];

  for (let i = 0; i < events.length; i++) {
    for (let j = i + 1; j < events.length; j++) {
      const a = events[i];
      const b = events[j];

      const aStart = a.startHour * 60 + a.startMinute;
      const aEnd = a.endHour * 60 + a.endMinute;
      const bStart = b.startHour * 60 + b.startMinute;
      const bEnd = b.endHour * 60 + b.endMinute;

      const overlapStart = Math.max(aStart, bStart);
      const overlapEnd = Math.min(aEnd, bEnd);
      const overlap = overlapEnd - overlapStart;

      if (overlap > 0) {
        conflicts.push({
          eventA: a.id,
          eventB: b.id,
          overlapMinutes: overlap,
        });
      }
    }
  }

  const options: ConflictResolutionOption[] =
    conflicts.length > 0
      ? ["notify", "suggest_new_time", "auto_reschedule"]
      : [];

  return { conflicts, options };
}

/**
 * Check if a specific event conflicts with any other event.
 */
export function hasConflict(eventId: string, events: TimeEvent[]): boolean {
  const { conflicts } = detectConflicts(events);
  return conflicts.some((c) => c.eventA === eventId || c.eventB === eventId);
}
