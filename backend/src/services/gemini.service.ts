import { env } from '../config/env';
import { AppError } from '../utils/errors';

const GEMINI_URL =
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`;

interface GeminiResponse {
  candidates?: {
    content?: {
      parts?: { text: string }[];
    };
  }[];
}

export const geminiService = {
  async generate(prompt: string): Promise<string> {
    const response = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': env.GEMINI_API_KEY
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 1000,   // keep responses short
          topP: 0.9,
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_ONLY_HIGH',
          },
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new AppError(`Gemini API error: ${err}`, 502);
    }

    const data = (await response.json()) as GeminiResponse;
    const text = data.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || '')
      .join('');

    if (!text) throw new AppError('Gemini returned empty response', 502);

    return text.trim();
  },
};