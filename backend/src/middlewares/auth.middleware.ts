import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { UnauthorizedError } from '../utils/errors';
import { asyncHandler } from '../utils/asyncHandler';

export interface AuthRequest extends Request {
    userId?: string;
}

export const requireAuth = asyncHandler(
    async (
        req: AuthRequest,
        _res: Response,
        next: NextFunction,
    ): Promise<void> => {
        let token = req.cookies?.token;

        if (!token) {
            token = req.headers.authorization?.replace('Bearer ', '');
        }

        if (!token) throw new UnauthorizedError();

        const payload = jwt.verify(token, env.JWT_SECRET) as { sub: string };

        req.userId = payload.sub;
        next();
    },
);
