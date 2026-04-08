import { type Task } from "@/stores/taskStore";
import { type CalendarEvent } from "@/components/calendar/mockData";

function downloadFile(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ── CSV Export ──────────────────────────────────────────

export function exportTasksCSV(tasks: Task[]) {
  const header = "ID,Title,Category,Priority,Status,Deadline,Duration (min),Energy,Recurrence,Tags,Created";
  const rows = tasks.map((t) =>
    [
      t.id,
      `"${t.title.replace(/"/g, '""')}"`,
      t.category,
      t.priority,
      t.status,
      t.deadline ? new Date(t.deadline).toLocaleDateString() : "",
      t.estimatedDuration,
      t.energyLevel,
      t.recurrence || "none",
      `"${t.tags.join(", ")}"`,
      new Date(t.createdAt).toLocaleDateString(),
    ].join(",")
  );
  const csv = [header, ...rows].join("\n");
  downloadFile(csv, `lumina-tasks-${Date.now()}.csv`, "text/csv;charset=utf-8;");
}

export function exportEventsCSV(events: CalendarEvent[]) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const header = "ID,Title,Day,Start,End,Category,Recurrence";
  const fmt = (h: number, m: number) => `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  const rows = events.map((e) =>
    [
      e.id,
      `"${e.title.replace(/"/g, '""')}"`,
      days[e.dayOfWeek] || e.dayOfWeek,
      fmt(e.startHour, e.startMinute),
      fmt(e.endHour, e.endMinute),
      e.category,
      e.recurrence || "none",
    ].join(",")
  );
  const csv = [header, ...rows].join("\n");
  downloadFile(csv, `lumina-events-${Date.now()}.csv`, "text/csv;charset=utf-8;");
}

// ── ICS Export ──────────────────────────────────────────

function pad2(n: number) { return String(n).padStart(2, "0"); }

function toICSDate(date: Date): string {
  return `${date.getFullYear()}${pad2(date.getMonth() + 1)}${pad2(date.getDate())}T${pad2(date.getHours())}${pad2(date.getMinutes())}00`;
}

export function exportEventsICS(events: CalendarEvent[], mondayDate: Date) {
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Lumina//AI Calendar//EN",
    "CALSCALE:GREGORIAN",
  ];

  for (const ev of events) {
    const eventDate = new Date(mondayDate);
    eventDate.setDate(eventDate.getDate() + ev.dayOfWeek);

    const start = new Date(eventDate);
    start.setHours(ev.startHour, ev.startMinute, 0);
    const end = new Date(eventDate);
    end.setHours(ev.endHour, ev.endMinute, 0);

    lines.push("BEGIN:VEVENT");
    lines.push(`UID:${ev.id}@lumina.app`);
    lines.push(`DTSTART:${toICSDate(start)}`);
    lines.push(`DTEND:${toICSDate(end)}`);
    lines.push(`SUMMARY:${ev.title}`);
    lines.push(`CATEGORIES:${ev.category}`);

    if (ev.recurrence && ev.recurrence !== "none") {
      const rruleMap: Record<string, string> = {
        daily: "FREQ=DAILY",
        weekdays: "FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR",
        weekly: "FREQ=WEEKLY",
        biweekly: "FREQ=WEEKLY;INTERVAL=2",
        monthly: "FREQ=MONTHLY",
      };
      if (rruleMap[ev.recurrence]) {
        lines.push(`RRULE:${rruleMap[ev.recurrence]}`);
      }
    }

    lines.push("END:VEVENT");
  }

  lines.push("END:VCALENDAR");
  downloadFile(lines.join("\r\n"), `lumina-calendar-${Date.now()}.ics`, "text/calendar;charset=utf-8;");
}

export function exportTasksICS(tasks: Task[]) {
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Lumina//AI Calendar//EN",
  ];

  for (const t of tasks) {
    lines.push("BEGIN:VTODO");
    lines.push(`UID:${t.id}@lumina.app`);
    lines.push(`SUMMARY:${t.title}`);
    if (t.description) lines.push(`DESCRIPTION:${t.description.replace(/\n/g, "\\n")}`);
    lines.push(`PRIORITY:${t.priority === "high" ? 1 : t.priority === "medium" ? 5 : 9}`);
    lines.push(`STATUS:${t.status === "completed" ? "COMPLETED" : "NEEDS-ACTION"}`);
    if (t.deadline) lines.push(`DUE:${toICSDate(new Date(t.deadline))}`);
    lines.push(`CATEGORIES:${t.category}`);
    lines.push("END:VTODO");
  }

  lines.push("END:VCALENDAR");
  downloadFile(lines.join("\r\n"), `lumina-tasks-${Date.now()}.ics`, "text/calendar;charset=utf-8;");
}
