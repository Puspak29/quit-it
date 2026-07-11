import { Users, Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Community } from '@/types';

interface CommunityHeaderProps {
  community: Community;
  connected: boolean;
}

export function CommunityHeader({ community, connected }: CommunityHeaderProps) {
  return (
    <div className="glass-panel rounded-2xl p-5 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold text-white">{community.name}</h1>
        {community.description && (
          <p className="text-sm text-zinc-400 mt-0.5">{community.description}</p>
        )}
      </div>

      <div className="flex items-center gap-4 text-sm text-zinc-400">
        <span className="flex items-center gap-1.5">
          <Users size={14} />
          {community.memberCount}
        </span>
        <span
          className={cn(
            'flex items-center gap-1.5 transition-colors',
            connected ? 'text-emerald-400' : 'text-zinc-600',
          )}
        >
          {connected ? <Wifi size={14} /> : <WifiOff size={14} />}
          {connected ? 'Live' : 'Offline'}
        </span>
      </div>
    </div>
  );
}