import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthResponse, Permission, User } from '@/api/types';
import { authApi } from '@/api/endpoints/auth';
import { hasPermission } from '@/lib/permissions';
import { useCommunityStore } from '@/stores/communityStore';

interface AuthState {
  user: User | null;
  token: string | null;
  permissions: Permission[];
  isLoading: boolean;

  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string, matricId?: string) => Promise<void>;
  logout: () => void;
  /** Re-validates the stored session. Keeps the cached session when offline. */
  refreshAuth: () => Promise<void>;
  /** Luje check against the active community, e.g. can('create', 'announcement'). */
  can: (action: string, resource: string) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => {
      const saveSession = (res: AuthResponse) => {
        set({ user: res.user, token: res.token, permissions: res.permissions });
        useCommunityStore.getState().setCommunities(res.communities);
      };

      return {
        user: null,
        token: null,
        permissions: [],
        isLoading: false,

        login: async (email, password) => {
          set({ isLoading: true });
          try {
            saveSession(await authApi.login({ email, password }));
          } finally {
            set({ isLoading: false });
          }
        },

        register: async (email, password, fullName, matricId) => {
          set({ isLoading: true });
          try {
            saveSession(await authApi.register({ email, password, fullName, matricId }));
          } finally {
            set({ isLoading: false });
          }
        },

        logout: () => {
          set({ user: null, token: null, permissions: [] });
          useCommunityStore.getState().clear();
        },

        refreshAuth: async () => {
          if (!get().token) return;
          try {
            const res = await authApi.me();
            set({ user: res.user, permissions: res.permissions });
            useCommunityStore.getState().setCommunities(res.communities);
          } catch {
            // A 401 is handled by the Axios interceptor (logout + redirect).
            // Any other failure (offline, server down) keeps the cached session.
          }
        },

        can: (action, resource) =>
          hasPermission(
            get().permissions,
            action,
            resource,
            useCommunityStore.getState().activeCommunityId,
          ),
      };
    },
    {
      name: 'civicos-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        permissions: state.permissions,
      }),
    },
  ),
);
