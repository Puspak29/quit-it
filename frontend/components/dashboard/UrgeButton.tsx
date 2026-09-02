'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { aiService } from '@/services/ai.service';
import { AlertTriangle, Flame, ShieldAlert, Sparkles, BrainCircuit } from 'lucide-react';
import { motion } from 'framer-motion';

const MOODS = ['Anxious', 'Bored', 'Stressed', 'Sad', 'Angry'];
const TRIGGERS = ['Loneliness', 'Stress', 'Boredom', 'Social Pressure', 'Habit', 'Other'];

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
      setError('Please select a trigger and mood to proceed');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await aiService.urge({ trigger: trigger.toLowerCase(), mood: mood.toLowerCase(), intensity });
      setResponse(res.data.data.reply);
      setStep('response');
      onResponse?.(res.data.data.reply);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Too many requests. Wait 30 seconds.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => { reset(); setOpen(true); }}
        className="w-full relative group overflow-hidden rounded-2xl bg-zinc-900 border border-red-500/30 p-5 transition-all duration-300 hover:border-red-500/60 hover:shadow-xl hover:shadow-red-500/10"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-rose-500/5 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative z-10 flex items-center justify-center gap-3">
          <div className="p-2 bg-red-500/20 rounded-xl text-red-400 group-hover:scale-110 transition-transform duration-300">
            <AlertTriangle size={24} />
          </div>
          <span className="text-red-400 font-semibold text-lg tracking-wide">I have an urge</span>
        </div>
      </motion.button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={step === 'form' ? "Let's analyze this urge" : "Your Action Plan"}
      >
        {step === 'form' ? (
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                <BrainCircuit size={16} /> What triggered this?
              </label>
              <div className="flex flex-wrap gap-2">
                {TRIGGERS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTrigger(t)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border ${
                      trigger === t
                        ? 'bg-cyan-600 border-cyan-500 text-white shadow-lg shadow-cyan-500/25'
                        : 'bg-zinc-800/50 border-white/5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 hover:border-white/10'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                <Flame size={16} /> How are you feeling?
              </label>
              <div className="flex flex-wrap gap-2">
                {MOODS.map((m) => (
                  <button
                    key={m}
                    onClick={() => setMood(m)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border ${
                      mood === m
                        ? 'bg-cyan-600 border-cyan-500 text-white shadow-lg shadow-cyan-500/25'
                        : 'bg-zinc-800/50 border-white/5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 hover:border-white/10'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                  <ShieldAlert size={16} /> Urge Intensity
                </label>
                <span className="text-cyan-400 font-bold bg-cyan-500/10 px-3 py-1 rounded-lg">
                  {intensity}/10
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                value={intensity}
                onChange={(e) => setIntensity(Number(e.target.value))}
                className="w-full accent-cyan-500 h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-zinc-500">
                <span>Mild</span>
                <span>Severe</span>
              </div>
            </div>

            {error && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20"
              >
                {error}
              </motion.p>
            )}

            <Button
              onClick={handleSubmit}
              loading={loading}
              className="w-full mt-2"
              size="lg"
            >
              Get AI Support Now
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-cyan-900/40 to-purple-900/20 border border-cyan-500/30 rounded-2xl p-5 shadow-xl shadow-cyan-500/10 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-purple-500" />
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-cyan-500/20 rounded-xl">
                  <Sparkles size={20} className="text-cyan-300" />
                </div>
                <h3 className="text-lg font-medium text-cyan-100">AI Coach Advice</h3>
              </div>
              <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">
                {response}
              </p>
            </motion.div>
            
            <div className="flex gap-3">
              <Button
                variant="primary"
                className="flex-1"
                onClick={() => setOpen(false)}
              >
                I've Got This
              </Button>
              <Button
                variant="secondary"
                className="flex-1"
                onClick={reset}
              >
                Ask Again
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};