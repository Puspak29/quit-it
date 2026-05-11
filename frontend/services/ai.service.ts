import { request } from "@/lib/request";

export const aiService = {
  chat: (message: string) =>
    request.post(
      "/api/ai/chat",
      { message }
    ),

  urge: (data: {
    trigger: string;
    mood: string;
    intensity: number;
  }) =>
    request.post<{ reply: string }>(
      "/api/ai/urge",
      data
    ),

  insight: () =>
    request.get("/api/ai/insight"),

  history: () =>
    request.get(
      "/api/ai/history",
      { type: "COACH" }
    ),
};