import { useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { authApi } from '@/api/endpoints/auth';
import { Button } from '@/components/ui/Button';
import { AuthLayout, Field, inputClass } from './AuthLayout';

// Must match identity.schemas.PasswordResetConfirmRequest (new_password min_length=12).
const MIN_PASSWORD_LENGTH = 12;

function messageFromError(error: unknown): string {
  const status = isAxiosError(error) ? error.response?.status : undefined;
  if (status === 400) return 'This reset link is invalid or has expired. Request a new one.';
  if (status === 422) return `Your password needs at least ${MIN_PASSWORD_LENGTH} characters.`;
  if (status === 429) return 'Too many attempts. Please wait a while and try again.';
  return 'Could not reset your password. Please try again.';
}

/** Opened from the link in the reset email: /reset-password?token=... */
export function ResetPasswordPage() {
  const [params] = useSearchParams();
  const token = params.get('token');

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [doneMessage, setDoneMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) return;
    setError('');

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }
    if (password !== confirm) {
      setError('The two passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await authApi.confirmPasswordReset(token, password);
      setDoneMessage(response.message);
    } catch (err) {
      setError(messageFromError(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (!token) {
    return (
      <AuthLayout title="Reset link incomplete" subtitle="This page needs the link from your email">
        <div className="rounded-2xl border border-surface-border bg-surface-raised p-5 text-sm text-text-secondary">
          Open the link from the email again, or request a new one.
        </div>
        <p className="mt-6 text-center text-sm text-text-muted">
          <Link to="/forgot-password" className="font-medium text-brand-400 transition hover:text-brand-300">
            Request a new link
          </Link>
        </p>
      </AuthLayout>
    );
  }

  if (doneMessage) {
    return (
      <AuthLayout title="Password updated" subtitle="You can sign in with your new password">
        <div className="space-y-3 rounded-2xl border border-surface-border bg-surface-raised p-5 text-sm text-text-secondary">
          <p className="text-emerald-400">{doneMessage}</p>
        </div>
        <p className="mt-6 text-center text-sm text-text-muted">
          <Link to="/login" className="font-medium text-brand-400 transition hover:text-brand-300">
            Sign in
          </Link>
        </p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Choose a new password" subtitle={`At least ${MIN_PASSWORD_LENGTH} characters`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <Field id="newPassword" label="New password">
          <input
            id="newPassword"
            type="password"
            autoComplete="new-password"
            minLength={MIN_PASSWORD_LENGTH}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={inputClass}
          />
        </Field>

        <Field id="confirmPassword" label="Confirm password">
          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            minLength={MIN_PASSWORD_LENGTH}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            className={inputClass}
          />
        </Field>

        <Button type="submit" loading={submitting} className="w-full" size="lg">
          Update password
        </Button>
      </form>
    </AuthLayout>
  );
}
