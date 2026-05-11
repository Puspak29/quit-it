import { env } from '../config/env';
import { AppError } from '../utils/errors';

// Mistral-7B — good at instruction following, free tier available
const HF_URL =
    'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2';

interface HFResponse {
    generated_text?: string;
    error?: string;
}

export const huggingfaceService = {
    async generate(prompt: string): Promise<string> {
        const response = await fetch(HF_URL, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${env.HF_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                inputs: prompt,
                parameters: {
                max_new_tokens: 200,
                temperature: 0.7,
                return_full_text: false,
                },
            }),
        });

        if (!response.ok) {
            throw new AppError('HuggingFace API error', 502);
        }

        const data = (await response.json()) as HFResponse | HFResponse[];
        const result = Array.isArray(data) ? data[0] : data;

        if (result.error) throw new AppError(`HuggingFace: ${result.error}`, 502);
        if (!result.generated_text) throw new AppError('HuggingFace returned empty response', 502);

        return result.generated_text.trim();
    },
};