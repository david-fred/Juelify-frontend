export type WalletType = 'personal' | 'community';
export type TransactionType = 'top_up' | 'contribution' | 'withdrawal' | 'transfer';

export interface Wallet {
  id: string;
  ownerId: string;
  type: WalletType;
  balance: number;
  currency: string;
}

export interface Transaction {
  id: string;
  walletId: string;
  type: TransactionType;
  amount: number;
  description: string;
  recipientName?: string;
  recipientBank?: string;
  proofUrl?: string;
  memo?: string;
  createdAt: string;
}

export interface TopUpPayload {
  walletId: string;
  amount: number;
  method: 'card' | 'bank_transfer';
}
