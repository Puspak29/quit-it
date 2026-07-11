'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Flag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CommunityMessage, FlagReason } from '@/types';
import { FlagMenu } from './FlagMenu';

interface CommunityMessageBubbleProps {
  message: CommunityMessage;
  isOwn: boolean;
  onFlag: (messageId: string, reason: FlagReason) => void;
}

export function CommunityMessageBubble({ message, isOwn, onFlag }: CommunityMessageBubbleProps) {
  const [flagOpen, setFlagOpen] = useState(false);
  const isFlagged = message.status === 'FLAGGED';
  const initial = message.user.name?.charAt(0)?.toUpperCase() ?? '?';

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn('flex gap-2.5 group', isOwn && 'flex-row-reverse')}
    >
      {/* Avatar */}
      <div className="w-7 h-7 rounded-full bg-zinc-800 border border-white/10
                      flex items-center justify-center shrink-0 mt-1">
        <span className="text-xs text-zinc-400">{initial}</span>
      </div>

      {/* Body */}
      <div className={cn('flex flex-col gap-1 max-w-[75%]', isOwn && 'items-end')}>
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500 px-1">
            {message.user.name ?? 'Anonymous'}
          </span>
          <span className="text-xs text-zinc-600">
            {new Date(message.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>

        <div
          className={cn(
            'rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
            isOwn
              ? 'bg-violet-500/20 text-white rounded-tr-sm'
              : 'bg-white/5 text-zinc-200 rounded-tl-sm',
            isFlagged && 'opacity-50 italic',
          )}
        >
          {isFlagged ? 'This message is under review.' : message.content}
        </div>
      </div>

      {/* Flag button — only on others' messages */}
      {!isOwn && (
        <div className="relative self-center opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setFlagOpen((v) => !v)}
            className="text-zinc-600 hover:text-rose-400 transition-colors p-1"
            aria-label="Report message"
          >
            <Flag size={13} />
          </button>
          <FlagMenu
            open={flagOpen}
            onFlag={(reason) => onFlag(message.id, reason)}
            onClose={() => setFlagOpen(false)}
          />
        </div>
      )}
    </motion.div>
  );
}