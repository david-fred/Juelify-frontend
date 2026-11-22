import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Community } from '@/api/types';

interface CommunityState {
  communities: Community[];
  activeCommunityId: string | null;
  /** Replaces the list. Keeps a still-valid selection; auto-selects when the user has exactly one community. */
  setCommunities: (communities: Community[]) => void;
  setActiveCommunity: (communityId: string) => void;
  clear: () => void;
}

export const useCommunityStore = create<CommunityState>()(
  persist(
    (set) => ({
      communities: [],
      activeCommunityId: null,

      setCommunities: (communities) =>
        set((state) => {
          const stillValid = communities.some((c) => c.id === state.activeCommunityId);
          const onlyOne = communities.length === 1 ? communities[0]!.id : null;
          return { communities, activeCommunityId: stillValid ? state.activeCommunityId : onlyOne };
        }),

      setActiveCommunity: (communityId) => set({ activeCommunityId: communityId }),

      clear: () => set({ communities: [], activeCommunityId: null }),
    }),
    { name: 'civicos-community' },
  ),
);
