'use client';
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { LayoutDashboard, CheckSquare, MessageSquare, BarChart3, Settings, Loader2, LogOut, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
// import { useNotification } from '@/hooks/useNotification';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/checkin', label: 'Check-in', icon: CheckSquare },
  { href: '/coach', label: 'AI Coach', icon: MessageSquare },
  { href: '/insights', label: 'Insights', icon: BarChart3 },
  { href: '/community',  label: 'Community', icon: Users },
  { href: '/settings', label: 'Settings', icon: Settings },
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
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-foreground/50 text-sm tracking-widest uppercase">Initializing</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <nav className="border-b md:border-b-0 md:border-r border-foreground/10 glass-panel md:w-64 shrink-0 z-50">
        <div className="p-6 md:sticky md:top-0 md:h-screen flex flex-col">
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30">
              <span className="text-white font-bold text-xl leading-none">Q</span>
            </div>
            <span className="text-xl font-bold text-foreground tracking-tight">Quit-It</span>
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
                    isActive ? "text-primary" : "text-foreground/60 hover:text-foreground hover:bg-foreground/5"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-primary/10 rounded-xl"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <Icon size={18} className={cn("relative z-10", isActive && "text-primary")} />
                  <span className="relative z-10 font-medium text-sm">{label}</span>
                </a>
              );
            })}
          </div>

          <div className="mt-auto hidden md:flex pt-8 border-t border-foreground/10 items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 border border-foreground/10 flex items-center justify-center overflow-hidden">
                <span className="text-xs text-primary">{user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-foreground">{user?.name || 'User'}</span>
                <span className="text-xs text-foreground/50 truncate w-32">{user?.email}</span>
              </div>
            </div>
            <button onClick={logout} className="text-foreground/50 hover:text-red-500 transition-colors p-2" title="Log out">
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