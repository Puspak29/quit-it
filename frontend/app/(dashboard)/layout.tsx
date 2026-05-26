'use client';
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { LayoutDashboard, CheckSquare, MessageSquare, BarChart3, Loader2, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
// import { useNotification } from '@/hooks/useNotification';

const NAV_ITEMS = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/checkin', label: 'Check-in', icon: CheckSquare },
  { href: '/coach', label: 'AI Coach', icon: MessageSquare },
  { href: '/insights', label: 'Insights', icon: BarChart3 },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Register FCM token
  // useNotification();

  useEffect(() => {

    if (loading) return;
    if (!user) {
      router.push('/sign-in');
      return;
    }

    const checkOnboarding = async () => {
      try {
        const hasAddiction = (user?.addictions?.length ?? 0) > 0;
        if (!hasAddiction && pathname !== '/onboarding') {
          router.push('/onboarding');
        }
      } catch (err) {
        console.error('[Onboarding Check] Failed:', err);
      }
    };

    checkOnboarding();
  }, [loading, user, pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <Loader2 className="w-10 h-10 text-violet-500 animate-spin" />
          <p className="text-zinc-500 text-sm tracking-widest uppercase">Initializing</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <nav className="border-b md:border-b-0 md:border-r border-white/5 glass-panel md:w-64 shrink-0 z-50">
        <div className="p-6 md:sticky md:top-0 md:h-screen flex flex-col">
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <span className="text-white font-bold text-xl leading-none">Q</span>
            </div>
            <span className="text-xl font-bold text-white tracking-tight">Quit-It</span>
          </div>
          
          <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-4 md:pb-0 hide-scrollbar">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <a
                  key={href}
                  href={href}
                  className={cn(
                    "relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 whitespace-nowrap",
                    isActive ? "text-white" : "text-zinc-400 hover:text-zinc-100 hover:bg-white/5"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-white/10 rounded-xl"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <Icon size={18} className={cn("relative z-10", isActive && "text-violet-400")} />
                  <span className="relative z-10 font-medium text-sm">{label}</span>
                </a>
              );
            })}
          </div>

          <div className="mt-auto hidden md:flex pt-8 border-t border-white/5 items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center overflow-hidden">
                <span className="text-xs text-zinc-400">{user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-zinc-200">{user?.name || 'User'}</span>
                <span className="text-xs text-zinc-500 truncate w-32">{user?.email}</span>
              </div>
            </div>
            <button onClick={logout} className="text-zinc-400 hover:text-red-400 transition-colors p-2" title="Log out">
                <LogOut size={16} />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-8 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}