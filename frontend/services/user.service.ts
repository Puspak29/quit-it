import { request } from "@/lib/request";
import { Dashboard, User, Addiction } from "@/types";

interface Me {
    user: User & { addictions: Addiction[] };
}

export interface UpdateProfilePayload {
  name?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}

export const userService = {
  sync: (data: {
    email: string;
    name?: string;
  }) =>
    request.post(
      "/api/users/sync",
      data
    ),

  me: () =>
    request.get<{ success: boolean, data: Me, message?: string }>("/api/users/me"),

  dashboard: () =>
    request.get<{ success: boolean, data: { dashboard: Dashboard | null }, message?: string }>(
      "/api/users/dashboard"
    ),

  updateFcmToken: (
    fcmToken: string
  ) =>
    request.patch(
      "/api/users/fcm-token",
      { fcmToken }
    ),

  updateProfile: (data: UpdateProfilePayload) =>
    request.patch<{ success: boolean; data: { user: User }; message?: string }>(
      "/api/users/profile",
      data
    ),
};