import IORedis from 'ioredis';
import { env } from './env';
import { workersIndex } from '../workers/index';

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

bullmqRedis.on('end', async () => {
    console.warn('[BullMQ] Redis connection closed. Stopping workers...');
    await workersIndex.shutdown('Redis connection closed');
})