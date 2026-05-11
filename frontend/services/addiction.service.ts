import { request } from "@/lib/request";

export const addictionService = {
  create: (data: {
    type: string;
    goal: string;
    triggers?: string[];
    metadata?: Record<string, unknown>;
  }) =>
    request.post(
      "/api/addictions",
      data
    ),

  list: () =>
    request.get("/api/addictions"),
};