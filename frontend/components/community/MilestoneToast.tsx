'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, X } from 'lucide-react';
import { MilestoneEvent } from '@/types';

interface MilestoneToastProps {
  milestone: MilestoneEvent | null;
  onDismiss: () => void;
}

export function MilestoneToast({ milestone, onDismiss }: MilestoneToastProps) {
  return (
    <AnimatePresence>
      {milestone && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ type: 'spring', bounce: 0.3, duration: 0.4 }}
          className="mb-3 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20
                     flex items-center gap-3 text-amber-200"
        >
          <Trophy size={18} className="text-amber-400 shrink-0" />
          <span className="text-sm font-medium flex-1">{milestone.message}</span>
          <button
            onClick={onDismiss}
            className="text-amber-400/60 hover:text-amber-300 transition-colors"
            aria-label="Dismiss"
          >
            <X size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}