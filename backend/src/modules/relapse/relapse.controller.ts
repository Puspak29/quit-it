import { Response } from 'express';
import { prisma } from '../../config/db';
import { cache } from '../../utils/cache';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { NotFoundError, ValidationError } from '../../utils/errors';

export const relapseController = {
  async log(req: AuthRequest, res: Response): Promise<void> {
    const { addictionId, trigger, mood, intensity, note, context } = req.body;

    if (intensity < 1 || intensity > 10) {
      throw new ValidationError('Intensity must be between 1 and 10');
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: req.userId! },
    });
    if (!user) throw new NotFoundError('User');

    const addiction = await prisma.addiction.findFirst({
      where: { id: addictionId, userId: user.id },
    });
    if (!addiction) throw new NotFoundError('Addiction');

    const relapse = await prisma.relapse.create({
      data: {
        userId: user.id,
        addictionId,
        trigger,
        mood,
        intensity,
        note,
        context, // optional JSON { location, timeOfDay, wasAlone }
      },
    });

    // Bust dashboard cache so streak resets immediately
    await cache.delPattern(`dashboard:${req.userId}*`);
    res.status(201).json({ relapse });
  },

  async getAll(req: AuthRequest, res: Response): Promise<void> {
    const { page = 1, limit = 10 } = req.query;

    const user = await prisma.user.findUnique({
      where: { clerkId: req.userId! },
    });
    if (!user) throw new NotFoundError('User');

    const [relapses, total] = await Promise.all([
      prisma.relapse.findMany({
        where: { userId: user.id },
        orderBy: { occurredAt: 'desc' },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        include: { addiction: { select: { type: true, goal: true } } },
      }),
      prisma.relapse.count({ where: { userId: user.id } }),
    ]);

    res.json({ relapses, total, page: Number(page), limit: Number(limit) });
  },

  // Lightweight pattern data for the AI — no AI call here
  async getPatterns(req: AuthRequest, res: Response): Promise<void> {
    const cacheKey = `patterns:${req.userId}`;
    const cached = await cache.get(cacheKey);
    if (cached) { res.json(cached); return; }

    const user = await prisma.user.findUnique({
      where: { clerkId: req.userId! },
    });
    if (!user) throw new NotFoundError('User');

    const relapses = await prisma.relapse.findMany({
      where: { userId: user.id },
      select: { trigger: true, mood: true, intensity: true, occurredAt: true },
      orderBy: { occurredAt: 'desc' },
      take: 30, // last 30 relapses is enough for pattern detection
    });

    // Frequency map — no library needed
    const triggerFreq: Record<string, number> = {};
    const moodFreq: Record<string, number> = {};

    for (const r of relapses) {
      triggerFreq[r.trigger] = (triggerFreq[r.trigger] ?? 0) + 1;
      moodFreq[r.mood] = (moodFreq[r.mood] ?? 0) + 1;
    }

    const patterns = {
      totalRelapses: relapses.length,
      topTriggers: Object.entries(triggerFreq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3),
      topMoods: Object.entries(moodFreq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3),
      recentRelapses: relapses.slice(0, 5),
    };

    await cache.set(cacheKey, patterns, 300); // 5 min cache
    res.json(patterns);
  },
};