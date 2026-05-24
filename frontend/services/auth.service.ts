import { request } from '../lib/request';

export const authService = {
    register: (data: { email: string; password: string }) => request.post<{ success: boolean; message: string; data: { user: any, token: string } }>('/api/auth/register', data),
    login: (data: { email: string; password: string }) => request.post<{ success: boolean; message: string; data: { user: any, token: string } }>('/api/auth/login', data),
    logout: () => request.post('/api/auth/logout'),
}