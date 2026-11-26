import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { authApi } from '@/api/endpoints/auth';
import { Button } from '@/components/ui/Button';
import { AuthLayout, Field, inputClass } from './AuthLayout';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [sentMessage, setSentMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const response = await authApi.requestPasswordReset(email);
      setSentMessage(response.message);
    } catch (err) {
      setError(
        isAxiosError(err) && err.response?.status === 429
          ? 'Too many requests. Please wait a while and try again.'
          : 'Something went wrong. Please try again.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (sentMessage) {
    return (
      <AuthLayout title="Check your email" subtitle="If an account exists, a reset link is on its way">
        <div className="space-y-3 rounded-2xl border border-surface-border bg-surface-raised p-5 text-sm text-text-secondary">
          <p>{sentMessage}</p>
          <p>The reset link expires in 30 minutes.</p>
        </div>
        <p className="mt-6 text-center text-sm text-text-muted">
          <Link to="/login" className="font-medium text-brand-400 transition hover:text-brand-300">
            Back to sign in
          </Link>
        </p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Reset your password" subtitle="We'll email you a link to choose a new one">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <Field id="email" label="Email">
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={inputClass}
          />
        </Field>

        <Button type="submit" loading={submitting} className="w-full" size="lg">
          Send reset link
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-text-muted">
        Remembered it?{' '}
        <Link to="/login" className="font-medium text-brand-400 transition hover:text-brand-300">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
