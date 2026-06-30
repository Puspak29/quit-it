import { InferenceClient } from '@huggingface/inference';
import { HTTP_STATUS } from '../config/constants';
import { env } from '../config/env';
import { AppError } from '../utils/errors';

const hf = new InferenceClient(env.HF_API_KEY)

export const huggingfaceService = {
    async generate(prompt: string): Promise<string> {
        const response = await hf.textGeneration({
            model: 'mistralai/Mistral-7B-Instruct-v0.2',
            inputs: prompt,
            parameters: {
                max_new_tokens: 1000,
                temperature: 0.4,
                top_p: 0.9,
            },
        });

        if(!response || !response.generated_text || typeof response.generated_text !== 'string') {
            throw new AppError('HuggingFace API error', HTTP_STATUS.BAD_GATEWAY);
        }

        return response.generated_text.trim();
    }
};