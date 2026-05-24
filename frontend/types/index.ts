export interface User {
  id: string;
  email: string;
  name: string | null;
}

export interface Addiction {
  id: string;
  userId: string;
  type: string;
  goal: 'quit' | 'reduce';
  triggers: string[];
  status: 'ACTIVE' | 'PAUSED' | 'COMPLETED';
  startDate: string;
  metadata?: Record<string, unknown>;
}

export interface Relapse {
  id: string;
  userId: string;
  addictionId: string;
  trigger: string;
  mood: string;
  intensity: number;
  note?: string;
  occurredAt: string;
}

export interface Checkin {
  id: string;
  userId: string;
  mood: string;
  moodScore: number;
  note?: string;
  didRelapse: boolean;
  streak: number;
  checkedAt: string;
}

export interface AiMessage {
  id: string;
  userId: string;
  role: 'user' | 'assistant';
  content: string;
  type: 'COACH' | 'URGE' | 'INSIGHT';
  createdAt: string;
}

export interface Dashboard {
  user: Pick<User, 'id' | 'name' | 'email'>;
  activeAddiction: Addiction | null;
  streak: number;
  recentCheckins: Checkin[];
  relapseCount: number;
}

export type MoodType = 'great' | 'good' | 'okay' | 'bad' | 'terrible';
export type AddictionType = 'smoking' | 'porn' | 'alcohol' | 'social_media' | 'gambling' | 'custom';