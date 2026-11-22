import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useCommunityStore } from '@/stores/communityStore';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';

export function CommunitySelectPage() {
  const navigate = useNavigate();
  const communities = useCommunityStore((s) => s.communities);
  const setActiveCommunity = useCommunityStore((s) => s.setActiveCommunity);
  const logout = useAuthStore((s) => s.logout);

  const choose = (communityId: string) => {
    setActiveCommunity(communityId);
    navigate('/feed', { replace: true });
  };

  return (
    <div className="min-h-screen bg-surface-base px-4 py-10">
      <div className="w-full max-w-md mx-auto">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl font-bold text-text-primary">Choose a community</h1>
            <p className="text-sm text-text-muted mt-0.5">You can switch later from the top bar.</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => logout()}>
            Sign out
          </Button>
        </div>

        {communities.length === 0 ? (
          <EmptyState
            title="No communities yet"
            description="Ask an admin of your department, hostel or estate to add you."
          />
        ) : (
          <ul className="space-y-3">
            {communities.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => choose(c.id)}
                  className="w-full text-left rounded-2xl focus-visible:outline-2 focus-visible:outline-brand-400"
                >
                  <Card hoverable className="flex items-center gap-4">
                    <Avatar name={c.name} src={c.avatarUrl} size="md" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-text-primary truncate">{c.name}</p>
                      <p className="text-xs text-text-muted capitalize">
                        {c.type} · {c.memberCount} members
                      </p>
                    </div>
                  </Card>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
