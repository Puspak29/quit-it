'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { FlagReason } from '@/types';

interface FlagMenuProps {
  open: boolean;
  onFlag: (reason: FlagReason) => void;
  onClose: () => void;
}

const FLAG_OPTIONS: { reason: FlagReason; label: string }[] = [
  { reason: 'SPAM',        label: 'Spam' },
  { reason: 'HATE_SPEECH', label: 'Hate speech' },
  { reason: 'SELF_HARM',   label: 'Self-harm' },
];

/**
 * SRP: renders the flag reason picker dropdown.
 *      No socket/state knowledge — parent passes onFlag callback.
 */
export function FlagMenu({ open, onFlag, onClose }: FlagMenuProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Click-away backdrop */}
          <div className="fixed inset-0 z-10" onClick={onClose} />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 4 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-8 right-0 z-20 bg-zinc-900 border border-white/10
                       rounded-xl p-1.5 flex flex-col gap-0.5 min-w-[140px] shadow-2xl"
          >
            {FLAG_OPTIONS.map(({ reason, label }) => (
              <button
                key={reason}
                onClick={() => { onFlag(reason); onClose(); }}
                className="text-left text-xs text-zinc-300 hover:text-white
                           hover:bg-white/5 px-3 py-2 rounded-lg transition-colors"
              >
                {label}
              </button>
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}