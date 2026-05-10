import { Redis } from '@upstash/redis'
import { env } from './env';

export const redis = new Redis({
    url: env.REDIS_URL,
    token: env.REDIS_TOKEN
});

export const connectRedis = async () => {
    try {
        await redis.ping();
        console.log("Redis connected successfully.");
    }
    catch (error) {
        console.error("Error connecting to Redis:", error);
    }
}