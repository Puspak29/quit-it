import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../utils/errors';

type Schema = Record<string, 'string' | 'number' | 'boolean' | 'object'>;

export const validate = (schema: Schema) => (req: Request, _res: Response, next: NextFunction): void => {
    for (const [key, type] of Object.entries(schema)) {
        const value = req.body[key];
        if (value === undefined || value === null) {
            return next(new ValidationError(`Missing required field: ${key}`));
        }
        if (typeof value !== type) {
            return next(new ValidationError(`Field '${key}' must be of type ${type}`));
        }
    }
    next();
}; 