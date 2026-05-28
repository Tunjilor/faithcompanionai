// src/lib/db.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function buildDatabaseUrl(): string {
  const base = process.env.DATABASE_URL ?? "";
  if (!base) return base;

  // Append connection pooling params suited for Neon serverless cold starts.
  // connection_limit=1 prevents exhausting connections across lambda invocations.
  // pool_timeout and connect_timeout give the DB time to wake from sleep.
  const sep = base.includes("?") ? "&" : "?";
  const params = "connection_limit=1&pool_timeout=20&connect_timeout=15";

  // Avoid double-appending on hot reload
  if (base.includes("connection_limit=")) return base;
  return `${base}${sep}${params}`;
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    datasources: { db: { url: buildDatabaseUrl() } },
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}

// ── Shared retry helper ───────────────────────────────────────────────────────
// Import and use this in any route that needs resilience against cold starts.

function isRetryableError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err ?? "");
  return (
    msg.includes("Can't reach database server") ||
    msg.includes("PrismaClientInitializationError") ||
    msg.includes("Error in PostgreSQL connection") ||
    msg.includes("kind: Closed") ||
    msg.includes("P1001") ||
    msg.includes("Connection refused") ||
    msg.includes("ECONNREFUSED") ||
    msg.includes("connect_timeout")
  );
}

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export async function withDbRetry<T>(
  fn: () => Promise<T>,
  attempts = 3,
  delayMs = 1000
): Promise<T> {
  let lastErr: unknown;

  for (let i = 0; i < attempts; i++) {
    try {
      // Warm the connection before the real query on retries
      if (i > 0) await db.$queryRaw`SELECT 1`;
      return await fn();
    } catch (err) {
      lastErr = err;
      if (!isRetryableError(err) || i === attempts - 1) throw err;
      await sleep(delayMs * (i + 1)); // 1s, 2s backoff
    }
  }

  throw lastErr;
}
