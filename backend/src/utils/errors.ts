import { HTTP_STATUS } from "../config/constants";

export class AppError extends Error {
    constructor( public message: string, public statusCode: number = 500, public isOperational: boolean = true ){
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export class NotFoundError extends AppError {
    constructor(resource = 'Resource') {
        super(`${resource} not found`, HTTP_STATUS.NOT_FOUND);
    }
}

export class UnauthorizedError extends AppError {
    constructor() {
        super('Unauthorized', HTTP_STATUS.UNAUTHORIZED);
    }
}

export class RateLimitError extends AppError {
    constructor() {
        super('Too many requests. Please slow down.', HTTP_STATUS.TOO_MANY_REQUESTS);
    }
}

export class ValidationError extends AppError {
    constructor(message: string) {
        super(message, HTTP_STATUS.BAD_REQUEST);
    }
}

export class ForbiddenError extends AppError {
    constructor(message = 'Forbidden') {
        super(message, HTTP_STATUS.FORBIDDEN);
    }
}

export class ConflictError extends AppError {
    constructor(message: string) {
        super(message, HTTP_STATUS.CONFLICT);
    }
}