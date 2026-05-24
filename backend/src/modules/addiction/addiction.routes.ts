import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { addictionController } from './addiction.controller';
import { asyncHandler } from '../../utils/asyncHandler';

const router = Router();
router.use(requireAuth);

router.post(
    '/',
    validate({ type: 'string', goal: 'string' }),
    asyncHandler(addictionController.create)
);
router.get('/', asyncHandler(addictionController.getAll));
router.patch('/:id/status', asyncHandler(addictionController.updateStatus));

export default router;