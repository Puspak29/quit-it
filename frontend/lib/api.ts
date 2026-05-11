import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 15000,
});

let initialized = false;

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