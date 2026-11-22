import { create } from 'zustand';

export type ModalId =
  | 'createPost'
  | 'createPoll'
  | 'topUp'
  | 'exemption'
  | 'createEvent'
  | 'eventDetail'
  | 'createFolder'
  | null;

export type ToastTone = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  message: string;
  tone: ToastTone;
}

interface UIState {
  activeModal: ModalId;
  modalData: Record<string, unknown> | null;
  isMobile: boolean;
  sidebarOpen: boolean;
  toasts: Toast[];

  openModal: (id: ModalId, data?: Record<string, unknown>) => void;
  closeModal: () => void;
  setIsMobile: (val: boolean) => void;
  toggleSidebar: () => void;
  pushToast: (message: string, tone?: ToastTone) => void;
  dismissToast: (id: string) => void;
}

const MAX_TOASTS = 3;

export const useUIStore = create<UIState>()((set) => ({
  activeModal: null,
  modalData: null,
  isMobile: window.innerWidth < 768,
  sidebarOpen: false,
  toasts: [],

  openModal: (id, data) => set({ activeModal: id, modalData: data ?? null }),
  closeModal: () => set({ activeModal: null, modalData: null }),
  setIsMobile: (val) => set({ isMobile: val }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

  pushToast: (message, tone = 'info') =>
    set((s) => ({
      toasts: [
        ...s.toasts,
        { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, message, tone },
      ].slice(-MAX_TOASTS),
    })),
  dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
