import { Response } from 'express';
import { prisma } from '../../config/db';
import { cache } from '../../utils/cache';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { NotFoundError, ValidationError } from '../../utils/errors';
import { sendSuccess } from '../../utils/responseHelper';
import { HTTP_STATUS } from '../../config/constants';

export const addictionController = {
    async create(req: AuthRequest, res: Response): Promise<void> {
        const { type, goal, triggers = [], metadata = {} } = req.body;

        const user = await prisma.user.findUnique({
            where: { id: req.userId! },
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

        const community = await prisma.community.findUnique({
            where: { addictionType: type },
            select: { id: true },
        });
        if (!community) return;
 
        await prisma.communityMember.upsert({
            where: { userId_communityId: { userId: user.id, communityId: community.id } },
            create: { userId: user.id, communityId: community.id },
            update: {},
        });
        console.log(`User ${user.id} added to community ${community.id} for addiction type ${type}`);

        try{
            await cache.delPattern(`dashboard:${req.userId}*`);
            await cache.del(`user:${req.userId}`);
        }
        catch(err){
            console.error('Error clearing cache:', err);
        }
        sendSuccess(res, HTTP_STATUS.CREATED, "Addiction created", { addiction });
    },

    async getAll(req: AuthRequest, res: Response): Promise<void> {
        const user = await prisma.user.findUnique({
            where: { id: req.userId! },
        });
        if (!user) throw new NotFoundError('User');

        const addictions = await prisma.addiction.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' },
        });

        sendSuccess(res, HTTP_STATUS.OK, "Addictions retrieved", { addictions });
    },

    async updateStatus(req: AuthRequest, res: Response): Promise<void> {
        const { status } = req.body;
        const validStatuses = ['ACTIVE', 'PAUSED', 'COMPLETED'];

        if (!validStatuses.includes(status)) {
        throw new ValidationError(`Status must be one of: ${validStatuses.join(', ')}`);
        }

        const user = await prisma.user.findUnique({
            where: { id: req.userId! },
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

        try{
            await cache.delPattern(`dashboard:${req.userId}*`);
        }
        catch(err){
            console.error('Error clearing cache:', err);
        }
        
        sendSuccess(res, HTTP_STATUS.OK, "Addiction status updated", { addiction: updated });
    },
};