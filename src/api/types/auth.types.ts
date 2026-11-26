export type AccountStatus = 'active' | 'suspended' | 'deactivated';

/** Mirrors identity.schemas.UserResponse. avatarUrl is not returned by the backend yet. */
export interface User {
  id: string;
  fullName: string;
  email: string;
  status: AccountStatus;
  avatarUrl?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

/** Mirrors identity.schemas.RegisterRequest. The backend rejects unknown fields with 422. */
export interface RegisterPayload {
  fullName: string;
  email: string;
  /** At least 12 characters (backend minimum). */
  password: string;
}

/** Mirrors identity.schemas.BrowserTokenResponse. The refresh token never reaches JavaScript. */
export interface BrowserTokenResponse {
  accessToken: string;
  csrfToken: string;
  tokenType: 'bearer';
}

export interface CsrfResponse {
  csrfToken: string;
}

export interface MessageResponse {
  message: string;
}

/** Placeholder until the backend returns per-user permissions. */
export interface Permission {
  subject: string;
  action: string;
  resource: string;
  communityId?: string;
}
