export interface User {
  id: string;
  email: string;
  name: string | null;
  fcmToken?: string | null;
  createdAt: string;
  updatedAt: string;
  addictions?: Addiction[];
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

// Community
export interface Community {
  id: string;
  addictionType: string;
  name: string;
  description: string | null;
  memberCount: number;
  messageCount: number;
  isMember: boolean;
}
 
export interface CommunityMessage {
  id: string;
  communityId: string;
  content: string;
  status: 'VISIBLE' | 'FLAGGED' | 'HIDDEN';
  createdAt: string;
  user: { id: string; name: string | null };
}
 
export interface MilestoneEvent {
  userId: string;
  userName: string;
  streakDays: number;
  message: string;
  timestamp: string;
}
 
export type FlagReason = 'SPAM' | 'HATE_SPEECH' | 'SELF_HARM';
 
// Generic API response envelope — used to type all service calls
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Shared
export type MoodType = 'great' | 'good' | 'okay' | 'bad' | 'terrible';
export type AddictionType = 'smoking' | 'porn' | 'alcohol' | 'social_media' | 'gambling' | 'custom';