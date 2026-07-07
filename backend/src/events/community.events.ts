import { EventEmitter } from 'events';
import { milestoneQueue, moderationQueue, notificationQueue } from '../queues';
import { prisma } from '../config/db';
import { streakService } from '../services/streak.service';
import { MILESTONE_DAYS } from '../config/constants'; 

export interface MessageCreatedPayload {
    messageId: string;
    communityId: string;
    userId: string;
    content: string;
    addictionType: string;
}

export interface MessageFlaggedPayload {
    messageId: string;
    flaggedBy: string;
    reason: string;
    content: string;
    communityId: string;
}

class CommunityEventEmitter extends EventEmitter {}
export const communityEvents = new CommunityEventEmitter();

communityEvents.on('error', (err) => {
    console.error('[CommunityEvents] Error:', err);
});

// message:created
communityEvents.on('message:created', async(payload: MessageCreatedPayload) => {
    const { messageId, communityId, userId, content, addictionType } = payload;

    // 1. Moderation — always run for every message
    await moderationQueue.add('moderate-message', {
        messageId,
        communityId,
        content,
        userId,
    });

    // 2. Milestone check — did this user just hit a streak milestone?
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { addictions: { where: { type: addictionType, status: 'ACTIVE' }, take: 1 } },
    });

    if(user?.addictions[0]) {
        const streak = await streakService.computeStreak(userId, user.addictions[0].id);

        if((MILESTONE_DAYS as readonly number[]).includes(streak)) {
            await milestoneQueue.add('check-milestone', {
                userId,
                userName: user.name ?? 'Anonymous',
                communityId,
                addictionType,
                streakDays: streak,
            });

            // if(user.fcmToken){
            //     await notificationQueue.add('send-milestone', {
            //         recipientId: userId,
            //         fcmToken: user.fcmToken,
            //         title: `${streak} days clean!`,
            //         body: `You've hit a major milestone. Keep going!`,
            //         data: {
            //             type: 'milestone',
            //             streakDays: String(streak),
            //             addictionType
            //         }
            //     });
            // }
        }
    }

    // 3. Mention notifications — scan for @username patterns
    const mentions = content.match(/@(\w+)/g)?.map((m) => m.slice(1)) ?? [];
    if (mentions.length > 0) {
        const mentioned = await prisma.user.findMany({
            where: { name: { in: mentions }, fcmToken: { not: null }, id: { not: userId } },
            select: { id: true, fcmToken: true, name: true },
        });

        // await Promise.all(
        //     mentioned.map((u) =>
        //         notificationQueue.add('send-mention', {
        //             recipientId: u.id,
        //             fcmToken: u.fcmToken!,
        //             title: `${user?.name ?? 'Someone'} mentioned you`,
        //             body: content.slice(0, 100),
        //             data: { 
        //                 type: 'mention',
        //                 messageId,
        //                 communityId
        //             },
        //         }),
        //     ),
        // );
    }
});

// message:flagged
communityEvents.on('message:flagged', async (payload: MessageFlaggedPayload) => {
    // Escalate to moderation queue for human review
    await moderationQueue.add('review-flagged', {
        messageId: payload.messageId,
        communityId: payload.communityId,
        content: payload.content,
        userId: payload.flaggedBy,
    });
});