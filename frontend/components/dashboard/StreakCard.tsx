import { Card } from '@/components/ui/Card';
import { formatStreak, getAddictionLabel } from '@/lib/utils';
import { Addiction } from '@/types';
import { Flame, Sparkles, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface StreakCardProps {
  streak: number;
  addiction: Addiction | null;
}

export const StreakCard = ({ streak, addiction }: StreakCardProps) => {
  const isHighStreak = streak >= 30;
  const isMediumStreak = streak >= 7 && streak < 30;

  const Icon = isHighStreak ? Flame : isMediumStreak ? Zap : Sparkles;
  const colorClass = isHighStreak 
    ? 'text-orange-500 bg-orange-500/10 border-orange-500/20' 
    : isMediumStreak 
      ? 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20' 
      : 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20';

  const glowClass = isHighStreak
    ? 'from-orange-500/20 to-transparent'
    : isMediumStreak
      ? 'from-yellow-500/20 to-transparent'
      : 'from-cyan-500/20 to-transparent';

  return (
    <Card className="col-span-1 md:col-span-2 relative overflow-hidden group">
      {/* Dynamic Background Glow */}
      <div className={`absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br ${glowClass} rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition-opacity duration-500`} />
      
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-zinc-400 tracking-wide uppercase">Current Streak</h3>
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`p-2 rounded-xl border ${colorClass}`}
          >
            <Icon size={20} className={isHighStreak ? 'animate-pulse' : ''} />
          </motion.div>
        </div>

        <div className="flex items-baseline gap-2">
          <motion.span 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="text-5xl md:text-6xl font-bold text-white tracking-tighter"
          >
            {formatStreak(streak).split(' ')[0]}
          </motion.span>
          <span className="text-xl text-zinc-400 font-medium">
            {formatStreak(streak).split(' ').slice(1).join(' ')}
          </span>
        </div>

        {addiction && (
          <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
            <p className="text-zinc-500 text-sm font-medium">
              Fighting <span className="text-zinc-300">{getAddictionLabel(addiction.type)}</span>
            </p>
            <p className="text-zinc-500 text-sm">
              Goal: <span className="text-zinc-300 font-medium">{addiction.goal}</span>
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};