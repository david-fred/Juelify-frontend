import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { communitiesApi } from '@/api/endpoints/communities';
import type { CommunityType } from '@/api/types';
import { useAuthStore } from '@/stores/authStore';
import { useCommunityStore } from '@/stores/communityStore';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { inputClass } from './AuthLayout';

const TYPE_LABELS: Record<CommunityType, string> = {
  general: 'General',
  department: 'Department',
  lodge: 'Lodge',
  association: 'Association',
};

export function CommunitySelectPage() {
  const navigate = useNavigate();
  const communities = useCommunityStore((s) => s.communities);
  const setCommunities = useCommunityStore((s) => s.setCommunities);
  const setActiveCommunity = useCommunityStore((s) => s.setActiveCommunity);
  const logout = useAuthStore((s) => s.logout);

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [communityType, setCommunityType] = useState<CommunityType>('general');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const choose = (communityId: string) => {
    setActiveCommunity(communityId);
    navigate('/feed', { replace: true });
  };

  const create = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const created = await communitiesApi.create({
        name: name.trim(),
        communityType,
        description: description.trim() || undefined,
      });
      setCommunities([created, ...communities]);
      choose(created.id);
    } catch (err) {
      setError(
        isAxiosError(err) && err.response?.status === 422
          ? 'Check the community name. It needs at least 2 characters.'
          : 'Could not create the community. Please try again.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-base px-4 py-10">
      <div className="mx-auto w-full max-w-md space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-text-primary">Choose a community</h1>
            <p className="mt-0.5 text-sm text-text-muted">You can switch later from the top bar.</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => void logout()}>
            Sign out
          </Button>
        </div>

        {communities.length === 0 && !showForm && (
          <EmptyState
            title="No communities yet"
            description="Create one to get started, or ask an admin to add you."
            action={<Button onClick={() => setShowForm(true)}>Create a community</Button>}
          />
        )}

        {communities.length > 0 && (
          <ul className="space-y-3">
            {communities.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => choose(c.id)}
                  disabled={c.status === 'pending_deletion'}
                  className="w-full rounded-2xl text-left focus-visible:outline-2 focus-visible:outline-brand-400 disabled:opacity-50"
                >
                  <Card hoverable className="flex items-center gap-4">
                    <Avatar name={c.name} size="md" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-text-primary">{c.name}</p>
                      <p className="text-xs text-text-muted">
                        {TYPE_LABELS[c.communityType]}
                        {c.status !== 'active' && ` · ${c.status.replace('_', ' ')}`}
                      </p>
                    </div>
                  </Card>
                </button>
              </li>
            ))}
          </ul>
        )}

        {communities.length > 0 && !showForm && (
          <Button variant="secondary" className="w-full" onClick={() => setShowForm(true)}>
            Create a community
          </Button>
        )}

        {showForm && (
          <form onSubmit={create} className="space-y-4 rounded-2xl border border-surface-border bg-surface-raised p-5">
            {error && (
              <div role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}
            <div>
              <label htmlFor="communityName" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-muted">
                Name
              </label>
              <input
                id="communityName"
                type="text"
                minLength={2}
                maxLength={150}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="communityType" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-muted">
                Type
              </label>
              <select
                id="communityType"
                value={communityType}
                onChange={(e) => setCommunityType(e.target.value as CommunityType)}
                className={inputClass}
              >
                {(Object.keys(TYPE_LABELS) as CommunityType[]).map((type) => (
                  <option key={type} value={type}>
                    {TYPE_LABELS[type]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="communityDescription" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-muted">
                Description (optional)
              </label>
              <textarea
                id="communityDescription"
                rows={3}
                maxLength={2000}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`${inputClass} resize-none`}
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" loading={submitting} className="flex-1">
                Create
              </Button>
              <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
