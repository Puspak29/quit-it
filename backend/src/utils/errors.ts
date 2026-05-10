export class AppError extends Error {
    constructor( public message: string, public statusCode: number = 500, public isOperational: boolean = true ){
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export class NotFoundError extends AppError {
    constructor(resource = 'Resource') {
        super(`${resource} not found`, 404);
    }
}

export class UnauthorizedError extends AppError {
    constructor() {
        super('Unauthorized', 401);
    }
}

export class RateLimitError extends AppError {
    constructor() {
        super('Too many requests. Please slow down.', 429);
    }
}

export class ValidationError extends AppError {
    constructor(message: string) {
        super(message, 400);
    }
}