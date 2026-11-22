import { useEffect, useCallback } from 'react';
import { useOfflineStore } from '@/stores/offlineStore';

export function useOfflineSync() {
  const { setOnline, pendingOps, removePendingOp, incrementRetry } = useOfflineStore();

  const syncPendingOps = useCallback(async () => {
    for (const op of pendingOps) {
      if (op.retries >= 5) {
        removePendingOp(op.id);
        continue;
      }
      try {
        // Dynamic import based on operation type to avoid circular deps
        switch (op.type) {
          case 'create_post': {
            const { feedApi } = await import('@/api/endpoints/feed');
            await feedApi.createPost(op.payload as Parameters<typeof feedApi.createPost>[0]);
            break;
          }
          case 'cast_vote': {
            const { pollsApi } = await import('@/api/endpoints/polls');
            await pollsApi.vote(op.payload as Parameters<typeof pollsApi.vote>[0]);
            break;
          }
          case 'create_event': {
            const { calendarApi } = await import('@/api/endpoints/calendar');
            await calendarApi.createEvent(op.payload as Parameters<typeof calendarApi.createEvent>[0]);
            break;
          }
          default:
            break;
        }
        removePendingOp(op.id);
      } catch {
        incrementRetry(op.id);
      }
    }
  }, [pendingOps, removePendingOp, incrementRetry]);

  useEffect(() => {
    const handleOnline = () => {
      setOnline(true);
      syncPendingOps();
    };
    const handleOffline = () => setOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Sync on mount if online
    if (navigator.onLine && pendingOps.length > 0) {
      syncPendingOps();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setOnline, syncPendingOps, pendingOps.length]);

  return {
    isOnline: useOfflineStore((s) => s.isOnline),
    pendingCount: pendingOps.length,
  };
}

