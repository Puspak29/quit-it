import { Patterns } from "@/app/(dashboard)/insights/page";
import { request } from "@/lib/request";

export const relapseService = {
  create: (data: {
    addictionId: string;
    trigger: string;
    mood: string;
    intensity: number;
    note?: string;
  }) =>
    request.post<{ success: boolean, data: any, message?: string }>(
      "/api/relapses",
      data
    ),

  list: (page = 1) =>
    request.get(
      "/api/relapses",
      { page }
    ),

  patterns: () =>
    request.get<{ success: boolean, data: any, message?: string }>(
      "/api/relapses/patterns"
    ),
};