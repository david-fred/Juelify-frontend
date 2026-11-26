import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useCommunityStore } from '@/stores/communityStore';
import { Skeleton } from '@/components/ui/Skeleton';

/** Guards signed-in routes: restore the session first, then require an active community. */
export function RequireAuth() {
  const status = useAuthStore((s) => s.status);
  const bootstrap = useAuthStore((s) => s.bootstrap);
  const activeCommunityId = useCommunityStore((s) => s.activeCommunityId);
  const { pathname } = useLocation();

  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);

  if (status === 'idle') {
    return (
      <div className="min-h-screen bg-surface-base p-6">
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (status === 'anonymous') return <Navigate to="/login" replace />;

  if (!activeCommunityId && pathname !== '/select-community') {
    return <Navigate to="/select-community" replace />;
  }

  return <Outlet />;
}
