import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth.middleware';
import { rateLimitByUser } from '../../middlewares/rateLimit.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { aiController } from './ai.controller';

const router = Router();
router.use(requireAuth);

// Coach chat — 30 messages per 10 minutes per user
router.post(
    '/chat',
    rateLimitByUser({ windowSeconds: 600, maxRequests: 30, keyPrefix: 'rl:chat' }),
    validate({ message: 'string' }),
    aiController.chat
);

// Urge intervention — 5 per hour (cooldown enforced at Redis level)
router.post(
    '/urge',
    rateLimitByUser({ windowSeconds: 3600, maxRequests: 5, keyPrefix: 'rl:urge' }),
    validate({ trigger: 'string', mood: 'string', intensity: 'number' }),
    aiController.urge
);

// Pattern insights — 10 per hour (cached 1hr anyway)
router.get(
    '/insight',
    rateLimitByUser({ windowSeconds: 3600, maxRequests: 10, keyPrefix: 'rl:insight' }),
    aiController.insight
);

// Message history — no rate limit
router.get('/history', aiController.getHistory);

export default router;