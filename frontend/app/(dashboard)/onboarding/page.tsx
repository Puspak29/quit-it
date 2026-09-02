'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addictionService } from '@/services/addiction.service';
import { Button } from '@/components/ui/Button';
import { AddictionType } from '@/types';

const ADDICTION_OPTIONS: { value: AddictionType; label: string; emoji: string }[] = [
  { value: 'smoking', label: 'Smoking', emoji: '🚬' },
  { value: 'porn', label: 'Pornography', emoji: '🔞' },
  { value: 'alcohol', label: 'Alcohol', emoji: '🍺' },
  { value: 'social_media', label: 'Social Media', emoji: '📱' },
  { value: 'gambling', label: 'Gambling', emoji: '🎰' },
  { value: 'custom', label: 'Other', emoji: '✏️' },
];

const TRIGGER_OPTIONS = [
  'stress', 'boredom', 'loneliness', 'anxiety',
  'social pressure', 'habit', 'sleep deprivation', 'anger',
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [type, setType] = useState<AddictionType | ''>('');
  const [goal, setGoal] = useState<'quit' | 'reduce' | ''>('');
  const [triggers, setTriggers] = useState<string[]>([]);

  const toggleTrigger = (t: string) => {
    setTriggers((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );
  };

  const handleSubmit = async () => {
    if (!type || !goal) return;
    setLoading(true);
    setError('');
    try {
      await addictionService.create({ type, goal, triggers });
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto py-12">
      {/* Progress */}
      <div className="flex gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`h-1 flex-1 rounded-full transition-colors ${
              s <= step ? 'bg-cyan-500' : 'bg-gray-800'
            }`}
          />
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white">What are you working on?</h2>
            <p className="text-gray-500 text-sm mt-1">
              Select the addiction you want to overcome
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {ADDICTION_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setType(opt.value)}
                className={`glass rounded-xl p-4 text-left transition-all ${
                  type === opt.value
                    ? 'border-cyan-500 bg-cyan-900/20'
                    : 'hover:border-gray-700'
                }`}
              >
                <div className="text-2xl mb-2">{opt.emoji}</div>
                <p className="text-sm font-medium text-white">{opt.label}</p>
              </button>
            ))}
          </div>
          <Button
            className="w-full"
            size="lg"
            disabled={!type}
            onClick={() => setStep(2)}
          >
            Continue
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white">What's your goal?</h2>
            <p className="text-gray-500 text-sm mt-1">Be honest — both are valid</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'quit', label: 'Quit completely', emoji: '🛑', desc: 'Full stop' },
              { value: 'reduce', label: 'Cut back', emoji: '📉', desc: 'More control' },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setGoal(opt.value as 'quit' | 'reduce')}
                className={`glass rounded-xl p-5 text-left transition-all ${
                  goal === opt.value
                    ? 'border-cyan-500 bg-cyan-900/20'
                    : 'hover:border-gray-700'
                }`}
              >
                <div className="text-3xl mb-3">{opt.emoji}</div>
                <p className="font-medium text-white">{opt.label}</p>
                <p className="text-xs text-gray-500 mt-1">{opt.desc}</p>
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button className="flex-1" disabled={!goal} onClick={() => setStep(3)}>
              Continue
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white">What triggers you?</h2>
            <p className="text-gray-500 text-sm mt-1">
              Select all that apply — helps the AI personalize support
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {TRIGGER_OPTIONS.map((t) => (
              <button
                key={t}
                onClick={() => toggleTrigger(t)}
                className={`px-4 py-2 rounded-full text-sm transition-all ${
                  triggers.includes(t)
                    ? 'bg-cyan-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => setStep(2)}>
              Back
            </Button>
            <Button
              className="flex-1"
              loading={loading}
              onClick={handleSubmit}
            >
              Start my recovery
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}