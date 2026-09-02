'use client';
import { useState } from 'react';
import { useCheckin } from '@/hooks/useCheckin';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { getMoodEmoji } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { motion, Variants } from 'framer-motion';
import { CheckCircle2, AlertTriangle, PenLine, CalendarCheck } from 'lucide-react';

const MOODS = [
  { value: 'great', score: 5 },
  { value: 'good', score: 4 },
  { value: 'okay', score: 3 },
  { value: 'bad', score: 2 },
  { value: 'terrible', score: 1 },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.4 } }
};

export default function CheckinPage() {
  const { todayCheckin, loading, submitCheckin } = useCheckin();
  const router = useRouter();

  const [mood, setMood] = useState('');
  const [note, setNote] = useState('');
  const [didRelapse, setDidRelapse] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!mood) return;
    const moodScore = MOODS.find((m) => m.value === mood)?.score ?? 3;
    setSubmitting(true);
    setError('');
    try {
      await submitCheckin({ mood, moodScore, note, didRelapse });
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit check-in. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );

  if (todayCheckin) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg mx-auto text-center py-16 space-y-6"
      >
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-secondary/25 blur-2xl rounded-full" />
          <CheckCircle2 className="w-24 h-24 text-secondary-dark relative z-10 mx-auto" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground tracking-tight">You're all set!</h2>
          <p className="text-foreground/70">
            You logged <span className="text-foreground font-medium capitalize">{todayCheckin.mood}</span> today. 
            Consistency is key. Come back tomorrow!
          </p>
        </div>
        <Button variant="secondary" onClick={() => router.push('/dashboard')} className="mt-8">
          Back to Dashboard
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="max-w-xl mx-auto space-y-6 pb-20"
    >
      <motion.div variants={itemVariants} className="text-center md:text-left">
        <h1 className="text-3xl font-bold text-foreground tracking-tight flex items-center justify-center md:justify-start gap-2">
          <CalendarCheck className="text-primary" />
          Daily Check-in
        </h1>
        <p className="text-foreground/70 text-sm mt-2">Takes 30 seconds. Builds lifelong habits.</p>
      </motion.div>

      {/* Mood selection */}
      <motion.div variants={itemVariants}>
        <Card className="border-foreground/10">
          <p className="text-sm font-medium text-foreground/80 mb-4 tracking-wide">How are you feeling today?</p>
          <div className="grid grid-cols-5 gap-2">
            {MOODS.map((m) => {
              const isSelected = mood === m.value;
              return (
                <button
                  key={m.value}
                  onClick={() => setMood(m.value)}
                  className={`relative flex flex-col items-center gap-2 p-3 sm:p-4 rounded-xl transition-all duration-300 ${
                    isSelected
                      ? 'bg-primary/15 border border-primary/50 shadow-[0_0_20px_rgba(199,161,107,0.25)]'
                      : 'bg-white/5 border border-foreground/10 hover:bg-white/10 hover:border-foreground/25'
                  }`}
                >
                  {isSelected && (
                    <motion.div 
                      layoutId="mood-active"
                      className="absolute inset-0 bg-primary/10 rounded-xl"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="text-3xl sm:text-4xl relative z-10 transition-transform duration-300 group-hover:scale-110">
                    {getMoodEmoji(m.value)}
                  </span>
                  <span className={`text-xs font-medium relative z-10 capitalize ${isSelected ? 'text-primary' : 'text-foreground/50'}`}>
                    {m.value}
                  </span>
                </button>
              );
            })}
          </div>
        </Card>
      </motion.div>

      {/* Note */}
      <motion.div variants={itemVariants}>
        <Card className="border-foreground/10 group focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/40 transition-all">
          <p className="text-sm font-medium text-foreground/80 mb-3 tracking-wide flex items-center gap-2">
            <PenLine size={16} className="text-foreground/40" />
            Add a note <span className="text-foreground/40 font-normal">(optional)</span>
          </p>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What triggered your mood? What helped you stay strong?"
            rows={3}
            className="w-full bg-transparent text-foreground text-sm resize-none placeholder-foreground/40 outline-none"
          />
        </Card>
      </motion.div>

      {/* Relapse toggle */}
      <motion.div variants={itemVariants}>
        <Card className={`border transition-colors duration-300 ${didRelapse ? 'border-red-500/30 bg-red-500/5' : 'border-foreground/10'}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium flex items-center gap-2 text-foreground">
                <AlertTriangle size={16} className={didRelapse ? 'text-red-500' : 'text-foreground/40'} />
                Did you relapse today?
              </p>
              <p className="text-xs text-foreground/50 mt-1">
                Honesty helps the AI coach understand your journey — no judgment here.
              </p>
            </div>
            <button
              onClick={() => setDidRelapse((p) => !p)}
              className={`relative w-14 h-8 rounded-full transition-colors duration-300 shrink-0 ${
                didRelapse ? 'bg-red-500 shadow-lg shadow-red-500/20' : 'bg-foreground/20'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 ${
                  didRelapse ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </Card>
      </motion.div>

      {error && (
        <motion.div variants={itemVariants} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <p className="text-red-500 text-sm bg-red-500/10 border border-red-500/20 p-3 rounded-xl">
            {error}
          </p>
        </motion.div>
      )}

      <motion.div variants={itemVariants}>
        <Button
          className="w-full h-14 text-lg font-semibold shadow-xl shadow-primary/25"
          disabled={!mood}
          loading={submitting}
          onClick={handleSubmit}
        >
          {submitting ? 'Saving Check-in...' : 'Complete Check-in'}
        </Button>
      </motion.div>
    </motion.div>
  );
}