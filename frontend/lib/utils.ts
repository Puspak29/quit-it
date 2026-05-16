import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatStreak = (days: number): string => {
  if (days === 0) return 'Start today';
  if (days === 1) return '1 day';
  return `${days} days`;
};

export const formatDate = (date: string): string =>
  new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

export const getMoodEmoji = (mood: string): string => {
  const map: Record<string, string> = {
    great: '😄',
    good: '🙂',
    okay: '😐',
    bad: '😔',
    terrible: '😞',
  };
  return map[mood] ?? '😐';
};

export const getAddictionLabel = (type: string): string => {
  const map: Record<string, string> = {
    smoking: 'Smoking',
    porn: 'Pornography',
    alcohol: 'Alcohol',
    social_media: 'Social Media',
    gambling: 'Gambling',
    custom: 'Custom',
  };
  return map[type] ?? type;
};