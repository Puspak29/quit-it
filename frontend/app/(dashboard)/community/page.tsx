'use client';
import { useState, useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCommunity } from '@/hooks/useCommunity';
import { communityService } from '@/services/community.service';
import { Community, FlagReason } from '@/types';
import { CommunityHeader } from '@/components/community/CommunityHeader';
import { MilestoneToast } from '@/components/community/MilestoneToast';
import { CommunityMessageBubble } from '@/components/community/CommunityMessageBubble';
import { MessageInput } from '@/components/community/MessageInput';

export default function CommunityPage() {
  const { user } = useAuth();
  const [community, setCommunity] = useState<Community | null>(null);
  const [communityLoading, setCommunityLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  const addictionType = user?.addictions?.find((a) => a.status === 'ACTIVE')?.type ?? null;
  const communityId = community?.id ?? null;

  const {
    messages,
    loading,
    connected,
    hasMore,
    milestone,
    sendMessage,
    flagMessage,
    loadMore,
    dismissMilestone,
  } = useCommunity(communityId);

  // Fetch the community that matches the user's active addiction
  useEffect(() => {
    if (!addictionType) { setCommunityLoading(false); return; }

    setCommunityLoading(true);
    communityService
      .listAll()
      .then((res) => {
        const match = res.data.data.communities.find(
          (c) => c.addictionType === addictionType,
        );
        setCommunity(match ?? null);
      })
      .catch(console.error)
      .finally(() => setCommunityLoading(false));
  }, [addictionType]);

  // Auto-join if user is not a member yet
  useEffect(() => {
    if (!community || community.isMember) return;
    communityService.join(community.id).catch(console.error);
  }, [community?.id, community?.isMember]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  if (communityLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
      </div>
    );
  }

  if (!community) {
    return (
      <div className="glass-panel rounded-2xl p-10 text-center">
        <p className="text-zinc-400">
          No community found for your addiction type. Create an active addiction to join one.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] gap-4">
      <CommunityHeader community={community} connected={connected} />

      <MilestoneToast milestone={milestone} onDismiss={dismissMilestone} />

      {/* Message list — reversed so newest is at bottom */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1">
        {hasMore && (
          <button
            onClick={loadMore}
            disabled={loading}
            className="self-center text-xs text-zinc-500 hover:text-zinc-300
                       py-2 px-4 transition-colors disabled:opacity-50"
          >
            {loading ? 'Loading…' : 'Load earlier messages'}
          </button>
        )}

        {[...messages].reverse().map((msg) => (
          <CommunityMessageBubble
            key={msg.id}
            message={msg}
            isOwn={msg.user.id === user?.id}
            onFlag={(messageId: string, reason: FlagReason) => flagMessage(messageId, reason)}
          />
        ))}

        <div ref={bottomRef} />
      </div>

      <MessageInput
        onSend={sendMessage}
        disabled={!connected}
      />
    </div>
  );
}