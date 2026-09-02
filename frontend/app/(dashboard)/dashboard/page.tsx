'use client';
import { useStreak } from '@/hooks/useStreak';
import { StreakCard } from '@/components/dashboard/StreakCard';
import { MoodChart } from '@/components/dashboard/MoodChart';
import { UrgeButton } from '@/components/dashboard/UrgeButton';
import { Card, CardTitle, CardValue } from '@/components/ui/Card';
import { useRouter } from 'next/navigation';
import { motion, Variants } from 'framer-motion';
import { Loader2, BrainCircuit, Activity, CalendarCheck, BarChart3, AlertCircle } from 'lucide-react';
import { getMoodEmoji } from '@/lib/utils';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.4 } }
};

export default function DashboardPage() {
  const { dashboard, loading, error } = useStreak();
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-panel p-8 rounded-2xl flex flex-col items-center justify-center gap-4 text-center">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <div>
          <h2 className="text-xl font-bold text-foreground mb-2">Failed to load dashboard</h2>
          <p className="text-foreground/70 max-w-md">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-foreground tracking-tight flex items-center gap-2">
          Hello there, <span className="text-gradient">{dashboard?.user.name?.split(' ')[0] ?? 'user'}</span>
        </h1>
        <p className="text-foreground/70 text-sm mt-2">Here is your recovery overview for today.</p>
      </motion.div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Streak spans 2 columns on desktop */}
        <motion.div variants={itemVariants} className="md:col-span-2 flex flex-col">
          <StreakCard
            streak={dashboard?.streak ?? 0}
            addiction={dashboard?.activeAddiction ?? null}
          />
        </motion.div>

        {/* Small stats column */}
        <motion.div variants={itemVariants} className="flex flex-col gap-5">
          <Card className="flex-1 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="text-accent" size={18} />
              <CardTitle className="mb-0">Relapses</CardTitle>
            </div>
            <div className="flex items-baseline gap-2">
              <CardValue
                className={(dashboard?.relapseCount ?? 0) === 0 ? 'text-secondary-dark' : 'text-accent'}
              >
                {dashboard?.relapseCount ?? 0}
              </CardValue>
              <span className="text-foreground/50 text-sm">this month</span>
            </div>
          </Card>

          <Card onClick={() => router.push('/checkin')} className="flex-1 flex flex-col justify-center border border-primary/20 hover:border-primary/40 bg-primary/5 group">
            <div className="flex items-center gap-2 mb-3">
              <CalendarCheck className="text-primary group-hover:scale-110 transition-transform" size={18} />
              <CardTitle className="mb-0 text-primary">Daily Check-in</CardTitle>
            </div>
            <CardValue className="text-lg font-medium text-foreground flex items-center gap-2">
              {dashboard?.recentCheckins?.[0] ? (
                <>
                  <span>{getMoodEmoji(dashboard.recentCheckins[0].mood)}</span>
                  <span className="capitalize text-foreground/70 text-base">Done</span>
                </>
              ) : (
                <span className="text-accent">Start Check-in →</span>
              )}
            </CardValue>
          </Card>
        </motion.div>

        {/* Mood Chart spans 2 columns */}
        <motion.div variants={itemVariants} className="md:col-span-2 flex">
          <div className="w-full">
            <MoodChart checkins={dashboard?.recentCheckins ?? []} />
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants} className="flex flex-col gap-5">
          <button
            onClick={() => router.push('/coach')}
            className="flex-1 glass-panel rounded-2xl p-6 text-left hover:border-primary/40 group transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-500">
              <BrainCircuit size={64} />
            </div>
            <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BrainCircuit className="text-primary" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1 relative z-10">AI Coach</h3>
            <p className="text-sm text-foreground/70 relative z-10">Get personalized support 24/7</p>
          </button>

          <button
            onClick={() => router.push('/insights')}
            className="flex-1 glass-panel rounded-2xl p-6 text-left hover:border-secondary/50 group transition-all duration-300 hover:shadow-xl hover:shadow-secondary/20 hover:-translate-y-1 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-500">
              <BarChart3 size={64} />
            </div>
            <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BarChart3 className="text-secondary-dark" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1 relative z-10">Insights</h3>
            <p className="text-sm text-foreground/70 relative z-10">Track progress & triggers</p>
          </button>
        </motion.div>

        {/* Urge Button spans full width */}
        <motion.div variants={itemVariants} className="md:col-span-3 mt-4">
          <UrgeButton />
        </motion.div>

      </div>
    </motion.div>
  );
}