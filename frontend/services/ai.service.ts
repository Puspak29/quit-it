import { request } from "@/lib/request";
import { AiMessage } from "@/types";

export const aiService = {
  chat: (message: string) =>
    request.post<{ data: { reply: string } }>(
      "/api/ai/chat",
      { message }
    ),

  urge: (data: {
    trigger: string;
    mood: string;
    intensity: number;
  }) =>
    request.post<{ data: { reply: string } }>(
      "/api/ai/urge",
      data
    ),

  insight: () =>
    request.get<{ data: { insight: string } }>("/api/ai/insight"),

  history: () =>
    request.get<{ data: { messages: AiMessage[] } }>(
      "/api/ai/history",
      { type: "COACH" }
    ),
};