import { Server as HttpServer } from 'http';
import { Server as IOServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { env } from './env';
import { prisma } from './db';
import { WS_EVENTS, COMMUNITY_MSG_MAX_LENGTH } from '../config/constants';
import { communityEvents } from '../events/community.events';

let io: IOServer;

export function getIO(): IOServer {
    if (!io) throw new Error('[Socket] getIO() called before initSocket()');
    return io;
}

async function authenticateSocket(
    socket: Socket,
    next: (err?: Error) => void,
): Promise<void> {
    try {
        const token =
            socket.handshake.auth?.token ??
            socket.handshake.headers?.authorization?.replace('Bearer ', '');

        if (!token) throw new Error('No token provided');

        const payload = jwt.verify(token, env.JWT_SECRET) as { sub: string };

        // Attach userId to socket for use in event handlers
        (socket as any).userId = payload.sub;
        next();
    } catch {
        next(new Error('Authentication failed'));
    }
}

// verify community membership
async function verifyMembership(userId: string, communityId: string): Promise<boolean> {
    const member = await prisma.communityMember.findUnique({
        where: { userId_communityId: { userId, communityId } },
    });
    return member !== null;
}

async function handleJoin(socket: Socket, communityId: string): Promise<void> {
    const userId = (socket as any).userId as string;
    const isMember = await verifyMembership(userId, communityId);

    if (!isMember) {
        socket.emit('error', { message: 'Not a member of this community' });
        return;
    }

    await socket.join(`community:${communityId}`);
    console.log(`[WS] User ${userId} joined community ${communityId}`);
}

async function handleSendMessage(
    socket: Socket,
    payload: { communityId: string; content: string },
): Promise<void> {
    const userId = (socket as any).userId as string;

    if (!payload.content?.trim()) return;
    if (payload.content.length > COMMUNITY_MSG_MAX_LENGTH) {
        socket.emit('error', { message: `Message too long (max ${COMMUNITY_MSG_MAX_LENGTH} characters)` });
        return;
    }

    const isMember = await verifyMembership(userId, payload.communityId);
    if (!isMember) {
        socket.emit('error', { message: 'Not a member of this community' });
        return;
    }

    // Fetch community to get addictionType for the event payload
    const community = await prisma.community.findUnique({
        where: { id: payload.communityId },
        select: { addictionType: true },
    });
    if (!community) return;

    const message = await prisma.communityMessage.create({
        data: {
            communityId: payload.communityId,
            userId,
            content: payload.content.trim(),
        },
        include: { user: { select: { id: true, name: true } } },
    });

    // Broadcast to the room immediately
    io.to(`community:${payload.communityId}`).emit(WS_EVENTS.NEW_MESSAGE, {
        id: message.id,
        content: message.content,
        createdAt: message.createdAt,
        user: message.user,
    });

    // Fire event — moderation, milestone, and mention jobs are queued asynchronously
    communityEvents.emit('message:created', {
        messageId: message.id,
        communityId: payload.communityId,
        userId,
        content: message.content,
        addictionType: community.addictionType,
    });
}

async function handleFlagMessage(
    socket: Socket,
    payload: { messageId: string; reason: 'SPAM' | 'HATE_SPEECH' | 'SELF_HARM' },
): Promise<void> {
    const userId = (socket as any).userId as string;

    const message = await prisma.communityMessage.findUnique({
        where: { id: payload.messageId },
        select: { id: true, communityId: true, content: true, status: true },
    });
    if (!message || message.status === 'HIDDEN') return;

    // Prevent duplicate flags from the same user
    const existing = await prisma.moderationFlag.findFirst({
        where: { messageId: payload.messageId, flaggedBy: userId },
    });
    if (existing) return;

    communityEvents.emit('message:flagged', {
        messageId: payload.messageId,
        communityId: message.communityId,
        content: message.content,    // passed in — no re-fetch needed in event handler
        reporterId: userId,
        reason: payload.reason,
    });
}

// Init
export function initSocket(httpServer: HttpServer): IOServer {
    io = new IOServer(httpServer, {
        cors: { origin: env.FRONTEND_URL },
        pingTimeout: 60000,
        pingInterval: 25000,
    });

    io.use(authenticateSocket);

    io.on('connection', (socket) => {
        console.log(`[WS] Client connected: ${socket.id}`);

        socket.on(WS_EVENTS.JOIN_COMMUNITY, (communityId: string) =>
            handleJoin(socket, communityId),
        );

        socket.on(WS_EVENTS.SEND_MESSAGE, (payload) =>
            handleSendMessage(socket, payload),
        );

        socket.on(WS_EVENTS.FLAG_MESSAGE, (payload) =>
            handleFlagMessage(socket, payload),
        );

        socket.on('disconnect', (reason) => {
            console.log(`[WS] Client ${socket.id} disconnected: ${reason}`);
        });
    });

    return io;
}