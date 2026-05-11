'use client';
import { useStreak } from '@/hooks/useStreak';
import { StreakCard } from '@/components/dashboard/StreakCard';
import { MoodChart } from '@/components/dashboard/MoodChart';
import { UrgeButton } from '@/components/dashboard/UrgeButton';
import { Card, CardTitle, CardValue } from '@/components/ui/Card';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { dashboard, loading, error } = useStreak();
  const router = useRouter();

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-900 rounded-xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">
          Hey {dashboard?.user.name?.split(' ')[0] ?? 'there'} 👋
        </h1>
        <p className="text-gray-500 text-sm mt-1">Here's how you're doing</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4">
        <StreakCard
          streak={dashboard?.streak ?? 0}
          addiction={dashboard?.activeAddiction ?? null}
        />

        <Card>
          <CardTitle>Relapses this month</CardTitle>
          <CardValue
            className={
              (dashboard?.relapseCount ?? 0) === 0
                ? 'text-green-400'
                : 'text-red-400'
            }
          >
            {dashboard?.relapseCount ?? 0}
          </CardValue>
        </Card>

        <Card onClick={() => router.push('/checkin')}>
          <CardTitle>Today's check-in</CardTitle>
          <CardValue className="text-sm font-normal text-gray-300 mt-1">
            {dashboard?.recentCheckins?.[0]
              ? `${dashboard.recentCheckins[0].mood} ✓`
              : 'Not done yet →'}
          </CardValue>
        </Card>
      </div>

      {/* Mood chart */}
      <MoodChart checkins={dashboard?.recentCheckins ?? []} />

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => router.push('/coach')}
          className="glass rounded-xl p-4 text-left hover:border-violet-500/40 transition-colors"
        >
          <div className="text-2xl mb-2">🧠</div>
          <p className="text-sm font-medium text-white">Talk to AI Coach</p>
          <p className="text-xs text-gray-500 mt-0.5">Get personalized support</p>
        </button>

        <button
          onClick={() => router.push('/insights')}
          className="glass rounded-xl p-4 text-left hover:border-violet-500/40 transition-colors"
        >
          <div className="text-2xl mb-2">📊</div>
          <p className="text-sm font-medium text-white">View Insights</p>
          <p className="text-xs text-gray-500 mt-0.5">See your patterns</p>
        </button>
      </div>

      {/* Urge button */}
      <UrgeButton />
    </div>
  );
}