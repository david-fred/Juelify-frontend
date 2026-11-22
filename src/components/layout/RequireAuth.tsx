import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useCommunityStore } from '@/stores/communityStore';

/** Guards every signed-in route: needs a session, then an active community. */
export function RequireAuth() {
  const token = useAuthStore((s) => s.token);
  const refreshAuth = useAuthStore((s) => s.refreshAuth);
  const activeCommunityId = useCommunityStore((s) => s.activeCommunityId);
  const { pathname } = useLocation();

  // Validate the stored session once per app load.
  useEffect(() => {
    void refreshAuth();
  }, [refreshAuth]);

  if (!token) return <Navigate to="/login" replace />;

  if (!activeCommunityId && pathname !== '/select-community') {
    return <Navigate to="/select-community" replace />;
  }

  return <Outlet />;
}
