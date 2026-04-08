// Mock calendar events for demo purposes
// Events are generated relative to the current week

export type EventCategory = "meeting" | "focus" | "break" | "personal";
export type RecurrenceType = "none" | "daily" | "weekdays" | "weekly" | "biweekly" | "monthly";

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  dayOfWeek: number; // 0=Mon, 1=Tue, 2=Wed, 3=Thu, 4=Fri, 5=Sat, 6=Sun
  category: EventCategory;
  recurrence?: RecurrenceType;
  recurrenceId?: string;
}

export const categoryStyles: Record<
  EventCategory,
  { bg: string; border: string; text: string; dot: string }
> = {
  meeting: { bg: "bg-google-blue-50", border: "border-google-blue-200", text: "text-google-blue-700", dot: "bg-google-blue-500" },
  focus: { bg: "bg-google-green-50", border: "border-google-green-200", text: "text-google-green-700", dot: "bg-google-green-500" },
  break: { bg: "bg-google-yellow-50", border: "border-google-yellow-200", text: "text-google-yellow-700", dot: "bg-google-yellow-500" },
  personal: { bg: "bg-google-red-50", border: "border-google-red-200", text: "text-google-red-700", dot: "bg-google-red-500" },
};

export const categoryLabels: Record<EventCategory, string> = {
  meeting: "Meeting",
  focus: "Focus",
  break: "Break",
  personal: "Personal",
};

