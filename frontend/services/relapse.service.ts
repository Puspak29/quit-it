import { request } from "@/lib/request";

export const relapseService = {
  create: (data: {
    addictionId: string;
    trigger: string;
    mood: string;
    intensity: number;
    note?: string;
  }) =>
    request.post(
      "/api/relapses",
      data
    ),

  list: (page = 1) =>
    request.get(
      "/api/relapses",
      { page }
    ),

  patterns: () =>
    request.get(
      "/api/relapses/patterns"
    ),
};