import api from '../client';
import type { Contribution, ContributionPayment, ExemptionRequest, Transaction } from '../types';

export const contributionsApi = {
  getContributions: async (communityId: string): Promise<Contribution[]> => {
    const { data } = await api.get<Contribution[]>(`/api/communities/${communityId}/contributions`);
    return data;
  },

  payContribution: async (payload: ContributionPayment): Promise<Transaction> => {
    const { data } = await api.post<Transaction>('/api/contributions/pay', payload);
    return data;
  },

  requestExemption: async (
    contributionId: string,
    reason: string,
    proofUrl?: string,
  ): Promise<ExemptionRequest> => {
    const { data } = await api.post<ExemptionRequest>(
      `/api/contributions/${contributionId}/exemption`,
      { reason, proofUrl },
    );
    return data;
  },
};
