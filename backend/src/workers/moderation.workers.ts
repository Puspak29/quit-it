import { Worker, Job } from 'bullmq';
import { bullmqRedis } from '../config/bullmq.redis';
import { prisma } from '../config/db';
import { ModerationJobData } from '../queues/jobs.types';

// Tiered keyword lists — more serious = higher tier
const KEYWORD_TIERS = [
    {
        reason: 'SELF_HARM' as const,
        status: 'HIDDEN' as const,
        keywords: [
            'want to die',
            'end my life',
            'kill myself',
            'suicide',
            'self harm',
            'self-harm',
        ],
    },
    {
        reason: 'HATE_SPEECH' as const,
        status: 'FLAGGED' as const,
        keywords: ['nigger', 'faggot', 'retard', 'chink', 'kike'],
    },
    {
        reason: 'AUTO_KEYWORD' as const,
        status: 'FLAGGED' as const,
        keywords: [
            'sell drugs',
            'buy drugs',
            'where to get',
            'my dealer',
            'drug supplier',
        ],
    },
] as const;

type MatchedTier = {
    reason: (typeof KEYWORD_TIERS)[number]['reason'];
    status: (typeof KEYWORD_TIERS)[number]['status'];
};

function matchTier(content: string): MatchedTier | null {
    const lower = content.toLowerCase();
    for (const tier of KEYWORD_TIERS) {
        if (tier.keywords.some((kw) => lower.includes(kw))) {
            return { reason: tier.reason, status: tier.status };
        }
    }
    return null;
}

function containsAny(text: string, keywords: string[]): string | null {
    const lower = text.toLowerCase();
    return keywords.find((kw) => lower.includes(kw)) ?? null;
}

export const moderationWorker = new Worker<ModerationJobData>(
    'moderation',
    async (job: Job<ModerationJobData>) => {
        const { messageId, content, userId, communityId } = job.data;

        const isUserFlagged = job.name === 'review-flagged';
        const match = matchTier(content);

        if (!match && !isUserFlagged) {
            return { action: 'clean' };
        }

        const status = match?.status ?? 'FLAGGED';
        const reason = match?.reason ?? 'SPAM';
        const flaggedBy = isUserFlagged ? userId : null; // null = system, userId = reporter
        const flagSource = isUserFlagged ? 'USER' : 'SYSTEM';

        // Atomic: message update + flag creation succeed or fail together
        await prisma.$transaction([
            prisma.communityMessage.update({
                where: { id: messageId },
                data: { status },
            }),
            prisma.moderationFlag.create({
                data: {
                    messageId,
                    flaggedBy, // null for system flags — no FK violation
                    flagSource,
                    reason,
                },
            }),
        ]);

        console.warn(
            `[Moderation] ${flagSource} ${status.toLowerCase()} message ${messageId} (${reason})`,
        );
        return { action: status.toLowerCase(), reason, source: flagSource };
    },
    { connection: bullmqRedis as any, concurrency: 10 },
);

moderationWorker.on('failed', (job, err) => {
    console.error(
        `[Moderation] Job ${job?.id} failed after retries:`,
        err.message,
    );
});
