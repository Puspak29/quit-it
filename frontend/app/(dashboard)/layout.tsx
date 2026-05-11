'use client';
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter, usePathname } from 'next/navigation';
import { userService } from '@/services/user.service';
// import { useNotification } from '@/hooks/useNotification';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [synced, setSynced] = useState(false);

  // Register FCM token
  // useNotification();

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      router.push('/sign-in');
      return;
    }

    const sync = async () => {
      try {
        await userService.sync({
          email: user.primaryEmailAddress?.emailAddress ?? '',
          name: user.fullName ?? '',
        });
        setSynced(true);

        // New user — redirect to onboarding
        const me = await userService.me();
        const hasAddiction = me.data.addictions?.length > 0;
        if (!hasAddiction && pathname !== '/onboarding') {
          router.push('/onboarding');
        }
      } catch (err) {
        console.error('[Sync] Failed:', err);
        setSynced(true); // don't block the app on sync failure
      }
    };

    sync();
  }, [isLoaded, isSignedIn, user, pathname, router]);

  if (!isLoaded || !synced) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <nav className="border-b border-gray-800 px-6 py-3 flex items-center justify-between">
        <span className="text-violet-400 font-bold text-lg">Quit-It</span>
        <div className="flex items-center gap-4">
          {[
            { href: '/', label: 'Dashboard' },
            { href: '/checkin', label: 'Check-in' },
            { href: '/coach', label: 'AI Coach' },
            { href: '/insights', label: 'Insights' },
          ].map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className={`text-sm transition-colors ${
                pathname === href
                  ? 'text-violet-400 font-medium'
                  : 'text-gray-400 hover:text-gray-100'
              }`}
            >
              {label}
            </a>
          ))}
        </div>
      </nav>
      <main className="max-w-5xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}