'use client';
import { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const Modal = ({ open, onClose, title, children, className }: ModalProps) => {
  // Close on ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: 'spring', bounce: 0.2, duration: 0.45 }}
            className={cn(
              'relative glass-panel w-full sm:max-w-md z-10',
              'rounded-t-2xl sm:rounded-2xl',
              'p-6 pb-8 sm:pb-6',
              'max-h-[90vh] overflow-y-auto',
              className
            )}
          >
            {/* Drag handle — visible on mobile only */}
            <div className="sm:hidden w-10 h-1 bg-zinc-700 rounded-full mx-auto mb-5" />
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-zinc-100 tracking-tight">{title}</h2>
              <button
                onClick={onClose}
                className="text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50 p-1.5 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};