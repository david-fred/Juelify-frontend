import api from '../client';
import type { Community, CreateCommunityPayload, UpdateCommunityPayload } from '../types';

const COMMUNITIES = '/api/v1/communities';

/** Mirrors the communities router. The trailing slash on the collection route is required by FastAPI. */
export const communitiesApi = {
  /** Communities where the user has an active membership. */
  list: async (): Promise<Community[]> => {
    const { data } = await api.get<Community[]>(`${COMMUNITIES}/`);
    return data;
  },

  get: async (communityId: string): Promise<Community> => {
    const { data } = await api.get<Community>(`${COMMUNITIES}/${communityId}`);
    return data;
  },

  /** Creates the community and makes the caller its owner, in one transaction. */
  create: async (payload: CreateCommunityPayload): Promise<Community> => {
    const { data } = await api.post<Community>(`${COMMUNITIES}/`, payload);
    return data;
  },

  /** Optimistic concurrency: `expectedVersion` must match, or the server returns 409. */
  update: async (communityId: string, payload: UpdateCommunityPayload): Promise<Community> => {
    const { data } = await api.patch<Community>(`${COMMUNITIES}/${communityId}`, payload);
    return data;
  },

  archive: async (communityId: string): Promise<Community> => {
    const { data } = await api.post<Community>(`${COMMUNITIES}/${communityId}/archive`);
    return data;
  },

  restore: async (communityId: string): Promise<Community> => {
    const { data } = await api.post<Community>(`${COMMUNITIES}/${communityId}/restore`);
    return data;
  },

  requestDeletion: async (communityId: string): Promise<Community> => {
    const { data } = await api.post<Community>(`${COMMUNITIES}/${communityId}/request-deletion`);
    return data;
  },

  cancelDeletion: async (communityId: string): Promise<Community> => {
    const { data } = await api.post<Community>(`${COMMUNITIES}/${communityId}/cancel-deletion`);
    return data;
  },
};
