import { NavLink, useLocation } from 'react-router-dom';
import { TABS } from './tabs';

export function BottomTabBar() {
  const { pathname } = useLocation();

  return (
    <nav
      aria-label="Primary"
      className="fixed bottom-0 left-0 right-0 z-40 bg-surface-raised/95 backdrop-blur-lg border-t border-surface-border safe-bottom md:hidden"
    >
      <div className="flex items-center justify-around h-16 px-2">
        {TABS.map(({ path, label, Icon }) => {
          const isActive = pathname.startsWith(path);
          return (
            <NavLink
              key={path}
              to={path}
              className="flex flex-col items-center justify-center gap-0.5 py-1 px-3 rounded-xl transition-colors"
            >
              <div
                className={`p-1.5 rounded-xl transition-all duration-200 ${
                  isActive ? 'bg-brand-500/15 text-brand-400' : 'text-text-muted'
                }`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
              </div>
              <span
                className={`text-[10px] font-medium transition-colors ${
                  isActive ? 'text-brand-400' : 'text-text-muted'
                }`}
              >
                {label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
