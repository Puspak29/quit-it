import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { prisma } from '../../config/db';
import { sendSuccess } from '../../utils/responseHelper';
import {
    HTTP_STATUS,
    PAGE_SIZE_DEFAULT,
    PAGE_SIZE_MAX,
} from '../../config/constants';
import { NotFoundError } from '../../utils/errors';

export const communityController = {
    // List all communities with member count and message count, and whether the requesting user is a member
    async listAll(req: AuthRequest, res: Response): Promise<void> {
        const communities = await prisma.community.findMany({
            orderBy: { name: 'asc' },
            include: {
                _count: { select: { members: true, messages: true } },
                members: {
                    where: { userId: req.userId },
                    select: { id: true },
                },
            },
        });

        const data = communities.map((c) => ({
            id: c.id,
            name: c.name,
            description: c.description,
            addictionType: c.addictionType,
            memberCount: c._count.members,
            messageCount: c._count.messages,
            isMember: c.members.length > 0,
        }));

        sendSuccess(res, HTTP_STATUS.OK, 'Communities retrieved successfully', {
            communities: data,
        });
    },

    async getOne(req: AuthRequest, res: Response): Promise<void> {
        const { communityId } = req.params;
        const community = await prisma.community.findUnique({
            where: { id: communityId },
            include: {
                _count: { select: { members: true, messages: true } },
                members: {
                    where: { userId: req.userId },
                    select: { id: true },
                },
            },
        });

        if (!community) throw new NotFoundError('Community not found');

        sendSuccess(res, HTTP_STATUS.OK, 'Community retrieved successfully', {
            community: {
                id: community.id,
                name: community.name,
                description: community.description,
                addictionType: community.addictionType,
                memberCount: community._count.members,
                messageCount: community._count.messages,
                isMember: community.members.length > 0,
            },
        });
    },

    async joinCommunity(req: AuthRequest, res: Response): Promise<void> {
        const { communityId } = req.params;

        const community = await prisma.community.findUnique({
            where: { id: communityId },
        });
        if (!community) throw new NotFoundError('Community not found');

        await prisma.communityMember.upsert({
            where: {
                userId_communityId: { userId: req.userId!, communityId },
            },
            create: { userId: req.userId!, communityId: community.id },
            update: {}, // no-op if already a member
        });

        sendSuccess(
            res,
            HTTP_STATUS.OK,
            `Joined community ${community.name} successfully`,
        );
    },

    async leaveCommunity(req: AuthRequest, res: Response): Promise<void> {
        const { communityId } = req.params;

        const community = await prisma.community.findUnique({
            where: { id: communityId },
        });
        if (!community) throw new NotFoundError('Community not found');

        const membership = await prisma.communityMember.findUnique({
            where: {
                userId_communityId: { userId: req.userId!, communityId },
            },
        });
        if (!membership) throw new NotFoundError('Membership not found');

        await prisma.communityMember.delete({
            where: { id: membership.id },
        });

        sendSuccess(
            res,
            HTTP_STATUS.OK,
            `Left community ${community.name} successfully`,
        );
    },

    async getMessages(req: AuthRequest, res: Response): Promise<void> {
        const { cursor, limit = PAGE_SIZE_DEFAULT } = req.query as {
            cursor?: string;
            limit?: number;
        };
        const { communityId } = req.params;
        const userId = req.userId!;

        const take = Math.min(limit, PAGE_SIZE_MAX);

        const rows = await prisma.communityMessage.findMany({
            where: {
                communityId,
                OR: [
                    { status: 'VISIBLE' },
                    { status: 'FLAGGED', userId }, // sender sees their own flagged messages
                ],
            },
            orderBy: { createdAt: 'desc' },
            take: take + 1, // +1 to determine hasMore
            ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
            include: { user: { select: { id: true, name: true } } },
        });

        const hasMore = rows.length > take;
        const messages = hasMore ? rows.slice(0, take) : rows;

        const result = {
            messages,
            nextCursor: hasMore ? messages[messages.length - 1].id : null,
            hasMore,
        };

        sendSuccess(
            res,
            HTTP_STATUS.OK,
            'Messages retrieved successfully',
            result,
        );
    },
};
