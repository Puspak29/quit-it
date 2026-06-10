export interface NotificationJobData {
    recipientId: string;       // userId to notify
    fcmToken: string;          // fetched before enqueue so the worker is stateless
    title: string;
    body: string;
    data?: Record<string, string>;  // deep link payload (messageId, communityId, etc.)
}

export interface MilestoneJobData {
    userId: string;
    userName: string;
    communityId: string;
    addictionType: string;
    streakDays: number;        // the streak at time of message — worker checks milestones
}

export interface ModerationJobData {
    messageId: string;
    communityId: string;
    content: string;           // full text to scan — no DB read needed in worker
    userId: string;
}