import { NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { ChevronDown, LogOut } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useCommunityStore } from '@/stores/communityStore';
import { Avatar } from '@/components/ui/Avatar';
import { TABS } from './tabs';

export function TopTabBar() {
  const { pathname } = useLocation();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { communities, activeCommunityId, setActiveCommunity } = useCommunityStore();
  const [pickerOpen, setPickerOpen] = useState(false);

  const activeCommunity = communities.find((c) => c.id === activeCommunityId);

  return (
    <header className="hidden md:flex fixed top-0 left-0 right-0 z-40 h-14 items-center justify-between gap-4 px-6 bg-surface-raised/95 backdrop-blur-lg border-b border-surface-border">
      {/* Logo + community picker */}
      <div className="flex items-center gap-4 min-w-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center font-bold text-white text-sm shadow-lg shadow-brand-500/20">
            C
          </div>
          <span className="text-sm font-bold text-text-primary tracking-tight">CivicOS</span>
        </div>

        {activeCommunity && (
          <div className="relative min-w-0">
            <button
              type="button"
              onClick={() => setPickerOpen((open) => !open)}
              aria-expanded={pickerOpen}
              className="flex items-center gap-1.5 max-w-[220px] px-3 py-1.5 rounded-lg bg-surface-overlay border border-surface-border hover:border-brand-500/40 transition text-xs font-medium text-text-secondary"
            >
              <span className="truncate">{activeCommunity.name}</span>
              <ChevronDown size={14} className="shrink-0" />
            </button>
            {pickerOpen && (
              <div className="absolute top-full left-0 mt-1.5 w-56 bg-surface-raised border border-surface-border rounded-xl shadow-2xl overflow-hidden z-50">
                {communities.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setActiveCommunity(c.id);
                      setPickerOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-surface-overlay transition ${
                      c.id === activeCommunityId ? 'text-brand-400 bg-brand-500/10' : 'text-text-secondary'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Primary tabs */}
      <nav aria-label="Primary" className="flex items-center gap-1">
        {TABS.map(({ path, label, Icon }) => {
          const isActive = pathname.startsWith(path);
          return (
            <NavLink
              key={path}
              to={path}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-brand-500/15 text-brand-400'
                  : 'text-text-muted hover:text-text-primary hover:bg-surface-overlay'
              }`}
            >
              <Icon size={16} strokeWidth={isActive ? 2.5 : 1.8} />
              {label}
            </NavLink>
          );
        })}
      </nav>

      {/* User */}
      <div className="flex items-center gap-3">
        {user && (
          <>
            <Avatar name={user.fullName} src={user.avatarUrl} size="sm" />
            <button
              type="button"
              onClick={logout}
              aria-label="Sign out"
              title="Sign out"
              className="p-2 rounded-lg hover:bg-surface-overlay text-text-muted hover:text-red-400 transition"
            >
              <LogOut size={16} />
            </button>
          </>
        )}
      </div>
    </header>
  );
}
