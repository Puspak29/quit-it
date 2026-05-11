'use client';
import { useState } from 'react';
import { useCheckin } from '@/hooks/useCheckin';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { getMoodEmoji } from '@/lib/utils';
import { useRouter } from 'next/navigation';

const MOODS = [
  { value: 'great', score: 5 },
  { value: 'good', score: 4 },
  { value: 'okay', score: 3 },
  { value: 'bad', score: 2 },
  { value: 'terrible', score: 1 },
];

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
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return null;

  if (todayCheckin) {
    return (
      <div className="max-w-lg mx-auto text-center py-16 space-y-4">
        <div className="text-5xl">{getMoodEmoji(todayCheckin.mood)}</div>
        <h2 className="text-xl font-bold text-white">Already checked in today</h2>
        <p className="text-gray-500">
          You logged <span className="text-white">{todayCheckin.mood}</span> today.
          Come back tomorrow.
        </p>
        <Button variant="secondary" onClick={() => router.push('/')}>
          Back to dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Daily check-in</h1>
        <p className="text-gray-500 text-sm mt-1">Takes 30 seconds. Builds streaks.</p>
      </div>

      {/* Mood selection */}
      <Card>
        <p className="text-sm text-gray-400 mb-3">How are you feeling today?</p>
        <div className="flex justify-between">
          {MOODS.map((m) => (
            <button
              key={m.value}
              onClick={() => setMood(m.value)}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all ${
                mood === m.value
                  ? 'bg-violet-900/40 border border-violet-500/40'
                  : 'hover:bg-gray-800'
              }`}
            >
              <span className="text-2xl">{getMoodEmoji(m.value)}</span>
              <span className="text-xs text-gray-400 capitalize">{m.value}</span>
            </button>
          ))}
        </div>
      </Card>

      {/* Relapse toggle */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white">Did you relapse today?</p>
            <p className="text-xs text-gray-500 mt-0.5">
              Honesty helps — no judgment here
            </p>
          </div>
          <button
            onClick={() => setDidRelapse((p) => !p)}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              didRelapse ? 'bg-red-500' : 'bg-gray-700'
            }`}
          >
            <span
              className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                didRelapse ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </Card>

      {/* Note */}
      <Card>
        <p className="text-sm text-gray-400 mb-2">Add a note (optional)</p>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="How did today go? What helped?"
          rows={3}
          className="w-full bg-transparent text-gray-200 text-sm resize-none
            placeholder-gray-600 outline-none"
        />
      </Card>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <Button
        className="w-full"
        size="lg"
        disabled={!mood}
        loading={submitting}
        onClick={handleSubmit}
      >
        Submit check-in
      </Button>
    </div>
  );
}