import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 15000,
});

let initialized = false;

// Unwrap backend envelope: { success, message, data: T } → T
api.interceptors.response.use(
  (response) => {
    if (response.data && response.data.data !== undefined) {
      response.data = response.data.data;
    }
    return response;
  },
  (error) => Promise.reject(error)
);

export const setupApi = (
  getToken?: () => Promise<string | null>
) => {
  if (initialized) return;

  api.interceptors.request.use(
    async (config) => {
      const token =
        await getToken?.();

      if (token) {
        config.headers.Authorization =
          `Bearer ${token}`;
      }

      return config;
    }
  );

  initialized = true;
};