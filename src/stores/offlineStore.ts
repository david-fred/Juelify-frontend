import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PendingOp {
  id: string;
  type: 'create_post' | 'add_comment' | 'pay_contribution' | 'cast_vote' | 'create_event';
  payload: unknown;
  timestamp: number;
  retries: number;
}

interface OfflineState {
  isOnline: boolean;
  pendingOps: PendingOp[];

  setOnline: (val: boolean) => void;
  addPendingOp: (op: Omit<PendingOp, 'id' | 'timestamp' | 'retries'>) => void;
  removePendingOp: (id: string) => void;
  incrementRetry: (id: string) => void;
  clearAll: () => void;
}

export const useOfflineStore = create<OfflineState>()(
  persist(
    (set, get) => ({
      isOnline: navigator.onLine,
      pendingOps: [],

      setOnline: (val) => set({ isOnline: val }),

      addPendingOp: (op) => {
        const newOp: PendingOp = {
          ...op,
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
          timestamp: Date.now(),
          retries: 0,
        };
        set({ pendingOps: [...get().pendingOps, newOp] });
      },

      removePendingOp: (id) => {
        set({ pendingOps: get().pendingOps.filter((o) => o.id !== id) });
      },

      incrementRetry: (id) => {
        set({
          pendingOps: get().pendingOps.map((o) =>
            o.id === id ? { ...o, retries: o.retries + 1 } : o,
          ),
        });
      },

      clearAll: () => set({ pendingOps: [] }),
    }),
    {
      name: 'civicos-offline-queue',
      partialize: (state) => ({ pendingOps: state.pendingOps }),
    },
  ),
);

