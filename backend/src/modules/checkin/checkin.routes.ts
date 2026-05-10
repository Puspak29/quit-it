import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { checkinController } from './checkin.controller';

const router = Router();
router.use(requireAuth);

router.post(
    '/',
    validate({ mood: 'string', moodScore: 'number' }),
    checkinController.create
);
router.get('/today', checkinController.getToday);
router.get('/history', checkinController.getHistory);

export default router;