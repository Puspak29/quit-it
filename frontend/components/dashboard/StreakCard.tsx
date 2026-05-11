import { Card, CardTitle, CardValue } from '@/components/ui/Card';
import { formatStreak, getAddictionLabel } from '@/lib/utils';
import { Addiction } from '@/types';

interface StreakCardProps {
  streak: number;
  addiction: Addiction | null;
}

export const StreakCard = ({ streak, addiction }: StreakCardProps) => {
  const flame = streak >= 30 ? '🔥' : streak >= 7 ? '⚡' : '✨';

  return (
    <Card className="col-span-2">
      <CardTitle>Current Streak</CardTitle>
      <div className="flex items-end gap-3 mt-1">
        <CardValue className="text-4xl">{formatStreak(streak)}</CardValue>
        <span className="text-3xl mb-1">{flame}</span>
      </div>
      {addiction && (
        <p className="text-gray-500 text-sm mt-2">
          {getAddictionLabel(addiction.type)} · Goal: {addiction.goal}
        </p>
      )}
    </Card>
  );
};