import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { relapseController } from './relapse.controller';
import { asyncHandler } from '../../utils/asyncHandler';

const router = Router();
router.use(requireAuth);

router.post(
    '/',
    validate({
        addictionId: 'string',
        trigger: 'string',
        mood: 'string',
        intensity: 'number',
    }),
    asyncHandler(relapseController.log),
);
router.get('/', asyncHandler(relapseController.getAll));
router.get('/patterns', asyncHandler(relapseController.getPatterns));

export default router;
