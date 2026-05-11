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
  }) => request.post<CheckinResponse>('/api/checkins', data),

  today: () => request.get<CheckinResponse>('/api/checkins/today'),

  history: (page = 1) => request.get('/api/checkins/history', { page }),
};