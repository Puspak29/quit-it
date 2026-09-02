import axios from "axios";
import Cookies from "js-cookie";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 15000
});

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("frontend-token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Unwrap backend envelope: { success, message, data: T } → T
api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);