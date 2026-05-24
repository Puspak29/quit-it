'use client';
import { useState, useEffect } from 'react';
import { relapseService } from '@/services/relapse.service';
import { aiService } from '@/services/ai.service';
import { Card, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export interface Patterns {
    totalRelapses: number;
    topTriggers: [string, number][];
    topMoods: [string, number][];
    recentRelapses: {
        trigger: string;
        mood: string;
        intensity: number;
        occurredAt: string;
    }[];
}

const InsightCard = ({ text }: { text: string }) => {
    // Parse "Pattern: / Risk: / Action:" format from AI
    const sections = text
        .split('\n')
        .filter(Boolean)
        .map((line) => {
            const colonIdx = line.indexOf(':');
            if (colonIdx === -1) return { label: '', content: line };
            return {
                label: line.slice(0, colonIdx).trim(),
                content: line.slice(colonIdx + 1).trim(),
            };
        });

    return (
        <Card className="space-y-3">
            {sections.map(({ label, content }, i) => (
                <div key={i}>
                    {label && (
                        <span className="text-xs font-semibold uppercase tracking-wider text-violet-400">
                            {label}
                        </span>
                    )}
                    <p className="text-sm text-gray-300 mt-0.5 leading-relaxed">{content}</p>
                </div>
            ))}
        </Card>
    );
};

export default function InsightsPage() {
    const [patterns, setPatterns] = useState<Patterns | null>(null);
    const [insight, setInsight] = useState<string | null>(null);
    const [insightLoading, setInsightLoading] = useState(false);
    const [patternsLoading, setPatternsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPatterns = async () => {
            try {
                const res = await relapseService.patterns();
                setPatterns(res?.data?.data?.patterns ?? null);
            } catch {
                setError('Failed to load patterns');
            } finally {
                setPatternsLoading(false);
            }
        };
        fetchPatterns();
    }, []);

    const fetchInsight = async () => {
        setInsightLoading(true);
        setError('');
        try {
            const res = await aiService.insight();
            setInsight(res.data?.data?.insight);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to generate insight');
        } finally {
            setInsightLoading(false);
        }
    };

    if (patternsLoading) {
        return (
            <div className="space-y-4 animate-pulse">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-32 bg-gray-900 rounded-xl" />
                ))}
            </div>
        );
    }

    const hasData = patterns && patterns.totalRelapses >= 3;

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h1 className="text-2xl font-bold text-white">Pattern Insights</h1>
                <p className="text-gray-500 text-sm mt-1">
                    AI analysis of your relapse patterns
                </p>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4">
                <Card>
                    <CardTitle>Total relapses</CardTitle>
                    <p className="text-3xl font-bold text-white mt-1">
                        {patterns?.totalRelapses ?? 0}
                    </p>
                </Card>

                <Card>
                    <CardTitle>Top trigger</CardTitle>
                    <p className="text-lg font-semibold text-white mt-1 capitalize">
                        {patterns?.topTriggers?.[0]?.[0] ?? '—'}
                    </p>
                    {patterns?.topTriggers?.[0] && (
                        <p className="text-xs text-gray-600 mt-0.5">
                            {patterns.topTriggers[0][1]}x logged
                        </p>
                    )}
                </Card>

                <Card>
                    <CardTitle>Top mood</CardTitle>
                    <p className="text-lg font-semibold text-white mt-1 capitalize">
                        {patterns?.topMoods?.[0]?.[0] ?? '—'}
                    </p>
                    {patterns?.topMoods?.[0] && (
                        <p className="text-xs text-gray-600 mt-0.5">
                            during {patterns.topMoods[0][1]} relapses
                        </p>
                    )}
                </Card>
            </div>

            {/* Trigger breakdown */}
            {patterns?.topTriggers && patterns.topTriggers.length > 0 && (
                <Card>
                    <CardTitle>Trigger frequency</CardTitle>
                    <div className="mt-3 space-y-2">
                        {patterns.topTriggers.map(([trigger, count]) => {
                            const max = patterns.topTriggers[0][1];
                            const pct = Math.round((count / max) * 100);
                            return (
                                <div key={trigger}>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-gray-300 capitalize">{trigger}</span>
                                        <span className="text-gray-500">{count}x</span>
                                    </div>
                                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-violet-500 rounded-full transition-all duration-500"
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Card>
            )}

            {/* AI Insight */}
            <div>
                {!hasData ? (
                    <Card>
                        <p className="text-gray-500 text-sm text-center py-4">
                            Log at least 3 relapses to unlock AI pattern analysis
                        </p>
                    </Card>
                ) : insight ? (
                    <div className="space-y-3">
                        <p className="text-xs text-gray-500 uppercase tracking-wider">
                            AI Analysis
                        </p>
                        <InsightCard text={insight} />
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={fetchInsight}
                            loading={insightLoading}
                        >
                            Refresh analysis
                        </Button>
                    </div>
                ) : (
                    <Card className="text-center py-6 space-y-3">
                        <p className="text-gray-400 text-sm">
                            Ready to analyze your {patterns.totalRelapses} logged relapses
                        </p>
                        {error && <p className="text-red-400 text-xs">{error}</p>}
                        <Button onClick={fetchInsight} loading={insightLoading}>
                            Generate AI insight
                        </Button>
                    </Card>
                )}
            </div>

            {/* Recent relapses */}
            {patterns?.recentRelapses && patterns.recentRelapses.length > 0 && (
                <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">
                        Recent relapses
                    </p>
                    <div className="space-y-2">
                        {patterns.recentRelapses.map((r, i) => (
                            <div
                                key={i}
                                className="glass rounded-xl px-4 py-3 flex items-center justify-between"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm text-white capitalize">{r.trigger}</p>
                                        <p className="text-xs text-gray-500 capitalize">
                                            Feeling {r.mood}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-500">
                                        {new Date(r.occurredAt).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                        })}
                                    </p>
                                    <p className="text-xs text-gray-600">
                                        intensity {r.intensity}/10
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}