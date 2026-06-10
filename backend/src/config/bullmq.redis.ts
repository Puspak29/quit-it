import IORedis from 'ioredis';
import { env } from './env';

export const bullmqRedis = new IORedis(env.REDIS_QUEUE_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
});

bullmqRedis.on('connect', () => {
    console.log('[BullMQ] Connected to Redis successfully.');
});

bullmqRedis.on('error', (error) => {
    console.error('[BullMQ] Redis connection error:', error);
});