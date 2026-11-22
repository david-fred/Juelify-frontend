import { useEffect } from 'react';
import { Check, Info, X } from 'lucide-react';
import { useUIStore, type Toast, type ToastTone } from '@/stores/uiStore';

const TOAST_DURATION_MS = 4000;

const toneStyles: Record<ToastTone, string> = {
  success: 'border-emerald-500/30 bg-emerald-500/15 text-emerald-300',
  error: 'border-red-500/30 bg-red-500/15 text-red-300',
  info: 'border-brand-500/30 bg-brand-500/15 text-brand-200',
};

/** Mount once, near the root. Shows toasts from useUIStore().pushToast(). */
export function ToastViewport() {
  const toasts = useUIStore((s) => s.toasts);

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-20 md:bottom-6 z-[60] flex flex-col items-center gap-2 px-4"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}

function ToastItem({ toast }: { toast: Toast }) {
  const dismissToast = useUIStore((s) => s.dismissToast);

  useEffect(() => {
    const timer = window.setTimeout(() => dismissToast(toast.id), TOAST_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [toast.id, dismissToast]);

  const Icon = toast.tone === 'success' ? Check : Info;

  return (
    <div
      role="status"
      className={`pointer-events-auto flex w-full max-w-sm items-center gap-2.5 rounded-xl border px-4 py-3 text-sm shadow-lg backdrop-blur ${toneStyles[toast.tone]}`}
    >
      <Icon size={16} className="shrink-0" />
      <span className="flex-1">{toast.message}</span>
      <button
        type="button"
        onClick={() => dismissToast(toast.id)}
        aria-label="Dismiss"
        className="opacity-70 hover:opacity-100"
      >
        <X size={14} />
      </button>
    </div>
  );
}
