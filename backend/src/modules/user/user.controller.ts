import { Response } from 'express';
import { prisma } from '../../config/db';
import { cache } from '../../utils/cache';
import { streakService } from '../../services/streak.service';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { NotFoundError } from '../../utils/errors';

export const userController = {
  // Upsert user after Clerk sign-up/sign-in
    async syncUser(req: AuthRequest, res: Response): Promise<void> {
        const { email, name } = req.body;
        const clerkId = req.userId!;

        const user = await prisma.user.upsert({
            where: { clerkId },
            update: { email, name },
            create: { clerkId, email, name },
        });

        await cache.del(`user:${clerkId}`);
        res.json({ user });
    },

    async getMe(req: AuthRequest, res: Response): Promise<void> {
        const cacheKey = `user:${req.userId}`;
        const cached = await cache.get(cacheKey);
        if (cached) { res.json(cached); return; }

        const user = await prisma.user.findUnique({
            where: { clerkId: req.userId! },
            include: { addictions: { where: { status: 'ACTIVE' } } },
        });

        if (!user) throw new NotFoundError('User');

        await cache.set(cacheKey, user, 60);
        res.json(user);
    },

    async updateFcmToken(req: AuthRequest, res: Response): Promise<void> {
        const { fcmToken } = req.body;

        await prisma.user.update({
            where: { clerkId: req.userId! },
            data: { fcmToken },
        });

        res.json({ success: true });
    },

    async getDashboard(req: AuthRequest, res: Response): Promise<void> {
        const cacheKey = `dashboard:${req.userId}`;
        const cached = await cache.get(cacheKey);
        if (cached) { res.json(cached); return; }

        const user = await prisma.user.findUnique({
            where: { clerkId: req.userId! },
            include: { addictions: { where: { status: 'ACTIVE' } } },
        });

        if (!user) throw new NotFoundError('User');

        const activeAddiction = user.addictions[0] ?? null;
        const streak = activeAddiction
            ? await streakService.computeStreak(user.id, activeAddiction.id)
            : 0;

        // Last 7 check-ins for mood chart
        const recentCheckins = await prisma.checkin.findMany({
            where: { userId: user.id },
            orderBy: { checkedAt: 'desc' },
            take: 7,
        });

        // Relapse count this month
        const monthStart = new Date();
        monthStart.setDate(1);
        monthStart.setHours(0, 0, 0, 0);

        const relapseCount = await prisma.relapse.count({
            where: { userId: user.id, occurredAt: { gte: monthStart } },
        });

        const dashboard = {
            user: { id: user.id, name: user.name, email: user.email },
            activeAddiction,
            streak,
            recentCheckins,
            relapseCount,
        };

        await cache.set(cacheKey, dashboard, 120); // 2 min cache
        res.json(dashboard);
    },
};