export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER: 500,
    BAD_GATEWAY: 502,
} as const;

export const WS_EVENTS = {
    // server → client
    NEW_MESSAGE: 'community:message',
    MILESTONE: 'community:milestone',
    MESSAGE_HIDDEN: 'community:message:hidden',
    // client → server
    JOIN_COMMUNITY: 'community:join',
    SEND_MESSAGE: 'community:send',
    FLAG_MESSAGE: 'community:flag',
} as const;

export const MILESTONE_DAYS = [7, 30, 90, 180, 365] as const;
export type MilestoneDays = (typeof MILESTONE_DAYS)[number];

export const ADDICTION_TYPES = [
    'smoking',
    'alcohol',
    'porn',
    'social_media',
    'gambling',
    'custom',
] as const;
export type AddictionType = (typeof ADDICTION_TYPES)[number];

export const CACHE_TTL = {
    USER: 60,
    DASHBOARD: 120,
    PATTERNS: 300,
    INSIGHT: 3600,
    COMMUNITY_MESSAGES: 30,
} as const;

export const COMMUNITY_MSG_MAX_LENGTH = 1000;
export const PAGE_SIZE_DEFAULT = 20;
export const PAGE_SIZE_MAX = 50;
