import { geminiService } from './gemini.service';
import { huggingfaceService } from './huggingface.service';
import { cache } from '../utils/cache';
import { promptBuilder } from '../utils/prompt.builder';
import { prisma } from '../config/db';
import { UserContext } from '../types';
import { AppError } from '../utils/errors';
import { HTTP_STATUS } from '../config/constants';

// How long to cache AI responses (urge responses should not be cached)
const CACHE_TTL = {
    coach: 0, // never cache — conversational, must be fresh
    urge: 0, // never cache — real-time intervention
    insight: 3600, // 1 hour — pattern insights don't change minute to minute
};

export const aiService = {
    // Fetch full user context for prompt injection
    async buildUserContext(userId: string): Promise<UserContext> {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                addictions: { where: { status: 'ACTIVE' }, take: 1 },
                checkins: { orderBy: { checkedAt: 'desc' }, take: 1 },
            },
        });

        if (!user) throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);

        const addiction = user.addictions[0];
        const lastCheckin = user.checkins[0];

        // Compute streak from last relapse
        let streak = 0;
        if (addiction) {
            const lastRelapse = await prisma.relapse.findFirst({
                where: { userId, addictionId: addiction.id },
                orderBy: { occurredAt: 'desc' },
            });
            const startDate = lastRelapse?.occurredAt ?? addiction.startDate;
            const diffMs = Date.now() - new Date(startDate).getTime();
            streak = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
        }

        return {
            userId,
            addictionType: addiction?.type ?? 'unknown',
            goal: addiction?.goal ?? 'quit',
            triggers: (addiction?.triggers as string[]) ?? [],
            streak,
            lastMood: lastCheckin?.mood,
        };
    },

    // Core generate function — Gemini first, HuggingFace fallback
    async generate(
        prompt: string,
        cacheKey?: string,
        ttl = 300,
    ): Promise<string> {
        if (cacheKey) {
            let cached = null;
            try {
                cached = await cache.get<string>(cacheKey);
            } catch (err) {
                console.error('Error accessing cache:', err);
            }
            if (cached) return cached;
        }

        let response: string;

        try {
            response = await geminiService.generate(prompt);
        } catch (geminiError) {
            console.warn(
                '[AI] Gemini failed, falling back to HuggingFace:',
                geminiError,
            );
            try {
                response = await huggingfaceService.generate(prompt);
            } catch (hfError) {
                console.error('[AI] Both providers failed:', hfError);
                // Graceful degradation — never crash the app over AI failure
                return "I'm having trouble connecting right now. Take a few deep breaths and revisit this in a moment.";
            }
        }

        if (cacheKey && ttl > 0) {
            try {
                await cache.set(cacheKey, response, ttl);
            } catch (err) {
                console.error('Error setting cache:', err);
            }
        }

        return response;
    },

    async coach(
        userId: string,
        userMessage: string,
        recentMessages: { role: 'user' | 'assistant'; content: string }[],
    ): Promise<string> {
        const userContext = await aiService.buildUserContext(userId);
        const prompt = promptBuilder.coach({
            userContext,
            userMessage,
            recentMessages,
        });
        return aiService.generate(prompt, undefined, CACHE_TTL.coach);
    },

    async urge(
        userId: string,
        trigger: string,
        mood: string,
        intensity: number,
    ): Promise<string> {
        const userContext = await aiService.buildUserContext(userId);
        const prompt = promptBuilder.urge({
            userContext,
            trigger,
            mood,
            intensity,
        });
        return aiService.generate(prompt, undefined, CACHE_TTL.urge);
    },

    async insight(userId: string): Promise<string> {
        const cacheKey = `insight:${userId}`;
        const userContext = await aiService.buildUserContext(userId);

        // Pull pattern data
        const relapses = await prisma.relapse.findMany({
            where: { userId },
            select: { trigger: true, mood: true, intensity: true },
            orderBy: { occurredAt: 'desc' },
            take: 30,
        });

        if (relapses.length < 3) {
            return "Keep logging your check-ins and relapses — I'll start showing patterns once I have more data (need at least 3 entries).";
        }

        const triggerFreq: Record<string, number> = {};
        const moodFreq: Record<string, number> = {};

        for (const r of relapses) {
            triggerFreq[r.trigger] = (triggerFreq[r.trigger] ?? 0) + 1;
            moodFreq[r.mood] = (moodFreq[r.mood] ?? 0) + 1;
        }

        const topTriggers = Object.entries(triggerFreq)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3) as [string, number][];
        const topMoods = Object.entries(moodFreq)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3) as [string, number][];

        const prompt = promptBuilder.insight({
            userContext,
            topTriggers,
            topMoods,
            totalRelapses: relapses.length,
        });

        return aiService.generate(prompt, cacheKey, CACHE_TTL.insight);
    },

    // Persist both sides of every AI exchange
    async saveMessage(
        userId: string,
        role: 'user' | 'assistant',
        content: string,
        type: 'COACH' | 'URGE' | 'INSIGHT',
        context?: object,
    ): Promise<void> {
        await prisma.aiMessage.create({
            data: { userId, role, content, type, context },
        });
    },
};
