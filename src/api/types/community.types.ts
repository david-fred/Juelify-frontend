export type CommunityType = 'department' | 'hostel' | 'estate' | 'club' | 'other';

export interface Community {
  id: string;
  name: string;
  description: string;
  type: CommunityType;
  memberCount: number;
  avatarUrl?: string;
  createdAt: string;
}

export interface Membership {
  id: string;
  userId: string;
  communityId: string;
  role: 'admin' | 'member';
  joinedAt: string;
}
