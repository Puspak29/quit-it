'use client';
import { useState, FormEvent, KeyboardEvent } from 'react';
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';

const MAX_LENGTH = 1000;

interface MessageInputProps {
    onSend: (content: string) => void;
    disabled?: boolean;
    placeholder?: string;
}

export function MessageInput({ onSend, disabled, placeholder }: MessageInputProps) {
    const [draft, setDraft] = useState('');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const trimmed = draft.trim();
        if (!trimmed || disabled) return;
        onSend(trimmed);
        setDraft('');
    };

    // Cmd/Ctrl+Enter to send
    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
            e.preventDefault();
            const trimmed = draft.trim();
            if (trimmed && !disabled) {
                onSend(trimmed);
                setDraft('');
            }
        }
    };

    const remaining = MAX_LENGTH - draft.length;
    const nearLimit = remaining <= 100;

    return (
        <form
            onSubmit={handleSubmit}
            className="glass-panel rounded-2xl p-3 flex items-end gap-3"
        >
            <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value.slice(0, MAX_LENGTH))}
                onKeyDown={handleKeyDown}
                placeholder={disabled ? 'Connecting…' : (placeholder ?? 'Share something with the community…')}
                disabled={disabled}
                rows={1}
                className="flex-1 bg-transparent text-white placeholder:text-zinc-500 outline-none
                   text-sm px-2 resize-none max-h-32 leading-relaxed"
                style={{ height: 'auto' }}
                // Auto-grow textarea
                ref={(el) => {
                    if (el) {
                        el.style.height = 'auto';
                        el.style.height = `${el.scrollHeight}px`;
                    }
                }}
            />

            <div className="flex items-center gap-2 shrink-0">
                {nearLimit && (
                    <span className={cn('text-xs', remaining <= 0 ? 'text-rose-400' : 'text-zinc-500')}>
                        {remaining}
                    </span>
                )}
                <button
                    type="submit"
                    disabled={disabled || !draft.trim()}
                    className="w-9 h-9 rounded-xl bg-violet-500 hover:bg-violet-400
                     disabled:opacity-30 disabled:cursor-not-allowed
                     flex items-center justify-center transition-colors shrink-0"
                    aria-label="Send message"
                >
                    <Send size={15} className="text-white" />
                </button>
            </div>
        </form>
    );
}