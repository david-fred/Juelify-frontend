import { type ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

// Full-screen below md (768px); centered card with these max widths at md and up.
const sizeClasses = {
  sm: 'md:max-w-sm',
  md: 'md:max-w-lg',
  lg: 'md:max-w-2xl',
} as const;

export function Modal({ open, onClose, title, children, size = 'md' }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleEsc);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-stretch md:items-center md:justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`relative flex flex-col w-full h-full bg-surface-raised animate-sheet-in md:h-auto md:max-h-[85vh] md:mx-4 md:rounded-2xl md:border md:border-surface-border ${sizeClasses[size]}`}
      >
        <div className="flex items-center justify-between gap-4 shrink-0 px-5 pb-4 pt-[calc(1rem+env(safe-area-inset-top,0px))] md:pt-4 border-b border-surface-border">
          <h2 className="text-base font-semibold text-text-primary">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-lg hover:bg-surface-overlay text-text-muted hover:text-text-primary transition"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom,0px))] md:pb-5">
          {children}
        </div>
      </div>
    </div>
  );
}
