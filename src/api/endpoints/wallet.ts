import api from '../client';
import type { PaginatedResponse, TopUpPayload, Transaction, Wallet } from '../types';

export const walletApi = {
  getWallet: async (): Promise<Wallet> => {
    const { data } = await api.get<Wallet>('/api/wallet');
    return data;
  },

  getCommunityWallet: async (communityId: string): Promise<Wallet> => {
    const { data } = await api.get<Wallet>(`/api/communities/${communityId}/wallet`);
    return data;
  },

  getTransactions: async (walletId: string, cursor?: string): Promise<PaginatedResponse<Transaction>> => {
    const { data } = await api.get<PaginatedResponse<Transaction>>(
      `/api/wallet/${walletId}/transactions`,
      { params: { cursor } },
    );
    return data;
  },

  topUp: async (payload: TopUpPayload): Promise<Transaction> => {
    const { data } = await api.post<Transaction>('/api/wallet/top-up', payload);
    return data;
  },
};
