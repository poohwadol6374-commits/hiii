import type { Task } from "@/stores/taskStore";

/**
 * Return a short human-readable explanation for why a task is ranked where it is.
 * Deterministic — same task + time → same explanation.
 */
export function explainPriority(task: Task, currentTime: Date = new Date()): string {
  const parts: string[] = [];

  // Deadline factor
  if (task.deadline) {
    const hoursLeft =
      (new Date(task.deadline).getTime() - currentTime.getTime()) / (1000 * 60 * 60);
    if (hoursLeft <= 0) parts.push("Overdue!");
    else if (hoursLeft <= 24) parts.push("Deadline today");
    else if (hoursLeft <= 48) parts.push("Deadline tomorrow");
    else if (hoursLeft <= 72) parts.push("Deadline in 3 days");
    else if (hoursLeft <= 168) parts.push("Deadline this week");
  }

  // Priority factor
  const priorityLabel: Record<string, string> = {
    high: "High priority",
    medium: "Medium priority",
    low: "Low priority",
  };
  parts.push(priorityLabel[task.priority] ?? "");

  // Quick-win factor
  if (task.estimatedDuration <= 30) {
    parts.push(`Quick win (${task.estimatedDuration} min)`);
  }

  // Energy match
  const hour = currentTime.getHours();
  const timeEnergy = hour >= 6 && hour < 12 ? "high" : hour < 17 ? "medium" : "low";
  if (task.energyLevel === timeEnergy) {
    parts.push("Energy match ✓");
  }

  return parts.filter(Boolean).join(" + ") || "Standard priority";
}
