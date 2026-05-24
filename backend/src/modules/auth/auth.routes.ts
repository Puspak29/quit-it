import { Router } from 'express';
import { authController } from './auth.controller';
import { validate } from '../../middlewares/validate.middleware';
import { asyncHandler } from '../../utils/asyncHandler';

const router = Router();

router.post('/register', 
    validate({
        email: 'string',
        password: 'string',
    }), 
    asyncHandler(authController.register));
router.post('/login', 
    validate({
        email: 'string',
        password: 'string',
    }), 
    asyncHandler(authController.login));
router.post('/logout', asyncHandler(authController.logout));

export const authRoutes = router;
