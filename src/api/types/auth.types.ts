import type { Community } from './community.types';

export interface User {
  id: string;
  email: string;
  fullName: string;
  matricId?: string;
  avatarUrl?: string;
  phone?: string;
  createdAt: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  fullName: string;
  matricId?: string;
  phone?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  permissions: Permission[];
  communities: Community[];
}

export interface Permission {
  subject: string;
  action: string;
  resource: string;
  communityId?: string;
}
