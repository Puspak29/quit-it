'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { aiService } from '@/services/ai.service'

const MOODS = ['anxious', 'bored', 'stressed', 'sad', 'angry'];
const TRIGGERS = ['loneliness', 'stress', 'boredom', 'social pressure', 'habit', 'other'];

export const UrgeButton = ({ onResponse }: { onResponse?: (msg: string) => void }) => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<'form' | 'response'>('form');
  const [loading, setLoading] = useState(false);
  const [trigger, setTrigger] = useState('');
  const [mood, setMood] = useState('');
  const [intensity, setIntensity] = useState(5);
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');

  const reset = () => {
    setStep('form');
    setTrigger('');
    setMood('');
    setIntensity(5);
    setResponse('');
    setError('');
  };

  const handleSubmit = async () => {
    if (!trigger || !mood) {
      setError('Please select a trigger and mood');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await aiService.urge({ trigger, mood, intensity });
      setResponse(res.data.reply);
      setStep('response');
      onResponse?.(res.data.reply);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Too many requests. Wait 30 seconds.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => { reset(); setOpen(true); }}
        className="w-full py-4 rounded-xl bg-red-500/10 border border-red-500/30
          hover:bg-red-500/20 hover:border-red-500/50 transition-all duration-200
          text-red-400 font-semibold text-base"
      >
        🚨 I have an urge
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={step === 'form' ? "What's happening?" : "Your action plan"}
      >
        {step === 'form' ? (
          <div className="space-y-4">
            {/* Trigger */}
            <div>
              <p className="text-sm text-gray-400 mb-2">What triggered this?</p>
              <div className="flex flex-wrap gap-2">
                {TRIGGERS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTrigger(t)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      trigger === t
                        ? 'bg-violet-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Mood */}
            <div>
              <p className="text-sm text-gray-400 mb-2">How are you feeling?</p>
              <div className="flex flex-wrap gap-2">
                {MOODS.map((m) => (
                  <button
                    key={m}
                    onClick={() => setMood(m)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      mood === m
                        ? 'bg-violet-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Intensity slider */}
            <div>
              <p className="text-sm text-gray-400 mb-2">
                Urge intensity: <span className="text-white font-medium">{intensity}/10</span>
              </p>
              <input
                type="range"
                min={1}
                max={10}
                value={intensity}
                onChange={(e) => setIntensity(Number(e.target.value))}
                className="w-full accent-violet-500"
              />
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <Button
              onClick={handleSubmit}
              loading={loading}
              className="w-full"
              size="lg"
            >
              Get help now
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-violet-900/20 border border-violet-500/20 rounded-xl p-4">
              <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">
                {response}
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => setOpen(false)}
              >
                I've got this
              </Button>
              <Button
                variant="ghost"
                className="flex-1"
                onClick={reset}
              >
                Ask again
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};