export const mockEvents: CalendarEvent[] = [
  // ── Monday ──
  { id: "e1", title: "Team Standup", description: "Daily sync: blockers, progress, plans for today", startHour: 9, startMinute: 0, endHour: 9, endMinute: 30, dayOfWeek: 0, category: "meeting", recurrence: "weekdays", recurrenceId: "rec-standup" },
  { id: "e2", title: "Deep Work: Q4 Report", description: "Compile quarterly financial data, create charts, write executive summary", startHour: 10, startMinute: 0, endHour: 12, endMinute: 0, dayOfWeek: 0, category: "focus" },
  { id: "e18", title: "Lunch Break", description: "Recharge and take a walk", startHour: 12, startMinute: 0, endHour: 13, endMinute: 0, dayOfWeek: 0, category: "break", recurrence: "weekdays", recurrenceId: "rec-lunch" },
  { id: "e3", title: "Design Review", description: "Review new UI mockups with design team, discuss color palette and component library updates", startHour: 14, startMinute: 0, endHour: 15, endMinute: 0, dayOfWeek: 0, category: "meeting", recurrence: "weekly", recurrenceId: "rec-design-review" },
  { id: "e19", title: "Email & Slack Catchup", description: "Reply to pending messages, review PRs comments", startHour: 15, startMinute: 30, endHour: 16, endMinute: 0, dayOfWeek: 0, category: "break" },

  // ── Tuesday ──
  { id: "e4", title: "Team Standup", description: "Daily sync: blockers, progress, plans for today", startHour: 9, startMinute: 0, endHour: 9, endMinute: 30, dayOfWeek: 1, category: "meeting", recurrence: "weekdays", recurrenceId: "rec-standup" },
  { id: "e20", title: "Focus: API Integration", description: "Implement REST API endpoints for user preferences and calendar sync", startHour: 9, startMinute: 30, endHour: 11, endMinute: 0, dayOfWeek: 1, category: "focus" },
  { id: "e5", title: "Client Presentation", description: "Present Q4 progress to stakeholders, demo new dashboard features", startHour: 11, startMinute: 0, endHour: 12, endMinute: 30, dayOfWeek: 1, category: "meeting" },
  { id: "e21", title: "Lunch Break", description: "Team lunch at the new Thai restaurant", startHour: 12, startMinute: 30, endHour: 13, endMinute: 30, dayOfWeek: 1, category: "break" },
  { id: "e6", title: "Focus: Code Review", description: "Review 5 pending PRs from frontend team, check test coverage", startHour: 14, startMinute: 0, endHour: 16, endMinute: 0, dayOfWeek: 1, category: "focus" },
  { id: "e22", title: "Yoga Class", description: "Online yoga session for stress relief", startHour: 17, startMinute: 0, endHour: 18, endMinute: 0, dayOfWeek: 1, category: "personal" },

  // ── Wednesday ──
  { id: "e7", title: "Team Standup", description: "Daily sync: blockers, progress, plans for today", startHour: 9, startMinute: 0, endHour: 9, endMinute: 30, dayOfWeek: 2, category: "meeting", recurrence: "weekdays", recurrenceId: "rec-standup" },
  { id: "e8", title: "1:1 with Manager", description: "Career growth discussion, feedback on Q4 performance, upcoming project assignments", startHour: 10, startMinute: 0, endHour: 11, endMinute: 0, dayOfWeek: 2, category: "break", recurrence: "weekly", recurrenceId: "rec-1on1" },
  { id: "e23", title: "Focus: Database Migration", description: "Plan and execute Prisma schema migration for new features", startHour: 11, startMinute: 0, endHour: 12, endMinute: 30, dayOfWeek: 2, category: "focus" },
  { id: "e9", title: "Lunch Break", description: "Quick lunch and coffee run", startHour: 13, startMinute: 0, endHour: 14, endMinute: 0, dayOfWeek: 2, category: "break", recurrence: "daily", recurrenceId: "rec-lunch" },
  { id: "e10", title: "Sprint Planning", description: "Plan next sprint: estimate stories, assign tasks, set sprint goal", startHour: 15, startMinute: 0, endHour: 17, endMinute: 0, dayOfWeek: 2, category: "meeting", recurrence: "biweekly", recurrenceId: "rec-sprint" },

  // ── Thursday ──
  { id: "e11", title: "Team Standup", description: "Daily sync: blockers, progress, plans for today", startHour: 9, startMinute: 0, endHour: 9, endMinute: 30, dayOfWeek: 3, category: "meeting", recurrence: "weekdays", recurrenceId: "rec-standup" },
  { id: "e12", title: "Deep Work: Feature Dev", description: "Build new calendar time-blocking feature with drag-and-drop", startHour: 10, startMinute: 0, endHour: 12, endMinute: 0, dayOfWeek: 3, category: "focus" },
  { id: "e24", title: "Lunch & Learn", description: "Team presentation: Introduction to AI-powered scheduling algorithms", startHour: 12, startMinute: 0, endHour: 13, endMinute: 0, dayOfWeek: 3, category: "meeting" },
  { id: "e13", title: "Team Retrospective", description: "Reflect on last sprint: what went well, what to improve, action items", startHour: 14, startMinute: 0, endHour: 15, endMinute: 30, dayOfWeek: 3, category: "meeting", recurrence: "biweekly", recurrenceId: "rec-retro" },
  { id: "e25", title: "Focus: Unit Tests", description: "Write tests for priority scoring algorithm and optimizer", startHour: 15, startMinute: 30, endHour: 17, endMinute: 0, dayOfWeek: 3, category: "focus" },

  // ── Friday ──
  { id: "e14", title: "Team Standup", description: "Daily sync: blockers, progress, plans for today", startHour: 9, startMinute: 0, endHour: 9, endMinute: 30, dayOfWeek: 4, category: "meeting", recurrence: "weekdays", recurrenceId: "rec-standup" },
  { id: "e15", title: "Focus: Bug Fixes", description: "Fix hydration errors, calendar drag-drop issues, dark mode inconsistencies", startHour: 10, startMinute: 0, endHour: 11, endMinute: 30, dayOfWeek: 4, category: "focus" },
  { id: "e26", title: "Lunch Break", description: "Friday team lunch celebration", startHour: 12, startMinute: 0, endHour: 13, endMinute: 0, dayOfWeek: 4, category: "break" },
  { id: "e16", title: "Weekly Review", description: "Review weekly accomplishments, update roadmap, plan next week priorities", startHour: 13, startMinute: 0, endHour: 14, endMinute: 0, dayOfWeek: 4, category: "meeting", recurrence: "weekly", recurrenceId: "rec-weekly-review" },
  { id: "e27", title: "Knowledge Sharing", description: "Present new React patterns and Next.js App Router tips to the team", startHour: 14, startMinute: 30, endHour: 15, endMinute: 30, dayOfWeek: 4, category: "meeting" },
  { id: "e17", title: "Personal: Gym", description: "Leg day workout + 20 min cardio", startHour: 16, startMinute: 0, endHour: 17, endMinute: 0, dayOfWeek: 4, category: "personal", recurrence: "weekly", recurrenceId: "rec-gym" },

  // ── Saturday ──
  { id: "e28", title: "Morning Run", description: "5km run at the park, stretching afterwards", startHour: 7, startMinute: 0, endHour: 8, endMinute: 0, dayOfWeek: 5, category: "personal" },
  { id: "e29", title: "Side Project: Lumina", description: "Work on Luma AI chat improvements and new features", startHour: 10, startMinute: 0, endHour: 12, endMinute: 0, dayOfWeek: 5, category: "focus" },
  { id: "e30", title: "Lunch with Friends", description: "Meet up at the new cafe downtown", startHour: 12, startMinute: 30, endHour: 14, endMinute: 0, dayOfWeek: 5, category: "personal" },
  { id: "e31", title: "Reading Time", description: "Read 'Atomic Habits' - Chapter 5-7", startHour: 15, startMinute: 0, endHour: 16, endMinute: 30, dayOfWeek: 5, category: "personal" },

  // ── Sunday ──
  { id: "e32", title: "Sleep In", description: "Rest and recovery day", startHour: 9, startMinute: 0, endHour: 10, endMinute: 0, dayOfWeek: 6, category: "break" },
  { id: "e33", title: "Meal Prep", description: "Prepare healthy meals for the upcoming week", startHour: 11, startMinute: 0, endHour: 12, endMinute: 30, dayOfWeek: 6, category: "personal" },
  { id: "e34", title: "Weekly Planning", description: "Review goals, plan next week tasks, organize calendar", startHour: 14, startMinute: 0, endHour: 15, endMinute: 0, dayOfWeek: 6, category: "focus" },
  { id: "e35", title: "Family Dinner", description: "Dinner with family at home", startHour: 18, startMinute: 0, endHour: 19, endMinute: 30, dayOfWeek: 6, category: "personal" },
];
