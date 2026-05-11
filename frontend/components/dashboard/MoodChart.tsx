'use client';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardTitle } from '@/components/ui/Card';
import { Checkin } from '@/types';
import { formatDate, getMoodEmoji } from '@/lib/utils';

interface MoodChartProps {
  checkins: Checkin[];
}

export const MoodChart = ({ checkins }: MoodChartProps) => {
  const data = [...checkins]
    .reverse()
    .map((c) => ({
      date: formatDate(c.checkedAt),
      score: c.moodScore,
      mood: c.mood,
    }));

  if (data.length === 0) {
    return (
      <Card>
        <CardTitle>Mood Trend</CardTitle>
        <p className="text-gray-600 text-sm mt-4 text-center py-6">
          No check-ins yet — start logging to see your trend
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <CardTitle>Mood Trend (last 7 days)</CardTitle>
      <div className="mt-4 h-40">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis
              dataKey="date"
              tick={{ fill: '#6b7280', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis domain={[1, 5]} hide />
            <Tooltip
              contentStyle={{
                backgroundColor: '#111827',
                border: '1px solid #374151',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              formatter={(val, _, entry) => [
                `${getMoodEmoji(entry.payload.mood)} ${entry.payload.mood}`,
                'Mood',
              ]}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#7c3aed"
              strokeWidth={2}
              dot={{ fill: '#7c3aed', r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};