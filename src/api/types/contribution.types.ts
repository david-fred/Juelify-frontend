export type ContributionGrouping = 'flat' | 'per_room';
export type ContributionStatus = 'active' | 'completed' | 'expired';

export interface Contribution {
  id: string;
  communityId: string;
  title: string;
  description: string;
  targetAmount: number;
  raisedAmount: number;
  grouping: ContributionGrouping;
  perUnitAmount?: number;
  totalMembers: number;
  paidMembers: number;
  deadline: string;
  status: ContributionStatus;
  visibility: 'live' | 'hidden_until_deadline';
  createdAt: string;
}

export interface ContributionPayment {
  contributionId: string;
  amount: number;
  fromWalletId: string;
}

export interface ExemptionRequest {
  id: string;
  contributionId: string;
  userId: string;
  reason: string;
  proofUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}
