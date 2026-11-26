/** Values accepted by communities.schemas.CommunityCreateRequest. */
export type CommunityType = 'general' | 'department' | 'lodge' | 'association';

export type CommunityStatus = 'active' | 'suspended' | 'archived' | 'pending_deletion';

/** Mirrors communities.schemas.CommunityResponse after camelCase conversion. */
export interface Community {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  communityType: CommunityType;
  status: CommunityStatus;
  version: number;
}

export interface CreateCommunityPayload {
  name: string;
  description?: string;
  communityType: CommunityType;
}

export interface UpdateCommunityPayload {
  expectedVersion: number;
  name?: string;
  description?: string | null;
}
