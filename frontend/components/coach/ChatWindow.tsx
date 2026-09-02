'use client';
import { useRef, useEffect, useState, KeyboardEvent } from 'react';
import { MessageBubble } from './MessageBubble';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
  isLoading?: boolean;
}

interface ChatWindowProps {
  messages: Message[];
  loading: boolean;
  historyLoading: boolean;
  error: string | null;
  onSend: (text: string) => void;
  onClearError: () => void;
}

const QUICK_PROMPTS = [
  "I'm struggling today",
  "Give me a coping strategy",
  "How do I handle cravings?",
  "I need motivation",
];

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center h-full text-center px-6">
    <div className="text-5xl mb-4">🧠</div>
    <h3 className="text-white font-semibold mb-2">Your AI Recovery Coach</h3>
    <p className="text-gray-500 text-sm max-w-xs">
      I know your addiction, triggers, and streak. Ask me anything — I give
      specific, actionable advice, not generic tips.
    </p>
  </div>
);

export const ChatWindow = ({
  messages,
  loading,
  historyLoading,
  error,
  onSend,
  onClearError,
}: ChatWindowProps) => {
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || loading) return;
    onSend(input);
    setInput('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Send on Enter, newline on Shift+Enter
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const showEmptyState = !historyLoading && messages.length === 0;
  const showQuickPrompts = messages.length === 0 && !historyLoading;

  return (
    <div className="flex flex-col h-[60vh] md:h-[calc(100vh-12rem)] glass rounded-2xl overflow-hidden">

      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-800 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-cyan-600/20 border border-cyan-500/30
          flex items-center justify-center text-lg">
          🧠
        </div>
        <div>
          <p className="text-sm font-semibold text-white">AI Recovery Coach</p>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <p className="text-xs text-gray-500">Online · Knows your profile</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {historyLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={cn(
                  'h-12 bg-gray-900 rounded-2xl animate-pulse',
                  i % 2 === 0 ? 'w-3/4' : 'w-1/2 ml-auto'
                )}
              />
            ))}
          </div>
        ) : showEmptyState ? (
          <EmptyState />
        ) : (
          messages.map((m) => (
            <MessageBubble
              key={m.id}
              role={m.role}
              content={m.content}
              isLoading={m.isLoading}
              createdAt={m.createdAt}
            />
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Error bar */}
      {error && (
        <div className="mx-4 mb-2 px-4 py-2 bg-red-900/30 border border-red-500/30
          rounded-lg flex items-center justify-between">
          <p className="text-red-400 text-xs">{error}</p>
          <button
            onClick={onClearError}
            className="text-red-400 hover:text-red-300 text-xs ml-3"
          >
            ✕
          </button>
        </div>
      )}

      {/* Quick prompts — only shown on empty chat */}
      {showQuickPrompts && (
        <div className="px-4 pb-2 flex gap-2 overflow-x-auto flex-nowrap md:flex-wrap"
          style={{ scrollbarWidth: 'none' }}>
          {QUICK_PROMPTS.map((p) => (
            <button
              key={p}
              onClick={() => onSend(p)}
              className="shrink-0 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-400
                hover:text-gray-200 rounded-full text-xs transition-colors"
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Input area */}
      <div className="px-4 pb-4 pt-2 border-t border-gray-800">
        <div className="flex gap-2 items-end bg-gray-900 rounded-xl
          border border-gray-700 focus-within:border-cyan-500/50 transition-colors px-3 py-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask your coach anything..."
            rows={1}
            disabled={loading}
            className="flex-1 bg-transparent text-sm text-gray-200 placeholder-gray-600
              resize-none outline-none max-h-32 leading-relaxed py-1 disabled:opacity-50"
            style={{ scrollbarWidth: 'none' }}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            loading={loading}
            size="sm"
            className="flex-shrink-0 mb-0.5"
          >
            Send
          </Button>
        </div>
        <p className="hidden sm:block text-xs text-gray-700 mt-1.5 text-center">
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
};