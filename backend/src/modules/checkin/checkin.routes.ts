import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { checkinController } from './checkin.controller';
import { asyncHandler } from '../../utils/asyncHandler';

const router = Router();
router.use(requireAuth);

router.post(
    '/',
    validate({ mood: 'string', moodScore: 'number' }),
    asyncHandler(checkinController.create),
);
router.get('/today', asyncHandler(checkinController.getToday));
router.get('/history', asyncHandler(checkinController.getHistory));

export default router;
