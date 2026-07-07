import { Response, NextFunction } from 'express';
import { redis } from '../config/redis';
import { RateLimitError } from '../utils/errors';
import { AuthRequest } from './auth.middleware';
import { asyncHandler } from '../utils/asyncHandler';

interface RateLimitOptions {
    windowSeconds: number;
    maxRequests: number;
    keyPrefix: string;
}

export const rateLimitByUser = ({
    windowSeconds,
    maxRequests,
    keyPrefix,
}: RateLimitOptions) =>
    asyncHandler(
        async (
            req: AuthRequest,
            _res: Response,
            next: NextFunction,
        ): Promise<void> => {
            const key = `${keyPrefix}:${req.userId}`;
            const current = await redis.incr(key);

            if (current === 1) {
                await redis.expire(key, windowSeconds);
            }

            if (current > maxRequests) {
                return next(new RateLimitError());
            }

            next();
        },
    );
