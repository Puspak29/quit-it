'use client';
import { io, Socket } from 'socket.io-client';
import Cookies from 'js-cookie';
import { useCallback, useEffect, useRef } from 'react';

const WS_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export type SocketEventMap = Record<string, (...args: any[]) => void>;

export interface UseSocketOptions<TEvents extends SocketEventMap> {
    communityId: string;
    events: TEvents;
    onConnect?: () => void;
    onDisconnect?: () => void;
}

export function useSocket<TEvents extends SocketEventMap>({
    communityId,
    events,
    onConnect,
    onDisconnect,
}: UseSocketOptions<TEvents>){
    const socketRef = useRef<Socket | null>(null);
    const emit = useCallback((event: string, payload?: unknown) => {
        socketRef.current?.emit(event, payload);
    }, []);

    useEffect(() => {
        if (!communityId) return;

        const token = Cookies.get('frontend-token');
        if (!token) return;

        const socket = io(WS_URL, {
            auth: { token },
            transports: ['websocket'],
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
        });

        socketRef.current = socket;

        socket.on('connect', () => {
            socket.emit('community:join', communityId );
            onConnect?.();
        });

        socket.on('disconnect', () => {
            onDisconnect?.();
        });

        socket.on('error', (err: { message: string }) => {
            console.error('[WS] Error:', err.message);
        });

        Object.entries(events).forEach(([event, handler]) => {
            socket.on(event, handler);
        });

        return () => {
            Object.keys(events).forEach((event) => {
                socket.off(event);
            });
            socket.disconnect();
            socketRef.current = null;
        }
    }, [ communityId ]);

    return { emit };
}