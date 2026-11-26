import { create } from 'zustand';
import { isAxiosError } from 'axios';
import type { MessageResponse, Permission, RegisterPayload, User } from '@/api/types';
import { authApi } from '@/api/endpoints/auth';
import { communitiesApi } from '@/api/endpoints/communities';
import { hasPermission } from '@/lib/permissions';
import { refreshOutcomeFromStatus, type RefreshOutcome } from '@/lib/sessionOutcome';
import { singleFlight } from '@/lib/singleFlight';
import { useCommunityStore } from '@/stores/communityStore';

export type SessionStatus = 'idle' | 'authenticated' | 'anonymous';

interface AuthState {
  /** 'idle' until the first session check finishes, so guards don't redirect too early. */
  status: SessionStatus;
  user: User | null;
  /** Short-lived JWT. Memory only: never written to localStorage, sessionStorage or cookies. */
  accessToken: string | null;
  /** CSRF token for the cookie-based refresh and logout calls. Memory only. */
  csrfToken: string | null;
  permissions: Permission[];
  isLoading: boolean;

  bootstrap: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<MessageResponse>;
  refreshSession: () => Promise<RefreshOutcome>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  expireSession: () => void;
  /** Luje check against the active community, e.g. can('create', 'announcement'). */
  can: (action: string, resource: string) => boolean;
}

/** Web Locks name that serializes token refresh across browser tabs. */
const REFRESH_LOCK = 'civicos-session-refresh';

export const useAuthStore = create<AuthState>()((set, get) => {
  const clearLocal = () => {
    set({ status: 'anonymous', user: null, accessToken: null, csrfToken: null, permissions: [] });
    useCommunityStore.getState().clear();
  };

  const loadProfile = async () => {
    const [user, communities] = await Promise.all([authApi.me(), communitiesApi.list()]);
    useCommunityStore.getState().setCommunities(communities);
    set({ status: 'authenticated', user });
  };

  // Fetch a CSRF token that matches the current refresh cookie, then rotate.
  const rotateTokens = async (): Promise<RefreshOutcome> => {
    try {
      const { csrfToken } = await authApi.getCsrf();
      const tokens = await authApi.refresh(csrfToken);
      set({ accessToken: tokens.accessToken, csrfToken: tokens.csrfToken });
      return 'ok';
    } catch (error) {
      return refreshOutcomeFromStatus(isAxiosError(error) ? error.response?.status : undefined);
    }
  };

  // Refresh tokens rotate on every use. Two concurrent refreshes would replay the same token,
  // which the server treats as theft and answers by revoking the whole session.
  const refreshOnce = singleFlight(() =>
    navigator.locks ? navigator.locks.request(REFRESH_LOCK, rotateTokens) : rotateTokens(),
  );

  const bootstrapOnce = singleFlight(async () => {
    const outcome = await refreshOnce();
    if (outcome !== 'ok') {
      clearLocal();
      return;
    }
    try {
      await loadProfile();
    } catch {
      clearLocal();
    }
  });

  // Logout needs a CSRF token that matches the refresh cookie. Without a session there is nothing to revoke.
  const revokeCookieSession = async (revoke: (csrfToken: string) => Promise<void>) => {
    try {
      const { csrfToken } = await authApi.getCsrf();
      await revoke(csrfToken);
    } catch {
      // No refresh cookie, or the network failed. Local state is cleared either way.
    }
  };

  return {
    status: 'idle',
    user: null,
    accessToken: null,
    csrfToken: null,
    permissions: [],
    isLoading: false,

    bootstrap: () => (get().status === 'idle' ? bootstrapOnce() : Promise.resolve()),

    refreshSession: () => refreshOnce(),

    login: async (email, password) => {
      set({ isLoading: true });
      try {
        const tokens = await authApi.login({ email, password });
        set({ accessToken: tokens.accessToken, csrfToken: tokens.csrfToken });
        await loadProfile();
      } catch (error) {
        clearLocal();
        throw error;
      } finally {
        set({ isLoading: false });
      }
    },

    register: (payload) => authApi.register(payload),

    logout: async () => {
      await revokeCookieSession(authApi.logout);
      clearLocal();
    },

    logoutAll: async () => {
      await revokeCookieSession(authApi.logoutAll);
      clearLocal();
    },

    expireSession: () => {
      clearLocal();
      window.location.replace('/login?expired=1');
    },

    can: (action, resource) =>
      hasPermission(get().permissions, action, resource, useCommunityStore.getState().activeCommunityId),
  };
});
