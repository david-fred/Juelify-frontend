import api from '../client';
import type { Poll, CastVotePayload } from '../types';

export const pollsApi = {
  getPolls: async (communityId: string): Promise<Poll[]> => {
    const { data } = await api.get<Poll[]>(`/api/communities/${communityId}/polls`);
    return data;
  },

  getPoll: async (pollId: string): Promise<Poll> => {
    const { data } = await api.get<Poll>(`/api/polls/${pollId}`);
    return data;
  },

  createPoll: async (payload: {
    communityId: string;
    question: string;
    options: string[];
    isMultiChoice: boolean;
    expiresAt: string;
    resultVisibility: 'live' | 'hidden_until_deadline';
  }): Promise<Poll> => {
    const { data } = await api.post<Poll>('/api/polls', payload);
    return data;
  },

  vote: async (payload: CastVotePayload): Promise<Poll> => {
    const { data } = await api.post<Poll>(`/api/polls/${payload.pollId}/vote`, {
      optionIds: payload.optionIds,
    });
    return data;
  },
};

