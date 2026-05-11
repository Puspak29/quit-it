'use client';
import { useState, useEffect, useCallback } from 'react';
import { Checkin } from '@/types';
import { checkinService } from '@/services/checkin.service';

export const useCheckin = () => {
  const [todayCheckin, setTodayCheckin] = useState<Checkin | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchToday = useCallback(async () => {
    try {
      const res = await checkinService.today();
      setTodayCheckin(res.data?.checkin);
    } catch {
      setTodayCheckin(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchToday();
  }, [fetchToday]);

  const submitCheckin = async (data: {
    mood: string;
    moodScore: number;
    note?: string;
    didRelapse?: boolean;
  }) => {
    const res = await checkinService.create(data);
    setTodayCheckin(res.data?.checkin);
    return res.data?.checkin;
  };

  return { todayCheckin, loading, submitCheckin, refetch: fetchToday };
};