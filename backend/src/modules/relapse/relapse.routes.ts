import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { relapseController } from './relapse.controller';

const router = Router();
router.use(requireAuth);

router.post(
    '/',
    validate({ addictionId: 'string', trigger: 'string', mood: 'string', intensity: 'number' }),
    relapseController.log
);
router.get('/', relapseController.getAll);
router.get('/patterns', relapseController.getPatterns);

export default router;