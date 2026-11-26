import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/Button';
import { AuthLayout, Field, inputClass } from './AuthLayout';

// Must match identity.schemas.RegisterRequest (password min_length=12).
const MIN_PASSWORD_LENGTH = 12;

function messageFromError(error: unknown): string {
  const status = isAxiosError(error) ? error.response?.status : undefined;
  if (status === 422) {
    return `Check your details. Your password needs at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  if (status === 429) return 'Too many attempts. Please wait a while and try again.';
  return 'Could not create your account. Please try again.';
}

export function RegisterPage() {
  const register = useAuthStore((s) => s.register);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [sentMessage, setSentMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }

    setSubmitting(true);
    try {
      const response = await register({ fullName: fullName.trim(), email, password });
      setSentMessage(response.message);
    } catch (err) {
      setError(messageFromError(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (sentMessage) {
    return (
      <AuthLayout title="Check your email" subtitle="One more step to activate your account">
        <div className="space-y-3 rounded-2xl border border-surface-border bg-surface-raised p-5 text-sm text-text-secondary">
          <p>{sentMessage}</p>
          <p>The verification link expires in 30 minutes.</p>
        </div>
        <p className="text-center text-sm text-text-muted mt-6">
          <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium transition">
            Back to sign in
          </Link>
        </p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Create your account" subtitle="Join your department, hostel or estate">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <Field id="fullName" label="Full name">
          <input
            id="fullName"
            type="text"
            autoComplete="name"
            minLength={2}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className={inputClass}
          />
        </Field>

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

        <Field id="password" label={`Password (min ${MIN_PASSWORD_LENGTH} characters)`}>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            minLength={MIN_PASSWORD_LENGTH}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={inputClass}
          />
        </Field>

        <Button type="submit" loading={submitting} className="w-full" size="lg">
          Create account
        </Button>
      </form>

      <p className="text-center text-sm text-text-muted mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium transition">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
