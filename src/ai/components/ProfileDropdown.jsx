import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { User, CreditCard, LogOut, Crown, ShieldCheck } from 'lucide-react';
import { logout } from '../store/slices/authSlice';

export function ProfileDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const user = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const initial = (user?.name || 'U').charAt(0).toUpperCase();
  const go = (path) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="grid h-9 w-9 place-items-center rounded-full bg-brand-grad text-sm font-bold text-white shadow-glow-sm ring-1 ring-white/10 transition hover:brightness-110"
        aria-label="Account menu"
      >
        {user?.avatar ? (
          <img src={user.avatar} alt="" className="h-full w-full rounded-full object-cover" />
        ) : (
          initial
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-60 overflow-hidden rounded-2xl ae-glass-strong p-1.5 shadow-2xl animate-fade-up">
          <div className="px-3 py-2.5">
            <p className="truncate text-sm font-semibold text-white">{user?.name}</p>
            <p className="truncate text-xs text-white/45">{user?.email}</p>
            <div className="mt-2 flex items-center gap-1.5">
              {user?.unlimited ? (
                <span className="inline-flex items-center gap-1 rounded-md bg-brand/15 px-2 py-0.5 text-[11px] font-semibold text-brand-soft">
                  <Crown className="h-3 w-3" /> Lifetime
                </span>
              ) : (
                <span className="rounded-md bg-white/5 px-2 py-0.5 text-[11px] font-medium text-white/60">
                  {user?.credits ?? 0} credits
                </span>
              )}
            </div>
          </div>
          <div className="my-1 h-px bg-white/10" />
          <button onClick={() => go('/profile')} className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-white/80 hover:bg-white/5">
            <User className="h-4 w-4" /> Profile
          </button>
          <button onClick={() => go('/subscription')} className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-white/80 hover:bg-white/5">
            <CreditCard className="h-4 w-4" /> Subscription
          </button>
          {user?.isAdmin && (
            <button onClick={() => go('/admin')} className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-brand-soft hover:bg-white/5">
              <ShieldCheck className="h-4 w-4" /> Admin panel
            </button>
          )}
          <div className="my-1 h-px bg-white/10" />
          <button
            onClick={() => {
              dispatch(logout());
              navigate('/');
            }}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-red-300/90 hover:bg-red-500/10"
          >
            <LogOut className="h-4 w-4" /> Log out
          </button>
        </div>
      )}
    </div>
  );
}
