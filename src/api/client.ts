import axios, { type AxiosError } from 'axios';
import { useAuthStore } from '@/stores/authStore';
import { useCommunityStore } from '@/stores/communityStore';

// Bad credentials on these calls come back as 401 and must not trigger the expired-session redirect.
const AUTH_PATHS = ['/api/auth/login', '/api/auth/register'];

const api = axios.create({
  // Empty in development: /api requests are proxied to http://localhost:8000 by Vite.
  baseURL: import.meta.env.VITE_API_URL ?? '',
  timeout: 15000,
});

// Luje authorization: bearer token + active community context on every request.
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;

  const communityId = useCommunityStore.getState().activeCommunityId;
  if (communityId) config.headers['X-Community-Id'] = communityId;

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const url = error.config?.url ?? '';
    const isAuthCall = AUTH_PATHS.some((path) => url.startsWith(path));

    if (error.response?.status === 401 && !isAuthCall) {
      // Expired or revoked token: clear the session and return to sign-in.
      useAuthStore.getState().logout();
      window.location.replace('/login?expired=1');
    }
    return Promise.reject(error);
  },
);

export default api;
