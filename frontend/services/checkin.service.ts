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
  }) => request.post<{ success: boolean, data: CheckinResponse, message?: string }>('/api/checkins', data),

  today: () => request.get<{ success: boolean, data: CheckinResponse, message?: string }>('/api/checkins/today'),

  history: (page = 1) => request.get<{ success: boolean, data: { checkins: Checkin[] }, message?: string }>('/api/checkins/history', { page }),
};