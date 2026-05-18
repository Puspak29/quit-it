import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth.middleware';
import { userController } from './user.controller';

const router = Router();

router.use(requireAuth);

// router.post('/sync', userController.syncUser);       // called after Clerk sign-up
router.get('/me', userController.getMe);
router.patch('/fcm-token', userController.updateFcmToken);
router.get('/dashboard', userController.getDashboard);

export default router;