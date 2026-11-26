import api from '../client';
import type {
  BrowserTokenResponse,
  CsrfResponse,
  LoginPayload,
  MessageResponse,
  RegisterPayload,
  User,
} from '../types';

const AUTH = '/api/v1/auth';
const BROWSER = `${AUTH}/browser`;

/** Mirrors the identity router. Paths and bodies match the FastAPI backend exactly. */
export const authApi = {
  /** Sets the httpOnly refresh and CSRF cookies. Returns the access and CSRF tokens for memory. */
  login: async (payload: LoginPayload): Promise<BrowserTokenResponse> => {
    const { data } = await api.post<BrowserTokenResponse>(`${BROWSER}/login`, payload, {
      skipAuth: true,
    });
    return data;
  },

  /** Returns 202 with a generic message. No session is created until the email is verified. */
  register: async (payload: RegisterPayload): Promise<MessageResponse> => {
    const { data } = await api.post<MessageResponse>(`${AUTH}/register`, payload, {
      skipAuth: true,
    });
    return data;
  },

  verifyEmail: async (token: string): Promise<MessageResponse> => {
    const { data } = await api.post<MessageResponse>(
      `${AUTH}/verify-email`,
      { token },
      { skipAuth: true },
    );
    return data;
  },

  resendVerification: async (email: string): Promise<MessageResponse> => {
    const { data } = await api.post<MessageResponse>(
      `${AUTH}/resend-verification`,
      { email },
      { skipAuth: true },
    );
    return data;
  },

  /** Always returns a generic message, so the response never reveals whether the email exists. */
  requestPasswordReset: async (email: string): Promise<MessageResponse> => {
    const { data } = await api.post<MessageResponse>(
      `${AUTH}/password-reset/request`,
      { email },
      { skipAuth: true },
    );
    return data;
  },

  /** Consumes the emailed token and revokes every existing session for the account. */
  confirmPasswordReset: async (token: string, newPassword: string): Promise<MessageResponse> => {
    const { data } = await api.post<MessageResponse>(
      `${AUTH}/password-reset/confirm`,
      { token, newPassword },
      { skipAuth: true },
    );
    return data;
  },

  me: async (): Promise<User> => {
    const { data } = await api.get<User>(`${AUTH}/me`);
    return data;
  },

  /** Reads the CSRF token bound to the current refresh cookie. Also re-issues the CSRF cookie. */
  getCsrf: async (): Promise<CsrfResponse> => {
    const { data } = await api.get<CsrfResponse>(`${BROWSER}/csrf`, { skipAuth: true });
    return data;
  },

  /** Rotates the refresh cookie. The CSRF header must match the csrf_token cookie. */
  refresh: async (csrfToken: string): Promise<BrowserTokenResponse> => {
    const { data } = await api.post<BrowserTokenResponse>(`${BROWSER}/refresh`, undefined, {
      skipAuth: true,
      headers: { 'X-CSRF-Token': csrfToken },
    });
    return data;
  },

  logout: async (csrfToken: string): Promise<void> => {
    await api.post(`${BROWSER}/logout`, undefined, {
      skipAuth: true,
      headers: { 'X-CSRF-Token': csrfToken },
    });
  },

  logoutAll: async (csrfToken: string): Promise<void> => {
    await api.post(`${BROWSER}/logout-all`, undefined, {
      skipAuth: true,
      headers: { 'X-CSRF-Token': csrfToken },
    });
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<MessageResponse> => {
    const { data } = await api.post<MessageResponse>(`${AUTH}/change-password`, {
      currentPassword,
      newPassword,
    });
    return data;
  },
};
