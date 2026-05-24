import { request } from "@/lib/request";

export const addictionService = {
  create: (data: {
    type: string;
    goal: string;
    triggers?: string[];
    metadata?: Record<string, unknown>;
  }) =>
    request.post<{ data: any, success: boolean, message?: string }>(
      "/api/addictions",
      data
    ),

  list: () =>
    request.get<{ data: any, success: boolean, message?: string }>("/api/addictions"),
};