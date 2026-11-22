import type { User } from './auth.types';

export type PollResultVisibility = 'live' | 'hidden_until_deadline';

export interface Poll {
  id: string;
  communityId: string;
  authorId: string;
  author: User;
  question: string;
  options: PollOption[];
  isMultiChoice: boolean;
  expiresAt: string;
  resultVisibility: PollResultVisibility;
  totalVotes: number;
  hasVoted: boolean;
  userVotes?: string[]; // option IDs the user voted for
  createdAt: string;
}

export interface PollOption {
  id: string;
  text: string;
  voteCount: number;
  percentage: number;
}

export interface CastVotePayload {
  pollId: string;
  optionIds: string[];
}
