import { Response } from 'express';
import { prisma } from '../../config/db';
import { cache } from '../../utils/cache';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { NotFoundError, ValidationError } from '../../utils/errors';

export const addictionController = {
    async create(req: AuthRequest, res: Response): Promise<void> {
        const { type, goal, triggers = [], metadata = {} } = req.body;

        const user = await prisma.user.findUnique({
            where: { clerkId: req.userId! },
        });
        if (!user) throw new NotFoundError('User');

        const addiction = await prisma.addiction.create({
            data: {
                userId: user.id,
                type,
                goal,
                triggers,  // stored as JSON array
                metadata,
        },
        });

        await cache.delPattern(`dashboard:${req.userId}*`);
        await cache.del(`user:${req.userId}`);
        res.status(201).json({ addiction });
    },

    async getAll(req: AuthRequest, res: Response): Promise<void> {
        const user = await prisma.user.findUnique({
            where: { clerkId: req.userId! },
        });
        if (!user) throw new NotFoundError('User');

        const addictions = await prisma.addiction.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' },
        });

        res.json({ addictions });
    },

    async updateStatus(req: AuthRequest, res: Response): Promise<void> {
        const { status } = req.body;
        const validStatuses = ['ACTIVE', 'PAUSED', 'COMPLETED'];

        if (!validStatuses.includes(status)) {
        throw new ValidationError(`Status must be one of: ${validStatuses.join(', ')}`);
        }

        const user = await prisma.user.findUnique({
            where: { clerkId: req.userId! },
        });
        if (!user) throw new NotFoundError('User');

        const addiction = await prisma.addiction.findFirst({
            where: { id: req.params.id as string, userId: user.id },
        });
        if (!addiction) throw new NotFoundError('Addiction');

        const updated = await prisma.addiction.update({
            where: { id: req.params.id as string },
            data: { status },
        });

        await cache.delPattern(`dashboard:${req.userId}*`);
        res.json({ addiction: updated });
    },
};