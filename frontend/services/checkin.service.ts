import { request } from "@/lib/request";
import { Checkin } from "@/types";

interface CheckinResponse {
  checkin: Checkin | null;
}

export const checkinService = {
  create: (data: {
    mood: string;
    moodScore: number;
    note?: string;
    didRelapse?: boolean;
  }) => request.post<{ data: CheckinResponse }>('/api/checkins', data),

  today: () => request.get<{ data: CheckinResponse }>('/api/checkins/today'),

  history: (page = 1) => request.get<{ data: { checkins: Checkin[] } }>('/api/checkins/history', { page }),
};