import api from '../client';
import type { AuthResponse, LoginPayload, RegisterPayload } from '../types';

export const authApi = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/api/auth/login', payload);
    return data;
  },

  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/api/auth/register', payload);
    return data;
  },

  me: async (): Promise<AuthResponse> => {
    const { data } = await api.get<AuthResponse>('/api/auth/me');
    return data;
  },

  logout: async (): Promise<void> => {
    await api.post('/api/auth/logout');
  },
};

