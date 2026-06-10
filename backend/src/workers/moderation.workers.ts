import { Worker, Job } from 'bullmq';
import { bullmqRedis } from '../config/bullmq.redis';
import { prisma } from '../config/db';
import { ModerationJobData } from '../queues/jobs.types';

// Tiered keyword lists — more serious = higher tier
const SELF_HARM_KEYWORDS = [
    'want to die', 'end my life', 'kill myself', 'suicide', 'self harm',
];

const FLAG_KEYWORDS = [
    'sell drugs', 'buy drugs', 'where to get', 'dealer', 'supplier',
    'nigger', 'faggot', 'retard', // hate speech
];

function containsAny(text: string, keywords: string[]): string | null {
    const lower = text.toLowerCase();
    return keywords.find((kw) => lower.includes(kw)) ?? null;
}

const moderationWorker = new Worker<ModerationJobData>(
    'moderation',
    async (job: Job<ModerationJobData>) => {
        const { messageId, content } = job.data;

        // Self-harm check — highest priority, immediate hide
        const selfHarmHit = containsAny(content, SELF_HARM_KEYWORDS);
        if (selfHarmHit) {
            await prisma.communityMessage.update({
                where: { id: messageId },
                data: { status: 'HIDDEN' },
            });
            await prisma.moderationFlag.create({
                data: {
                    messageId,
                    flaggedBy: 'system',
                    reason: 'SELF_HARM',
                },
            });
            console.warn(`[Moderation] Self-harm content hidden: ${messageId}`);
            return { action: 'hidden', reason: 'SELF_HARM' };
        }

        // General keyword flag — flag for review, still visible to sender
        const flagHit = containsAny(content, FLAG_KEYWORDS);
        if (flagHit) {
            await prisma.communityMessage.update({
                where: { id: messageId },
                data: { status: 'FLAGGED' },
            });
            await prisma.moderationFlag.create({
                data: {
                    messageId,
                    flaggedBy: 'system',
                    reason: 'AUTO_KEYWORD',
                },
            });
            console.warn(`[Moderation] Message flagged for review: ${messageId} (keyword: ${flagHit})`);
            return { action: 'flagged', reason: 'AUTO_KEYWORD', keyword: flagHit };
        }

        return { action: 'clean' };
    },
    { connection: bullmqRedis as any, concurrency: 10 },
);

moderationWorker.on('failed', (job, err) => {
    console.error(`[Moderation] Job ${job?.id} failed:`, err.message);
});