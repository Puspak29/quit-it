'use client';

import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import {
  Shield,
  BrainCircuit,
  BarChart3,
  Users,
  CheckCircle2,
  Flame,
  ArrowRight,
  Sparkles,
  Heart,
  TrendingUp,
  Clock,
} from 'lucide-react';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' },
  }),
};

const stagger: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const FEATURES = [
  {
    icon: Flame,
    title: 'Streak Tracking',
    description: 'Track your sobriety streaks and celebrate milestones. Visualize your progress with beautiful charts.',
    color: 'text-accent',
    bg: 'bg-accent/10',
  },
  {
    icon: BrainCircuit,
    title: 'AI Recovery Coach',
    description: 'Get 24/7 personalized support from an AI coach that understands your journey and adapts to your needs.',
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    icon: BarChart3,
    title: 'Mood Insights',
    description: 'Track your daily mood and discover patterns. Understand your triggers before they control you.',
    color: 'text-secondary-dark',
    bg: 'bg-secondary/15',
  },
  {
    icon: Users,
    title: 'Community Support',
    description: 'Connect with others on the same path. Share wins, find encouragement, and never feel alone.',
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    icon: Shield,
    title: 'Urge SOS',
    description: 'When cravings hit, tap one button for immediate coping strategies and grounding exercises.',
    color: 'text-secondary-dark',
    bg: 'bg-secondary/15',
  },
  {
    icon: CheckCircle2,
    title: 'Daily Check-ins',
    description: 'Build accountability with quick daily reflections. Journal your thoughts and track your growth.',
    color: 'text-accent',
    bg: 'bg-accent/10',
  },
];

const STATS = [
  { value: '24/7', label: 'AI Support' },
  { value: '100%', label: 'Private & Secure' },
  { value: '0', label: 'Judgment' },
];

export default function LandingPage() {
  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 px-4 sm:px-8">
        {/* Background glows */}
        <div className="absolute top-[-20%] left-[10%] w-[500px] h-[500px] rounded-full bg-primary/15 blur-[150px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[10%] w-[400px] h-[400px] rounded-full bg-secondary/20 blur-[130px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/25 bg-primary/10 text-primary text-sm font-medium mb-8"
          >
            <Sparkles size={14} />
            AI-Powered Recovery
          </motion.div>

          <motion.h1
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.1] mb-6"
          >
            Break free.{' '}
            <span className="text-gradient">Stay free.</span>
          </motion.h1>

          <motion.p
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-lg sm:text-xl text-foreground/70 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Quit-It is your personal recovery companion. Track streaks, understand your moods, chat with an AI coach, and join a supportive community &mdash; all in one place.
          </motion.p>

          <motion.div
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/sign-up"
              className="group flex items-center gap-2 px-8 py-4 text-base font-semibold text-white bg-primary hover:bg-primary-dark rounded-2xl shadow-xl shadow-primary/30 transition-all duration-300 hover:shadow-primary/40 hover:-translate-y-0.5"
            >
              Start Your Journey
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/sign-in"
              className="px-8 py-4 text-base font-medium text-foreground/60 hover:text-foreground border border-foreground/15 hover:border-foreground/30 rounded-2xl transition-all duration-300 backdrop-blur-sm"
            >
              I already have an account
            </Link>
          </motion.div>

          {/* Stats row */}
          <motion.div
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="flex items-center justify-center gap-8 sm:gap-16 mt-16"
          >
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="text-xs sm:text-sm text-foreground/50 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 sm:py-28 px-4 sm:px-8 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-4">
              Everything you need to{' '}
              <span className="text-gradient">reclaim your life</span>
            </h2>
            <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
              Powerful tools designed to support every step of your recovery journey.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {FEATURES.map((feature) => (
              <motion.div
                key={feature.title}
                variants={fadeUp}
                custom={0}
                className="group glass-panel rounded-2xl p-6 hover:border-foreground/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10"
              >
                <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon size={24} className={feature.color} />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-foreground/70 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 sm:py-28 px-4 sm:px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-4">
              Getting started is{' '}
              <span className="text-gradient">simple</span>
            </h2>
            <p className="text-foreground/70 text-lg">
              Three steps to a new beginning.
            </p>
          </motion.div>

          <div className="space-y-8">
            {[
              {
                step: '01',
                icon: Clock,
                title: 'Create your account',
                desc: 'Sign up in seconds. No credit card required. Your data is encrypted and private.',
              },
              {
                step: '02',
                icon: Heart,
                title: 'Set your goals',
                desc: 'Tell us what you\'re working on. We\'ll personalize your dashboard and AI coach to match.',
              },
              {
                step: '03',
                icon: TrendingUp,
                title: 'Track, learn, grow',
                desc: 'Check in daily, chat with your AI coach, and watch your streaks and insights grow over time.',
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex items-start gap-6 glass-panel rounded-2xl p-6 sm:p-8"
              >
                <div className="shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-primary/15 to-accent/15 border border-primary/20 flex items-center justify-center">
                  <item.icon size={24} className="text-primary" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-accent tracking-widest uppercase mb-1">
                    Step {item.step}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">{item.title}</h3>
                  <p className="text-foreground/70 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 sm:py-28 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-4">
              Real people,{' '}
              <span className="text-gradient">real progress</span>
            </h2>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="grid grid-cols-1 md:grid-cols-3 gap-5"
          >
            {[
              {
                quote: 'The AI coach feels like talking to someone who truly gets it. Available whenever I need it, at 3am or 3pm.',
                name: 'Alex M.',
                detail: '90-day streak',
              },
              {
                quote: 'Seeing my mood trends over time helped me realize I relapse more when I skip check-ins. Game changer.',
                name: 'Jordan K.',
                detail: '6 months sober',
              },
              {
                quote: 'The community aspect makes me feel less alone. I can share anonymously and still get real support.',
                name: 'Sam R.',
                detail: '120-day streak',
              },
            ].map((t) => (
              <motion.div
                key={t.name}
                variants={fadeUp}
                custom={0}
                className="glass-panel rounded-2xl p-6 flex flex-col"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-accent fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-foreground/80 text-sm leading-relaxed flex-1 mb-4">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-foreground/10">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xs text-primary font-medium">{t.name.charAt(0)}</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">{t.name}</div>
                    <div className="text-xs text-accent">{t.detail}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 sm:py-28 px-4 sm:px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center relative z-10 glass-panel rounded-3xl p-10 sm:p-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-4">
            Your first step starts here
          </h2>
          <p className="text-foreground/70 text-lg mb-8 max-w-xl mx-auto">
            You don&apos;t have to do this alone. Join thousands who are already on their path to freedom.
          </p>
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 px-10 py-4 text-lg font-semibold text-white bg-primary hover:bg-primary-dark rounded-2xl shadow-xl shadow-primary/30 transition-all duration-300 hover:shadow-primary/40 hover:-translate-y-0.5"
          >
            Get Started for Free
            <ArrowRight size={20} />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
