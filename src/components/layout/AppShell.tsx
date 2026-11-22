import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { BottomTabBar } from './BottomTabBar';
import { TopTabBar } from './TopTabBar';
import { useUIStore } from '@/stores/uiStore';
import { useOfflineSync } from '@/hooks/useOfflineSync';
import { WifiOff } from 'lucide-react';

export function AppShell() {
  const setIsMobile = useUIStore((s) => s.setIsMobile);
  const { isOnline, pendingCount } = useOfflineSync();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setIsMobile]);

  return (
    <div className="min-h-screen bg-surface-base">
      <TopTabBar />

      {/* Offline Banner */}
      {!isOnline && (
        <div className="fixed top-0 md:top-14 left-0 right-0 z-30 bg-amber-500/15 border-b border-amber-500/30 px-4 py-2 flex items-center justify-center gap-2 text-amber-400 text-xs font-medium">
          <WifiOff size={14} />
          <span>You're offline. {pendingCount > 0 && `${pendingCount} pending operations will sync when connected.`}</span>
        </div>
      )}

      {/* Main Content */}
      <main className="pt-0 md:pt-14 pb-20 md:pb-6 px-4 md:px-8 max-w-5xl mx-auto">
        <div className="py-6">
          <Outlet />
        </div>
      </main>

      <BottomTabBar />
    </div>
  );
}

