import { Response } from 'express';
import { prisma } from '../../config/db';
import { cache } from '../../utils/cache';
import { streakService } from '../../services/streak.service';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { NotFoundError, ValidationError } from '../../utils/errors';
import { HTTP_STATUS } from '../../config/constants';
import { sendSuccess } from '../../utils/responseHelper';

export const checkinController = {
  async create(req: AuthRequest, res: Response): Promise<void> {
    const { mood, moodScore, note, didRelapse = false } = req.body;

    if (moodScore < 1 || moodScore > 5) {
      throw new ValidationError('moodScore must be between 1 and 5');
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: req.userId! },
      include: { addictions: { where: { status: 'ACTIVE' }, take: 1 } },
    });
    if (!user) throw new NotFoundError('User');

    // Prevent duplicate check-in on same calendar day
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const existing = await prisma.checkin.findFirst({
      where: {
        userId: user.id,
        checkedAt: { gte: todayStart, lte: todayEnd },
      },
    });

    if (existing) {
      throw new ValidationError('Already checked in today');
    }

    const activeAddiction = user.addictions[0];
    const streak = activeAddiction
      ? await streakService.computeStreak(user.id, activeAddiction.id)
      : 0;

    const checkin = await prisma.checkin.create({
      data: {
        userId: user.id,
        mood,
        moodScore,
        note,
        didRelapse,
        streak, // snapshot streak at check-in time
      },
    });

    try{
        await cache.delPattern(`dashboard:${req.userId}*`);
    }
    catch(err){
        console.error('Error clearing cache:', err);
    }
    sendSuccess(res, HTTP_STATUS.CREATED, "Check-in created", { checkin });
  },

  async getToday(req: AuthRequest, res: Response): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { clerkId: req.userId! },
    });
    if (!user) throw new NotFoundError('User');

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const checkin = await prisma.checkin.findFirst({
      where: { userId: user.id, checkedAt: { gte: todayStart } },
    });

    sendSuccess(res, HTTP_STATUS.OK, "Today's check-in retrieved", { checkin }); // null if not checked in yet
  },

  async getHistory(req: AuthRequest, res: Response): Promise<void> {
    const { page = 1, limit = 14 } = req.query;

    const user = await prisma.user.findUnique({
      where: { clerkId: req.userId! },
    });
    if (!user) throw new NotFoundError('User');

    const [checkins, total] = await Promise.all([
      prisma.checkin.findMany({
        where: { userId: user.id },
        orderBy: { checkedAt: 'desc' },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      }),
      prisma.checkin.count({ where: { userId: user.id } }),
    ]);

    sendSuccess(res, HTTP_STATUS.OK, "History retrieved", { checkins, total, page: Number(page), limit: Number(limit) });
  },
};