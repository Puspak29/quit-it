import { Router } from 'express';
import { authController } from './auth.controller';
import { validate } from '../../middlewares/validate.middleware';

const router = Router();

router.post('/register', 
    validate({
        email: 'string',
        password: 'string',
    }), 
    authController.register);
router.post('/login', 
    validate({
        email: 'string',
        password: 'string',
    }), 
    authController.login);
router.post('/logout', authController.logout);

export const authRoutes = router;
