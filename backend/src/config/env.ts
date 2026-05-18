import dotenv from 'dotenv';
dotenv.config();

const required = (key: string): string => {
    const value = process.env[key];
    if (!value) throw new Error(`Missing required environment variable: ${key}`);
    return value;
}

export const env = {
    PORT: process.env.PORT || '3000',
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE_URL: required('DATABASE_URL'),
    FRONTEND_URL: required('FRONTEND_URL'),

    // JWT Auth
    JWT_SECRET: required('JWT_SECRET'),
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',

    // Redis
    REDIS_URL: required('UPSTASH_REDIS_REST_URL'),
    REDIS_TOKEN: required('UPSTASH_REDIS_REST_TOKEN'),

    // AI 
    GEMINI_API_KEY: required('GEMINI_API_KEY'),
    HF_API_KEY: required('HF_API_KEY'),

    // Firebase
    FIREBASE_PROJECT_ID: required('FIREBASE_PROJECT_ID'),
    FIREBASE_CLIENT_EMAIL: required('FIREBASE_CLIENT_EMAIL'),
    FIREBASE_PRIVATE_KEY: required('FIREBASE_PRIVATE_KEY')
} as const;