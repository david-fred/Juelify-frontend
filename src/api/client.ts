import axios, {
  type AxiosError,
  type AxiosRequestTransformer,
  type AxiosResponseTransformer,
} from 'axios';
import { useAuthStore } from '@/stores/authStore';
import { camelizeKeys, snakeizeKeys } from '@/lib/case';

declare module 'axios' {
  interface AxiosRequestConfig {
    /** Send without the bearer token (sign-in and cookie-only calls). */
    skipAuth?: boolean;
  }
  interface InternalAxiosRequestConfig {
    /** Set after one refresh-and-retry, so a request is never retried twice. */
    _retried?: boolean;
  }
}

// A 401 on these paths means wrong credentials or a bad token, not an expired session.
// They must never trigger a refresh.
const NO_REFRESH_PREFIXES = [
  '/api/v1/auth/browser/',
  '/api/v1/auth/register',
  '/api/v1/auth/verify-email',
  '/api/v1/auth/resend-verification',
  '/api/v1/auth/password-reset/',
  '/api/v1/auth/login',
  '/api/v1/auth/refresh',
];

const isFormData = (data: unknown): data is FormData =>
  typeof FormData !== 'undefined' && data instanceof FormData;

const defaultRequestTransforms = ([] as AxiosRequestTransformer[]).concat(
  axios.defaults.transformRequest ?? [],
);
const defaultResponseTransforms = ([] as AxiosResponseTransformer[]).concat(
  axios.defaults.transformResponse ?? [],
);

const api = axios.create({
  // Empty in development: /api requests go through the Vite proxy to localhost:8000.
  baseURL: import.meta.env.VITE_API_URL ?? '',
  timeout: 15000,
  // Lets the browser send the httpOnly refresh and CSRF cookies on the calls that need them.
  withCredentials: true,
  // Outgoing: camelCase to snake_case. Incoming: snake_case to camelCase.
  transformRequest: [
    (data) => (isFormData(data) ? data : snakeizeKeys(data)),
    ...defaultRequestTransforms,
  ],
  transformResponse: [...defaultResponseTransforms, (data) => camelizeKeys(data)],
});

// Access token goes in the Authorization header from memory. Nothing is read from storage.
api.interceptors.request.use((config) => {
  if (!config.skipAuth) {
    const token = useAuthStore.getState().accessToken;
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config;
    const path = config?.url ?? '';
    const isExpiredAccess =
      error.response?.status === 401 &&
      !config?._retried &&
      !config?.skipAuth &&
      !NO_REFRESH_PREFIXES.some((prefix) => path.startsWith(prefix));

    if (config && isExpiredAccess) {
      config._retried = true;
      const outcome = await useAuthStore.getState().refreshSession();

      if (outcome === 'ok') {
        config.headers.Authorization = `Bearer ${useAuthStore.getState().accessToken}`;
        return api.request(config);
      }
      if (outcome === 'unauthorized') {
        useAuthStore.getState().expireSession();
      }
    }

    return Promise.reject(error);
  },
);

export default api;
