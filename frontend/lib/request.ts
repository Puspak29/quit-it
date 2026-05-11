import { api } from "./api";

export const request = {
  get: <T>(url: string, params?: unknown) =>
    api.get<T>(url, { params }),

  post: <T>(
    url: string,
    data?: unknown
  ) => api.post<T>(url, data),

  patch: <T>(
    url: string,
    data?: unknown
  ) => api.patch<T>(url, data),

  put: <T>(
    url: string,
    data?: unknown
  ) => api.put<T>(url, data),

  delete: <T>(url: string) =>
    api.delete<T>(url),
};