import { useAuthStore } from '@/stores/authStore';

export function useAuth() {
  const { user, can, logout, isLoading } = useAuthStore();

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    logout,

    // Luje permission-gated capabilities
    canCreateAnnouncement: can('create', 'announcement'),
    canUploadMaterial: can('create', 'material'),
    canManageContributions: can('manage', 'contribution'),
    canCreatePoll: can('create', 'poll'),
    canCreateEvent: can('create', 'community_event'),
    canWithdrawFunds: can('withdraw', 'community_wallet'),
    canManageMembers: can('manage', 'members'),
    isAdmin: can('admin', 'community'),
  };
}

