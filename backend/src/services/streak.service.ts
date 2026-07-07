import { prisma } from '../config/db';

export const streakService = {
    // Counts consecutive days with check-ins and no relapses
    async computeStreak(userId: string, addictionId: string): Promise<number> {
        const relapses = await prisma.relapse.findMany({
            where: { userId, addictionId },
            orderBy: { occurredAt: 'desc' },
            take: 1,
        });

        const lastRelapseDate = relapses[0]?.occurredAt ?? null;

        const addiction = await prisma.addiction.findUnique({
            where: { id: addictionId },
        });

        const startDate = lastRelapseDate
            ? new Date(lastRelapseDate.getTime() + 1)
            : (addiction?.startDate ?? new Date());

        const diffMs = Date.now() - startDate.getTime();
        return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
    },
};
