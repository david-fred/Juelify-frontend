import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { authApi } from '@/api/endpoints/auth';
import { Button } from '@/components/ui/Button';
import { AuthLayout, Field, inputClass } from './AuthLayout';

type VerifyState = 'verifying' | 'verified' | 'failed';

/** Opened from the link in the verification email: /verify-email?token=... */
export function VerifyEmailPage() {
  const [params] = useSearchParams();
  const token = params.get('token');

  const [state, setState] = useState<VerifyState>('verifying');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [resendNote, setResendNote] = useState<string | null>(null);
  const [resending, setResending] = useState(false);

  // Verification tokens are single-use, and StrictMode runs effects twice in development.
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    if (!token) {
      setState('failed');
      setMessage('This verification link is incomplete.');
      return;
    }

    authApi
      .verifyEmail(token)
      .then((response) => {
        setState('verified');
        setMessage(response.message);
      })
      .catch((err: unknown) => {
        setState('failed');
        setMessage(
          isAxiosError(err) && err.response?.status === 400
            ? 'This link is invalid or has expired.'
            : 'We could not verify your email. Please try again.',
        );
      });
  }, [token]);

  const resend = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setResending(true);
    try {
      const response = await authApi.resendVerification(email);
      setResendNote(response.message);
    } catch {
      setResendNote('Something went wrong. Please try again in a few minutes.');
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthLayout title="Email verification" subtitle="Activating your CivicOS account">
      <div className="space-y-5 rounded-2xl border border-surface-border bg-surface-raised p-5 text-sm text-text-secondary">
        {state === 'verifying' && <p>Verifying your email…</p>}

        {state === 'verified' && (
          <>
            <p className="text-emerald-400">{message}</p>
            <Link
              to="/login"
              className="block w-full rounded-xl bg-brand-500 py-3 text-center text-sm font-medium text-white shadow-lg shadow-brand-500/20 transition hover:bg-brand-600"
            >
              Continue to sign in
            </Link>
          </>
        )}

        {state === 'failed' && (
          <>
            <p className="text-red-400">{message}</p>
            <form onSubmit={resend} className="space-y-3">
              <Field id="resendEmail" label="Email for a new link">
                <input
                  id="resendEmail"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={inputClass}
                />
              </Field>
              <Button type="submit" variant="secondary" loading={resending} className="w-full">
                Send a new link
              </Button>
              {resendNote && <p className="text-text-muted">{resendNote}</p>}
            </form>
          </>
        )}
      </div>
    </AuthLayout>
  );
}
