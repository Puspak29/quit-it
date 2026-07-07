import { Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../../config/db';
import { cache } from '../../utils/cache';
import { streakService } from '../../services/streak.service';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { NotFoundError, AppError } from '../../utils/errors';
import { sendSuccess } from '../../utils/responseHelper';
import { HTTP_STATUS } from '../../config/constants';

export const userController = {
    async getMe(req: AuthRequest, res: Response): Promise<void> {
        res.setHeader('Cache-Control', 'no-store'); // Ensure sensitive data is not cached

        const cacheKey = `user:${req.userId}`;
        let cached = null;
        try {
            cached = await cache.get(cacheKey);
        } catch (error) {
            console.error('Error fetching user from cache:', error);
        }
        if (cached) {
            sendSuccess(res, HTTP_STATUS.OK, 'User retrieved', {
                user: cached,
            });
            return;
        }

        const user = await prisma.user.findUnique({
            where: { id: req.userId! },
            include: { addictions: { where: { status: 'ACTIVE' } } },
        });

        if (!user) throw new NotFoundError('User');

        const { password: _, ...userWithoutPassword } = user;

        try {
            await cache.set(cacheKey, userWithoutPassword, 60);
        } catch (error) {
            console.error('Error setting user in cache:', error);
        }

        sendSuccess(res, HTTP_STATUS.OK, 'User retrieved', {
            user: userWithoutPassword,
        });
    },

    async updateFcmToken(req: AuthRequest, res: Response): Promise<void> {
        const { fcmToken } = req.body;

        await prisma.user.update({
            where: { id: req.userId! },
            data: { fcmToken },
        });

        sendSuccess(res, HTTP_STATUS.OK, 'FCM token updated', {
            success: true,
        });
    },

    async getDashboard(req: AuthRequest, res: Response): Promise<void> {
        res.setHeader('Cache-Control', 'no-store'); // Ensure sensitive data is not cached

        const cacheKey = `dashboard:${req.userId}`;
        let cached = null;
        try {
            cached = await cache.get(cacheKey);
        } catch (error) {
            console.error('Error fetching dashboard from cache:', error);
        }
        if (cached) {
            sendSuccess(res, HTTP_STATUS.OK, 'Dashboard retrieved', {
                dashboard: cached,
            });
            return;
        }

        const user = await prisma.user.findUnique({
            where: { id: req.userId! },
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

        try {
            await cache.set(cacheKey, dashboard, 120); // 2 min cache
        } catch (error) {
            console.error('Error setting dashboard in cache:', error);
        }
        sendSuccess(res, HTTP_STATUS.OK, 'Dashboard retrieved', { dashboard });
    },

    async updateProfile(req: AuthRequest, res: Response): Promise<void> {
        const { name, email, currentPassword, newPassword } = req.body;

        const user = await prisma.user.findUnique({
            where: { id: req.userId! },
        });
        if (!user) throw new NotFoundError('User');

        // Password change requested — validate current password first
        let hashedNewPassword: string | undefined;
        if (newPassword) {
            if (!currentPassword) {
                throw new AppError(
                    'Current password is required to set a new password',
                    HTTP_STATUS.BAD_REQUEST,
                );
            }
            const isValid = await bcrypt.compare(
                currentPassword,
                user.password,
            );
            if (!isValid) {
                throw new AppError(
                    'Current password is incorrect',
                    HTTP_STATUS.BAD_REQUEST,
                );
            }
            hashedNewPassword = await bcrypt.hash(newPassword, 10);
        }

        // Check email uniqueness if being changed
        if (email && email !== user.email) {
            const existing = await prisma.user.findUnique({ where: { email } });
            if (existing) {
                throw new AppError(
                    'Email is already taken',
                    HTTP_STATUS.BAD_REQUEST,
                );
            }
        }

        const updated = await prisma.user.update({
            where: { id: req.userId! },
            data: {
                ...(name !== undefined && name?.trim() !== '' && { name }),
                ...(email !== undefined && email?.trim() !== '' && { email }),
                ...(hashedNewPassword && { password: hashedNewPassword }),
            },
        });

        // Invalidate caches
        try {
            await cache.del(`user:${req.userId}`);
            await cache.del(`dashboard:${req.userId}`);
        } catch (err) {
            console.error('Cache invalidation error:', err);
        }

        const { password: _, ...userWithoutPassword } = updated;
        sendSuccess(res, HTTP_STATUS.OK, 'Profile updated successfully', {
            user: userWithoutPassword,
        });
    },
};
