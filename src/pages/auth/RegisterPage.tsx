import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/Button';
import { AuthLayout, Field, inputClass } from './AuthLayout';

const MIN_PASSWORD_LENGTH = 8;

export function RegisterPage() {
  const navigate = useNavigate();
  const register = useAuthStore((s) => s.register);
  const isLoading = useAuthStore((s) => s.isLoading);

  const [fullName, setFullName] = useState('');
  const [matricId, setMatricId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }

    try {
      await register(email, password, fullName.trim(), matricId.trim() || undefined);
      navigate('/feed', { replace: true });
    } catch (err) {
      setError(
        isAxiosError(err) && err.response?.status === 409
          ? 'An account with this email already exists.'
          : 'Could not create your account. Please try again.',
      );
    }
  };

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
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className={inputClass}
          />
        </Field>

        <Field id="matricId" label="Matric / staff ID (optional)">
          <input
            id="matricId"
            type="text"
            value={matricId}
            onChange={(e) => setMatricId(e.target.value)}
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

        <Field id="password" label="Password">
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={MIN_PASSWORD_LENGTH}
            className={inputClass}
          />
        </Field>

        <Button type="submit" loading={isLoading} className="w-full" size="lg">
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
