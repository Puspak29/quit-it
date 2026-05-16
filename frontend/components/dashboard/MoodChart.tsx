'use client';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { Card, CardTitle } from '@/components/ui/Card';
import { Checkin } from '@/types';
import { formatDate, getMoodEmoji } from '@/lib/utils';
import { TrendingUp } from 'lucide-react';

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
      <Card className="col-span-1 md:col-span-2">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="text-violet-500" size={18} />
          <CardTitle className="mb-0">Mood Trend</CardTitle>
        </div>
        <div className="h-40 flex items-center justify-center border border-dashed border-white/10 rounded-xl bg-white/5">
          <p className="text-zinc-500 text-sm font-medium">
            No check-ins yet. Start logging to see your trend!
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="col-span-1 md:col-span-2">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="text-violet-500" size={18} />
        <CardTitle className="mb-0">Mood Trend (Last 7 Days)</CardTitle>
      </div>
      <div className="w-full h-[240px] pl-4 min-h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="date"
              tick={{ fill: '#71717a', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              dy={10}
            />
            <YAxis domain={[1, 5]} hide />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="glass-panel p-3 rounded-xl border border-white/10 shadow-xl">
                      <p className="text-zinc-400 text-xs mb-1">{data.date}</p>
                      <p className="text-zinc-100 font-medium flex items-center gap-2">
                        <span>{getMoodEmoji(data.mood)}</span>
                        <span className="capitalize">{data.mood}</span>
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="score"
              stroke="#8b5cf6"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorScore)"
              activeDot={{ r: 6, fill: '#8b5cf6', stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};