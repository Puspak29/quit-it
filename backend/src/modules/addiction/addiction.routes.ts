import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { addictionController } from './addiction.controller';

const router = Router();
router.use(requireAuth);

router.post(
    '/',
    validate({ type: 'string', goal: 'string' }),
    addictionController.create
);
router.get('/', addictionController.getAll);
router.patch('/:id/status', addictionController.updateStatus);

export default router;