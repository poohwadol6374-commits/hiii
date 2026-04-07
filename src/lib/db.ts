// Prisma client singleton
// Note: Prisma v7 with "client" engine requires an adapter or accelerateUrl.
// We use engineType = "binary" in schema.prisma to avoid this requirement.
// If database is not available, API routes that need DB will return errors gracefully.

let prisma: any = null;

try {
  const { PrismaClient } = require("@prisma/client");

  const globalForPrisma = globalThis as unknown as {
    prisma: any | undefined;
  };

  prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
      log:
        process.env.NODE_ENV === "development"
          ? ["error", "warn"]
          : ["error"],
    });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
  }
} catch (e) {
  // Prisma client not available (e.g., no database configured)
  // App will still work for non-DB pages (landing, etc.)
  console.warn("[Prisma] Client initialization failed — running without database");
  prisma = null;
}

export { prisma };
export default prisma;
