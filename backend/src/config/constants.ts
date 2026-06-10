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