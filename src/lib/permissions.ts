import type { Permission } from '@/api/types';

/**
 * Luje policy check for one (action, resource) pair.
 * A grant applies when it is global (no communityId) or scoped to the active community.
 */
export function hasPermission(
  permissions: Permission[],
  action: string,
  resource: string,
  activeCommunityId: string | null,
): boolean {
  return permissions.some(
    (p) =>
      p.action === action &&
      p.resource === resource &&
      (!p.communityId || p.communityId === activeCommunityId),
  );
}
