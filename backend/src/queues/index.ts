import { Queue } from 'bullmq';
import { bullmqRedis } from '../config/bullmq.redis';
import { MilestoneJobData, ModerationJobData, NotificationJobData } from './jobs.types';

const defaultJobOptions = {
    attempts: 3,
    backoff: {
        type: 'exponential',
        delay: 2000, // 2 seconds
    },
    removeOnComplete: {
        count: 100, // Keep last 100 completed jobs
    },
    removeOnFail: {
        count: 50, // Keep last 50 failed jobs
    },
};

export const notificationQueue = new Queue<NotificationJobData>('notificationQueue', {
    connection: bullmqRedis as any,
    defaultJobOptions,
});

export const milestoneQueue = new Queue<MilestoneJobData>('milestones', {
    connection: bullmqRedis as any,
    defaultJobOptions,
});

export const moderationQueue = new Queue<ModerationJobData>('moderation', {
    connection: bullmqRedis as any,
    defaultJobOptions,
});