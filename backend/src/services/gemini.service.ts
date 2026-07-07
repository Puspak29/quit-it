import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { HTTP_STATUS } from '../config/constants';
import { env } from '../config/env';
import { AppError } from '../utils/errors';

const model = new ChatGoogleGenerativeAI({
    model: 'gemini-2.5-flash',
    apiKey: env.GEMINI_API_KEY,
    temperature: 0.4,
    maxOutputTokens: 1000,
    topP: 0.9,
    safetySettings: [
        {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
    ],
});

export const geminiService = {
    async generate(prompt: string): Promise<string> {
        const response = await model.invoke(prompt);
        const text = response.content;

        if (!text || text.length === 0 || typeof text !== 'string') {
            throw new AppError(
                'Failed to generate content with Gemini',
                HTTP_STATUS.BAD_GATEWAY,
            );
        }

        return text.trim();
    },
};
