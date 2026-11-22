import type { ReactNode } from 'react';

export const inputClass =
  'w-full bg-surface-raised border border-surface-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-500 transition';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-surface-base flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center font-bold text-white text-2xl shadow-2xl shadow-brand-500/30 mx-auto mb-4">
            C
          </div>
          <h1 className="text-2xl font-bold text-text-primary">{title}</h1>
          <p className="text-sm text-text-muted mt-1">{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  );
}

interface FieldProps {
  id: string;
  label: string;
  children: ReactNode;
}

export function Field({ id, label, children }: FieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5"
      >
        {label}
      </label>
      {children}
    </div>
  );
}
