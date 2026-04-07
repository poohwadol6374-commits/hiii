import { z } from "zod";

// ── Common Schemas ──────────────────────────────────────────────

export const uuidSchema = z.string().uuid();

export const emailSchema = z.string().email().max(255);

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password must be at most 128 characters");

// ── Task Schemas ────────────────────────────────────────────────

export const taskTitleSchema = z
  .string()
  .min(1, "Title is required")
  .max(500, "Title must be at most 500 characters");

export const estimatedDurationSchema = z
  .number()
  .int("Duration must be a whole number")
  .min(1, "Duration must be at least 1 minute")
  .max(1440, "Duration must be at most 1440 minutes");

export const prioritySchema = z.enum(["high", "medium", "low"]);

export const taskStatusSchema = z.enum([
  "pending",
  "in_progress",
  "completed",
  "cancelled",
]);

export const energyLevelSchema = z.enum(["high", "medium", "low"]);

export const createTaskSchema = z
  .object({
    title: taskTitleSchema,
    description: z.string().max(5000).optional(),
    category: z.string().optional(),
    priority: prioritySchema.optional().default("medium"),
    estimatedDuration: estimatedDurationSchema,
    deadline: z
      .string()
      .datetime()
      .optional()
      .refine(
        (val) => !val || new Date(val) > new Date(),
        "Deadline must be in the future"
      ),
    scheduledStart: z.string().datetime().optional(),
    scheduledEnd: z.string().datetime().optional(),
    isRecurring: z.boolean().optional().default(false),
    recurrenceRule: z.string().optional(),
    tags: z.array(z.string().max(50)).max(20).optional().default([]),
    energyLevel: energyLevelSchema.optional().default("medium"),
    notes: z.string().max(10000).optional(),
  })
  .refine(
    (data) => {
      if (data.scheduledStart && data.scheduledEnd) {
        return new Date(data.scheduledStart) < new Date(data.scheduledEnd);
      }
      return true;
    },
    {
      message: "scheduledStart must be before scheduledEnd",
      path: ["scheduledEnd"],
    }
  );

export const updateTaskSchema = createTaskSchema.partial();

// ── Calendar Event Schemas ──────────────────────────────────────

export const hexColorSchema = z
  .string()
  .regex(/^#[0-9a-fA-F]{6}$/, "Must be a valid hex color (e.g. #FF5733)");

export const eventTypeSchema = z.enum([
  "task",
  "meeting",
  "focus_time",
  "break",
  "personal",
  "blocked",
]);

// ── Chat Schemas ────────────────────────────────────────────────

export const chatMessageSchema = z
  .string()
  .min(1, "Message cannot be empty")
  .max(2000, "Message must be at most 2000 characters");

// ── Attachment Schemas ──────────────────────────────────────────

export const MAX_ATTACHMENT_SIZE = 26_214_400; // 25 MB in bytes

export const attachmentSchema = z.object({
  fileName: z.string().min(1).max(255),
  fileSize: z
    .number()
    .max(MAX_ATTACHMENT_SIZE, "File size must not exceed 25MB"),
  mimeType: z.string().min(1),
});

// ── Locale / Preferences ────────────────────────────────────────

export const localeSchema = z.enum(["th", "en"]);

export const themeSchema = z.enum(["light", "dark", "auto"]);

export const lumaPersonalitySchema = z.enum([
  "formal",
  "friendly",
  "cheerful",
  "motivational",
  "minimal",
]);

export const animationLevelSchema = z.enum(["full", "reduced", "none"]);
