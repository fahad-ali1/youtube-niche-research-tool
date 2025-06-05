import { createClient } from "redis";

// Create a singleton Redis client that can be reused across the application
const createRedisClient = () => {
  try {
    const client = createClient({
      url: process.env.REDIS_URL || "redis://localhost:6379",
    });

    client.on("error", (err) => {
      console.error("Redis client error:", err);
    });

    return client;
  } catch (error) {
    console.error("Failed to create Redis client:", error);
    return null;
  }
};

// Use a global variable to maintain a connection throughout the lifetime of the application
let redisClient: ReturnType<typeof createClient> | null = null;

export async function getRedisClient() {
  if (!redisClient) {
    redisClient = createRedisClient();
    if (redisClient) {
      try {
        await redisClient.connect();
      } catch (error) {
        console.error("Redis connection error:", error);
        redisClient = null;
      }
    }
  }

  return redisClient;
}

export async function getCachedData<T>(key: string): Promise<T | null> {
  try {
    const client = await getRedisClient();
    if (!client) return null;

    const data = await client.get(key);

    return data ? (JSON.parse(data) as T) : null;
  } catch (error) {
    console.error("Redis cache retrieval error:", error);
    return null;
  }
}

export async function setCachedData(
  key: string,
  data: any,
  expirationInSeconds = 3600
): Promise<void> {
  try {
    const client = await getRedisClient();
    if (!client) return;

    await client.set(key, JSON.stringify(data), { EX: expirationInSeconds });
  } catch (error) {
    console.error("Redis cache setting error:", error);
  }
}
