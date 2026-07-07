import { Worker, Job } from 'bullmq';
import { bullmqRedis } from '../config/bullmq.redis';
import { MilestoneJobData } from '../queues/jobs.types';
import { WS_EVENTS } from '../config/constants';
import { getIO } from '../config/socket';

const MILESTONE_LABELS: Record<number, string> = {
    7: '1 week',
    30: '1 month',
    90: '3 months',
    180: '6 months',
    365: '1 year',
};

export const milestoneWorker = new Worker<MilestoneJobData>(
    'milestones',
    async (job: Job<MilestoneJobData>) => {
        const { userId, userName, communityId, addictionType, streakDays } =
            job.data;

        const label = MILESTONE_LABELS[streakDays];
        if (!label) {
            return {
                action: 'skip',
                reason: `not_a_milestone`,
            };
        }

        getIO()
            .to(communityId)
            .emit(WS_EVENTS.MILESTONE, {
                userId,
                userName,
                addictionType,
                streakDays,
                message: `Congratulations ${userName} on reaching a ${label} milestone!`,
                timestamp: new Date().toISOString(),
            });

        console.log(
            `[Milestone] Broadcast: ${userName} reached ${streakDays} days in community ${communityId}`,
        );

        return {
            action: 'broadcast',
            streakDays,
        };
    },
    {
        connection: bullmqRedis as any,
        concurrency: 5,
    },
);

milestoneWorker.on('failed', (job, err) => {
    console.error(`[Milestone] Job ${job?.id} failed: `, err.message);
});
