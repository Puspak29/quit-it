import { request } from "@/lib/request";
import { Dashboard, User, Addiction } from "@/types";

interface Me {
    user: User;
    addictions: Addiction[];
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
    request.get<Me>("/api/users/me"),

  dashboard: () =>
    request.get<Dashboard | null>(
      "/api/users/dashboard"
    ),

  updateFcmToken: (
    fcmToken: string
  ) =>
    request.patch(
      "/api/users/fcm-token",
      { fcmToken }
    ),
};