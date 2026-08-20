import dotenv from 'dotenv';
dotenv.config();

const required = (key: string): string => {
    const value = process.env[key];
    if (!value)
        throw new Error(`Missing required environment variable: ${key}`);
    return value;
};

export const env = {
    get PORT() {
        return process.env.PORT || '3000';
    },
    get NODE_ENV() {
        return process.env.NODE_ENV || 'development';
    },
    get DATABASE_URL() {
        return required('DATABASE_URL');
    },
    get FRONTEND_URL() {
        return required('FRONTEND_URL');
    },

    // JWT Auth
    get JWT_SECRET() {
        return required('JWT_SECRET');
    },
    get JWT_EXPIRES_IN() {
        return process.env.JWT_EXPIRES_IN || '7d';
    },

    // Redis
    get REDIS_URL() {
        return required('UPSTASH_REDIS_REST_URL');
    },
    get REDIS_TOKEN() {
        return required('UPSTASH_REDIS_REST_TOKEN');
    },
    get REDIS_QUEUE_URL() {
        return required('REDIS_QUEUE_URL');
    },

    // AI
    get GEMINI_API_KEY() {
        return required('GEMINI_API_KEY');
    },
    get HF_API_KEY() {
        return required('HF_API_KEY');
    },

    // Firebase
    get FIREBASE_PROJECT_ID() {
        return required('FIREBASE_PROJECT_ID');
    },
    get FIREBASE_CLIENT_EMAIL() {
        return required('FIREBASE_CLIENT_EMAIL');
    },
    get FIREBASE_PRIVATE_KEY() {
        return required('FIREBASE_PRIVATE_KEY');
    },
} as const;
