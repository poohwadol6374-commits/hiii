import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing preset data to avoid duplicates
  await prisma.taskCategory.deleteMany({ where: { isPreset: true } });
  await prisma.template.deleteMany({ where: { isPreset: true } });

  // Preset TaskCategories (Google palette soft/muted colors)
  const presetCategories = [
    { name: "work", icon: "💼", color: "#4285F4", isPreset: true },
    { name: "personal", icon: "🏠", color: "#34A853", isPreset: true },
    { name: "meeting", icon: "🤝", color: "#FBBC04", isPreset: true },
    { name: "focus", icon: "🎯", color: "#7B1FA2", isPreset: true },
    { name: "break", icon: "☕", color: "#FF6D00", isPreset: true },
    { name: "health", icon: "💪", color: "#0D904F", isPreset: true },
    { name: "learning", icon: "📚", color: "#1A73E8", isPreset: true },
    { name: "finance", icon: "💰", color: "#E37400", isPreset: true },
    { name: "social", icon: "👥", color: "#EA4335", isPreset: true },
  ];

  await prisma.taskCategory.createMany({ data: presetCategories });
  console.log(`  ✅ Created ${presetCategories.length} preset categories`);

  // Preset Templates
  const presetTemplates = [
    {
      name: "Daily Standup",
      description:
        "Quick daily standup meeting to sync with the team on progress and blockers",
      taskDefaults: {
        title: "Daily Standup",
        estimatedDuration: 15,
        priority: "medium",
        energyLevel: "low",
        tags: ["meeting", "daily"],
        isRecurring: true,
        recurrenceRule: "FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR",
      },
      isPreset: true,
    },
    {
      name: "Weekly Review",
      description:
        "End-of-week review to reflect on accomplishments and plan for next week",
      taskDefaults: {
        title: "Weekly Review",
        estimatedDuration: 60,
        priority: "high",
        energyLevel: "medium",
        tags: ["review", "planning"],
        isRecurring: true,
        recurrenceRule: "FREQ=WEEKLY;BYDAY=FR",
      },
      isPreset: true,
    },
    {
      name: "Monthly Planning",
      description:
        "Monthly planning session to set goals and review long-term progress",
      taskDefaults: {
        title: "Monthly Planning",
        estimatedDuration: 90,
        priority: "high",
        energyLevel: "high",
        tags: ["planning", "goals"],
        isRecurring: true,
        recurrenceRule: "FREQ=MONTHLY;BYMONTHDAY=1",
      },
      isPreset: true,
    },
  ];

  await prisma.template.createMany({ data: presetTemplates });
  console.log(`  ✅ Created ${presetTemplates.length} preset templates`);

  console.log("🌱 Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
