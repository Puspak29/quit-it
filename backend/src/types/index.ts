export interface PaginationQuery {
    page?: number;
    limit?: number;
}

export interface UserContext {
    userId: string;
    addictionType: string;
    goal: string;
    triggers: string[];
    streak: number;
    lastMood?: string;
}

export type MoodType = 'great' | 'good' | 'okay' | 'bad' | 'terrible';
export type AddictionGoal = 'quit' | 'reduce';
export type AddictionType =
    'smoking' | 'porn' | 'alcohol' | 'social_media' | 'gambling' | 'custom';

export interface CommunityType {
    addictionType: AddictionType;
    name: string;
    description: string;
}
