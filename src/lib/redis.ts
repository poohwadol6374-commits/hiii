import Redis from "ioredis";

let redis: Redis | null = null;

function createRedisClient(): Redis | null {
  const url = process.env.REDIS_URL ?? "redis://localhost:6379";

  try {
    const client = new Redis(url, {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        if (times > 3) {
          console.warn(
            "[Redis] Max retries reached, falling back to no-cache mode"
          );
          return null;
        }
        return Math.min(times * 200, 2000);
      },
      lazyConnect: true,
    });

    client.on("error", (err) => {
      console.warn("[Redis] Connection error:", err.message);
    });

    client.on("connect", () => {
      console.info("[Redis] Connected successfully");
    });

    return client;
  } catch {
    console.warn("[Redis] Failed to create client, running without cache");
    return null;
  }
}

export function getRedis(): Redis | null {
  if (!redis) {
    redis = createRedisClient();
  }
  return redis;
}

/**
 * Safe cache get — returns null if Redis is unavailable.
 */
export async function cacheGet(key: string): Promise<string | null> {
  const client = getRedis();
  if (!client) return null;
  try {
    return await client.get(key);
  } catch {
    return null;
  }
}

/**
 * Safe cache set — silently fails if Redis is unavailable.
 */
export async function cacheSet(
  key: string,
  value: string,
  ttlSeconds?: number
): Promise<void> {
  const client = getRedis();
  if (!client) return;
  try {
    if (ttlSeconds) {
      await client.set(key, value, "EX", ttlSeconds);
    } else {
      await client.set(key, value);
    }
  } catch {
    // silently fail — cache is optional
  }
}

/**
 * Safe cache delete.
 */
export async function cacheDel(key: string): Promise<void> {
  const client = getRedis();
  if (!client) return;
  try {
    await client.del(key);
  } catch {
    // silently fail
  }
}

export default getRedis;
