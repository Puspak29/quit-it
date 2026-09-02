'use client';
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  isLoading?: boolean;
  createdAt?: string;
}

const TypingDots = () => (
  <div className="flex items-center gap-1 py-1">
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
        style={{ animationDelay: `${i * 0.15}s`, animationDuration: '0.8s' }}
      />
    ))}
  </div>
);

// Simple markdown-like formatter — bold **text** and line breaks
const formatContent = (text: string): React.ReactNode => {
  const lines = text.split('\n');
  return lines.map((line, i) => {
    const parts = line.split(/\*\*(.*?)\*\*/g);
    return (
      <span key={i}>
        {parts.map((part, j) =>
          j % 2 === 1 ? (
            <strong key={j} className="font-semibold text-white">
              {part}
            </strong>
          ) : (
            part
          )
        )}
        {i < lines.length - 1 && <br />}
      </span>
    );
  });
};

export const MessageBubble = ({
  role,
  content,
  isLoading,
  createdAt,
}: MessageBubbleProps) => {
  const isUser = role === 'user';

  return (
    <div className={cn('flex gap-3', isUser && 'flex-row-reverse')}>
      {/* Avatar */}
      <div
        className={cn(
          'w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm',
          isUser
            ? 'bg-cyan-600 text-white'
            : 'bg-gray-800 border border-gray-700 text-base'
        )}
      >
        {isUser ? 'U' : '🧠'}
      </div>

      {/* Bubble */}
      <div
        className={cn(
          'max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
          isUser
            ? 'bg-cyan-600 text-white rounded-tr-sm'
            : 'bg-gray-900 border border-gray-800 text-gray-200 rounded-tl-sm'
        )}
      >
        {isLoading ? <TypingDots /> : formatContent(content)}

        {/* Timestamp */}
        {!isLoading && createdAt && (
          <p
            className={cn(
              'text-xs mt-1.5',
              isUser ? 'text-cyan-300/60' : 'text-gray-600'
            )}
          >
            {new Date(createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        )}
      </div>
    </div>
  );
};