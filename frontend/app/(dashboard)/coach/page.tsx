'use client';
import { useCoach } from '@/hooks/useCoach';
import { ChatWindow } from '@/components/coach/ChatWindow';
import { UrgeButton } from '@/components/dashboard/UrgeButton';

export default function CoachPage() {
    const { messages, loading, historyLoading, error, sendMessage, clearError } =
        useCoach();

    return (
        <div className="flex flex-col md:grid md:grid-cols-3 gap-6 h-full">
            {/* Chat — full width on mobile, 2/3 on desktop */}
            <div className="md:col-span-2 min-h-0">
                <ChatWindow
                    messages={messages}
                    loading={loading}
                    historyLoading={historyLoading}
                    error={error}
                    onSend={sendMessage}
                    onClearError={clearError}
                />
            </div>

            {/* Sidebar — horizontal scroll row on mobile, vertical stack on desktop */}
            <div className="flex flex-row md:flex-col gap-3 md:gap-4 overflow-x-auto md:overflow-visible pb-1 md:pb-0 -mx-1 px-1 hide-scrollbar">
                {/* Urge button */}
                <div className="shrink-0 w-64 md:w-auto">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                        Emergency
                    </p>
                    <UrgeButton
                        onResponse={(msg) => {
                            sendMessage(`I just got this advice for an urge I had: "${msg}". Can you help me follow through?`);
                        }}
                    />
                </div>

                {/* Tips */}
                <div className="glass rounded-xl p-4 space-y-3 shrink-0 w-64 md:w-auto">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">
                        What to ask
                    </p>
                    {[
                        { emoji: '😤', text: 'I feel an urge right now' },
                        { emoji: '📅', text: "Why do I always relapse on weekends?" },
                        { emoji: '🧘', text: 'Give me a 2-minute grounding exercise' },
                        { emoji: '💪', text: "I resisted today — what's next?" },
                        { emoji: '😞', text: 'I relapsed. Help me reset' },
                    ].map(({ emoji, text }) => (
                        <p key={text} className="text-xs text-gray-500">
                            <span className="mr-1.5">{emoji}</span>
                            <span className="italic">"{text}"</span>
                        </p>
                    ))}
                </div>

                {/* Reminder */}
                <div className="glass rounded-xl p-4 shrink-0 w-64 md:w-auto">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                        Remember
                    </p>
                    <p className="text-xs text-gray-400 leading-relaxed">
                        The coach knows your addiction type, current streak, and past
                        triggers. The more specific you are, the better the advice.
                    </p>
                </div>
            </div>
        </div>
    );
}