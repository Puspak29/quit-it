import { Response } from 'express';

type SuccessResponse<T = unknown> = {
    success: true;
    message: string;
    data?: T;
};

type ErrorResponse<E = unknown> = {
    success: false;
    message: string;
    errors?: E;
};


export const sendSuccess = <T>(res: Response, statusCode: number, message: string, data?: T) => {
    const payload: SuccessResponse<T> = { 
        success: true, 
        message 
    };

    if (data !== null) payload.data = data;

    return res.status(statusCode).json(payload);
};

export const sendError = <E>(res: Response, statusCode: number, message: string, errors?: E) => {
    const payload: ErrorResponse<E> = { 
        success: false, 
        message 
    };

    if (errors !== null) payload.errors = errors;
    
    return res.status(statusCode).json(payload);
};