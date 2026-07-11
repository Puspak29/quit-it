'use client';
import { useEffect, useState, useCallback, useMemo } from "react";
import { communityService } from "@/services/community.service";
import { useSocket } from "./useSocket";
import { CommunityMessage, MilestoneEvent, FlagReason } from "@/types";

const WS_EVENTS = {
    NEW_MESSAGE: 'community:message',
    MILESTONE: 'community:milestone',
    MESSAGE_HIDDEN: 'community:message:hidden',
    SEND_MESSAGE: 'community:send',
    FLAG_MESSAGE: 'community:flag',
} as const;

const MILESTONE_DISMISS_MS = 6000; // 6 seconds

export interface UseCommunityReturn {
    messages: CommunityMessage[];
    loading: boolean;
    connected: boolean;
    hasMore: boolean;
    milestone: MilestoneEvent | null;
    sendMessage: (content: string) => void;
    flagMessage: (messageId: string, reason: FlagReason) => void;
    loadMore: () => void;
    dismissMilestone: () => void;
}


export function useCommunity(communityId: string | null): UseCommunityReturn {
    const [messages, setMessages] = useState<CommunityMessage[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [nextCursor, setNextCursor] = useState<string | null>(null);
    const [milestone, setMilestone] = useState<MilestoneEvent | null>(null);
    const [connected, setConnected] = useState<boolean>(false);


    // load message history
    const loadMessages = useCallback(async (cursor?: string) => {
        if (!communityId) return;
        setLoading(true);
        try{
            const response = await communityService.getMessages(communityId, cursor);
            const { messages: newMessages, nextCursor: newNextCursor, hasMore: newHasMore } = response.data.data;
            setMessages((prev) => cursor ? [...prev, ...newMessages] : newMessages);
            setNextCursor(newNextCursor);
            setHasMore(newHasMore);
        }
        catch(err){
            console.error('[Community] Failed to load messages:', err);
        }
        finally{
            setLoading(false);
        }
    }, [communityId]);

    useEffect(() => {
        setMessages([]);
        setNextCursor(null);
        setHasMore(false);
        if (communityId) loadMessages();
    }, [communityId, loadMessages]);


    // WebSocket event handlers with memoization
    const events = useMemo(() => ({
        [WS_EVENTS.NEW_MESSAGE]: (message: CommunityMessage) => {
            setMessages((prev) => {
                if(prev.some((msg) => msg.id === message.id)) return prev; // avoid duplicates
                return [message, ...prev];
            });
        },

        [WS_EVENTS.MILESTONE]: (event: MilestoneEvent) => {
            setMilestone(event);
            setTimeout(() => setMilestone(null), MILESTONE_DISMISS_MS);
        },

        [WS_EVENTS.MESSAGE_HIDDEN]: ({ messageId }: { messageId: string }) => {
            setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
        },

    }), []);

    const { emit } = useSocket({
        communityId: communityId || '',
        events,
        onConnect: () => setConnected(true),
        onDisconnect: () => setConnected(false),
    });

    // Actions
    const sendMessage = useCallback((content: string) => {
        if (!communityId || !content.trim()) return;
        emit(WS_EVENTS.SEND_MESSAGE, { communityId, content: content.trim() });
    }, [communityId, emit]);

    const flagMessage = useCallback((messageId: string, reason: FlagReason) => {
        emit(WS_EVENTS.FLAG_MESSAGE, { messageId, reason });
    }, [emit]);

    const loadMore = useCallback(() => {
        if (hasMore && nextCursor && !loading) {
            loadMessages(nextCursor);
        }
    }, [hasMore, nextCursor, loading, loadMessages]);

    const dismissMilestone = useCallback(() => {
        setMilestone(null);
    }, []);

    return {
        messages,
        loading,
        connected,
        hasMore,
        milestone,
        sendMessage,
        flagMessage,
        loadMore,
        dismissMilestone,
    };
}