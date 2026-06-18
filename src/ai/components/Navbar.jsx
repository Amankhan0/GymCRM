import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Sparkles, Crown } from 'lucide-react';
import { Logo } from './Logo';
import { ProfileDropdown } from './ProfileDropdown';

const links = [
  { to: '/app', label: 'Generate', end: true },
  { to: '/history', label: 'History' },
  { to: '/subscription', label: 'Pricing' },
];

export function Navbar() {
  const user = useSelector((s) => s.auth.user);

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-ink-950/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Logo to="/app" />

        <nav className="hidden items-center gap-1 rounded-full ae-glass px-1.5 py-1.5 sm:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `rounded-full px-4 py-1.5 text-sm font-medium transition ${
                  isActive ? 'bg-white/10 text-white shadow-glow-sm' : 'text-white/55 hover:text-white'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2.5 sm:gap-3">
          <NavLink
            to="/subscription"
            className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-semibold text-white/80 transition hover:border-brand/40 hover:text-white"
          >
            {user?.unlimited ? (
              <>
                <Crown className="h-3.5 w-3.5 text-brand-soft" />
                <span className="hidden sm:inline">Lifetime</span>
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5 text-brand-soft" />
                {user?.credits ?? 0}
                <span className="hidden sm:inline">credits</span>
              </>
            )}
          </NavLink>
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
}
