import type { ReactNode } from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error';

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-surface-overlay text-text-secondary border-surface-border',
  success: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  warning: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  error: 'bg-red-500/15 text-red-400 border-red-500/30',
};

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold border ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
