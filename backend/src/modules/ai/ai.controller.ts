import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { aiService } from '../../services/ai.service';
import { prisma } from '../../config/db';
import { NotFoundError, ValidationError } from '../../utils/errors';
import { sendSuccess } from '../../utils/responseHelper';
import { HTTP_STATUS } from '../../config/constants';

export const aiController = {
    async chat(req: AuthRequest, res: Response): Promise<void> {
        const { message } = req.body;
        if (!message?.trim()) throw new ValidationError('Message cannot be empty');

        const user = await prisma.user.findUnique({
            where: { id: req.userId! },
        });
        if (!user) throw new NotFoundError('User');

        // Load last 6 messages for context window
        const history = await prisma.aiMessage.findMany({
            where: { userId: user.id, type: 'COACH' },
            orderBy: { createdAt: 'desc' },
            take: 6,
        });

        const recentMessages = history
            .reverse()
            .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }));

        // Save user message first
        await aiService.saveMessage(user.id, 'user', message, 'COACH');

        const reply = await aiService.coach(user.id, message, recentMessages);

        // Save assistant reply
        await aiService.saveMessage(user.id, 'assistant', reply, 'COACH');

        sendSuccess(res, HTTP_STATUS.OK, "Message processed", { reply });
    },

    async urge(req: AuthRequest, res: Response): Promise<void> {
        const { trigger, mood, intensity } = req.body;

        if (!trigger || !mood || intensity === undefined) {
            throw new ValidationError('trigger, mood, and intensity are required');
        }
        if (intensity < 1 || intensity > 10) {
            throw new ValidationError('intensity must be between 1 and 10');
        }

        const user = await prisma.user.findUnique({
            where: { id: req.userId! },
        });
        if (!user) throw new NotFoundError('User');

        const reply = await aiService.urge(user.id, trigger, mood, intensity);

        await aiService.saveMessage(user.id, 'assistant', reply, 'URGE', {
            trigger,
            mood,
            intensity,
        });

        sendSuccess(res, HTTP_STATUS.OK, "Urge processed", { reply });
    },

    async insight(req: AuthRequest, res: Response): Promise<void> {
        const user = await prisma.user.findUnique({
            where: { id: req.userId! },
        });
        if (!user) throw new NotFoundError('User');

        const insight = await aiService.insight(user.id);

        await aiService.saveMessage(user.id, 'assistant', insight, 'INSIGHT');

        sendSuccess(res, HTTP_STATUS.OK, "Insight generated", { insight });
    },

    async getHistory(req: AuthRequest, res: Response): Promise<void> {
        const { type = 'COACH', limit = 20 } = req.query;

        const user = await prisma.user.findUnique({
            where: { id: req.userId! },
        });
        if (!user) throw new NotFoundError('User');

        const messages = await prisma.aiMessage.findMany({
            where: { userId: user.id, type: type as 'COACH' | 'URGE' | 'INSIGHT' },
            orderBy: { createdAt: 'asc' },
            take: Number(limit),
        });

        sendSuccess(res, HTTP_STATUS.OK, "History retrieved", { messages });
    },
};