import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth.middleware';
import { userController } from './user.controller';
import { asyncHandler } from '../../utils/asyncHandler';

const router = Router();

router.use(requireAuth);

// router.post('/sync', userController.syncUser);       // called after Clerk sign-up
router.get('/me', asyncHandler(userController.getMe));
router.patch('/fcm-token', asyncHandler(userController.updateFcmToken));
router.get('/dashboard', asyncHandler(userController.getDashboard));
router.patch('/profile', asyncHandler(userController.updateProfile));

export default router;
