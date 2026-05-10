import { redis } from '../config/redis';

export const cache = {
    async get<T>(key: string): Promise<T | null> {
        const data = await redis.get(key);
        return data && (typeof data == 'string') ? (JSON.parse(data) as T) : null;
    },

    async set(key: string, value: unknown, ttlSeconds = 300): Promise<void> {
        await redis.setex(key, ttlSeconds, JSON.stringify(value));
    },

    async del(key: string): Promise<void> {
        await redis.del(key);
    },

    async delPattern(pattern: string): Promise<void> {
        const keys = await redis.keys(pattern);
        if (keys.length > 0) await redis.del(...keys);
    },
};