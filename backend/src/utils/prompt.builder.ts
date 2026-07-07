import { UserContext } from '../types';

interface CoachPromptInput {
    userContext: UserContext;
    userMessage: string;
    recentMessages: { role: 'user' | 'assistant'; content: string }[];
}

interface UrgePromptInput {
    userContext: UserContext;
    trigger: string;
    mood: string;
    intensity: number; // 1–10
}

interface InsightPromptInput {
    userContext: UserContext;
    topTriggers: [string, number][];
    topMoods: [string, number][];
    totalRelapses: number;
}

const SYSTEM_BASE = `You are a compassionate but direct addiction recovery coach.
Rules:
- Reply in 3 sentences max
- Sentence 1: acknowledgment
- Sentence 2: action
- Sentence 3: reinforcement
- Never end mid-sentence
- Finish the thought before stopping
- Be direct and practical
- No introductions or emotional filler
- Do not repeat the user's message
- Be specific to the user's addiction and situation — never generic
- Give one clear, actionable step
- Never shame or lecture
- Use plain conversational language`;

export const promptBuilder = {
    coach({
        userContext,
        userMessage,
        recentMessages,
    }: CoachPromptInput): string {
        const history = recentMessages
            .slice(-6) // last 3 exchanges
            .map((m) => `${m.role === 'user' ? 'User' : 'Coach'}: ${m.content}`)
            .join('\n');

        return `${SYSTEM_BASE}

User profile:
- Addiction: ${userContext.addictionType}
- Goal: ${userContext.goal}
- Current streak: ${userContext.streak} days
- Known triggers: ${userContext.triggers.join(', ') || 'none listed'}
- Last mood: ${userContext.lastMood ?? 'unknown'}

Conversation so far:
${history || 'This is the start of the conversation.'}

User just said: "${userMessage}"

Respond as the coach:`;
    },

    urge({ userContext, trigger, mood, intensity }: UrgePromptInput): string {
        const urgencyLevel =
            intensity >= 8
                ? 'very high — treat this as a crisis moment'
                : intensity >= 5
                  ? 'moderate — user needs grounding'
                  : 'low — user is being proactive';

        return `${SYSTEM_BASE}

User is experiencing an urge RIGHT NOW. Do not delay with pleasantries.

User profile:
- Addiction: ${userContext.addictionType}
- Streak at risk: ${userContext.streak} days
- Trigger right now: "${trigger}"
- Current mood: ${mood}
- Urge intensity: ${intensity}/10 (${urgencyLevel})

Give ONE immediate coping action tailored to this exact trigger and addiction.
Start with the action, not with sympathy. Be direct.`;
    },

    insight({
        userContext,
        topTriggers,
        topMoods,
        totalRelapses,
    }: InsightPromptInput): string {
        const triggerList = topTriggers
            .map(([t, n]) => `${t} (${n}x)`)
            .join(', ');

        const moodList = topMoods.map(([m, n]) => `${m} (${n}x)`).join(', ');

        return `${SYSTEM_BASE}

Analyze this user's relapse patterns and give 2–3 specific, actionable insights.

User profile:
- Addiction: ${userContext.addictionType}
- Goal: ${userContext.goal}
- Current streak: ${userContext.streak} days
- Total relapses analyzed: ${totalRelapses}
- Top triggers: ${triggerList || 'insufficient data'}
- Top moods during relapses: ${moodList || 'insufficient data'}

Format your response as:
Pattern: [what you see]
Risk: [when they are most vulnerable]
Action: [one specific habit or strategy to address this]`;
    },
};
