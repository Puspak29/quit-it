'use client';

import { useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';

import { setupApi } from '@/lib/api';

export function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  const { getToken } = useAuth();

  useEffect(() => {
    setupApi(getToken);
  }, [getToken]);

  return <>{children}</>;
}