'use client';
import { useState, useCallback, useRef, useEffect } from 'react';
import { aiService } from '@/services/ai.service';
import { AiMessage } from '@/types';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
  isLoading?: boolean;
}

export const useCoach = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Load past messages on mount
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await aiService.history();
        const history: AiMessage[] = res.data.messages;
        setMessages(
          history.map((m) => ({
            id: m.id,
            role: m.role,
            content: m.content,
            createdAt: m.createdAt,
          }))
        );
      } catch {
        // History load failure is non-critical — start fresh
      } finally {
        setHistoryLoading(false);
      }
    };
    loadHistory();
  }, []);

  const sendMessage = useCallback(async (text: string): Promise<void> => {
    if (!text.trim() || loading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      createdAt: new Date().toISOString(),
    };

    // Optimistic UI — add user message + loading bubble immediately
    const loadingMsg: Message = {
      id: 'loading',
      role: 'assistant',
      content: '',
      createdAt: new Date().toISOString(),
      isLoading: true,
    };

    setMessages((prev) => [...prev, userMsg, loadingMsg]);
    setLoading(true);
    setError(null);

    try {
      const res = await aiService.chat(text.trim());
      const reply: string = res.data.reply;

      // Replace loading bubble with real response
      setMessages((prev) =>
        prev.map((m) =>
          m.id === 'loading'
            ? {
                id: `assistant-${Date.now()}`,
                role: 'assistant' as const,
                content: reply,
                createdAt: new Date().toISOString(),
                isLoading: false,
              }
            : m
        )
      );
    } catch (err) {
      // Remove loading bubble on error
      setMessages((prev) => prev.filter((m) => m.id !== 'loading'));
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setLoading(false);
    }
  }, [loading]);

  const clearError = useCallback(() => setError(null), []);

  return {
    messages,
    loading,
    historyLoading,
    error,
    sendMessage,
    clearError,
  };
};