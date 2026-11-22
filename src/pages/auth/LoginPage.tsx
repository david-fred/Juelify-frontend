import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/Button';
import { AuthLayout, Field, inputClass } from './AuthLayout';

export function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const login = useAuthStore((s) => s.login);
  const isLoading = useAuthStore((s) => s.isLoading);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const sessionExpired = searchParams.get('expired') === '1';

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/feed', { replace: true });
    } catch (err) {
      setError(
        isAxiosError(err) && err.response?.status === 401
          ? 'Invalid email or password.'
          : 'Could not reach the server. Please try again.',
      );
    }
  };

  const message = error || (sessionExpired ? 'Your session expired. Please sign in again.' : '');

  return (
    <AuthLayout title="Welcome to CivicOS" subtitle="Sign in to your community">
      <form onSubmit={handleSubmit} className="space-y-4">
        {message && (
          <div
            role="alert"
            className={`rounded-xl border px-4 py-3 text-sm ${
              error
                ? 'bg-red-500/10 border-red-500/30 text-red-400'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
            }`}
          >
            {message}
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
            placeholder="you@university.edu"
            className={inputClass}
          />
        </Field>

        <Field id="password" label="Password">
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className={`${inputClass} pr-11`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </Field>

        <Button type="submit" loading={isLoading} className="w-full" size="lg">
          Sign in
        </Button>
      </form>

      <p className="text-center text-sm text-text-muted mt-6">
        New here?{' '}
        <Link to="/register" className="text-brand-400 hover:text-brand-300 font-medium transition">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
}
