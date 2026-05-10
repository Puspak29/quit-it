import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '@clerk/express';
import { env } from '../config/env';
import { UnauthorizedError } from '../utils/errors';

export interface AuthRequest extends Request {
  userId?: string;
}

export const requireAuth = async (req: AuthRequest, _res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) throw new UnauthorizedError();

        const payload = await verifyToken(token, {
        secretKey: env.CLERK_SECRET_KEY,
        });

        req.userId = payload.sub;
        next();
    } catch {
        next(new UnauthorizedError());
    }
};