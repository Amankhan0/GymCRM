import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Crown, Sparkles, Gauge, CalendarClock, LogOut, ArrowUpRight } from 'lucide-react';
import { logout } from '../store/slices/authSlice';

export default function Profile() {
  const user = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const unlimited = !!user?.unlimited;
  const hasPlan = user?.aiPlan && user.aiPlan !== 'none';
  const planLabel = unlimited
    ? 'Lifetime'
    : hasPlan
    ? `${user.aiPlan[0].toUpperCase()}${user.aiPlan.slice(1)}`
    : 'No plan';

  const ends = user?.subscriptionEndsAt ? new Date(user.subscriptionEndsAt) : null;
  const daysLeft = ends ? Math.max(0, Math.ceil((ends.getTime() - Date.now()) / 86400000)) : null;
  const validTill = ends
    ? ends.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : null;

  const initial = (user?.name || 'U').charAt(0).toUpperCase();

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 font-display text-2xl font-bold text-white sm:text-3xl">Profile</h1>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="ae-card overflow-hidden">
        {/* Banner */}
        <div className="relative h-24 bg-brand-grad">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.25),transparent_55%)]" />
        </div>

        {/* Centered avatar + identity */}
        <div className="flex flex-col items-center px-6 pb-6 text-center">
          <div className="-mt-12 grid h-24 w-24 place-items-center rounded-2xl bg-ink-800 text-3xl font-bold text-white shadow-glow ring-4 ring-ink-950">
            {user?.avatar ? (
              <img src={user.avatar} alt="" className="h-full w-full rounded-2xl object-cover" />
            ) : (
              initial
            )}
          </div>
          <h2 className="mt-4 font-display text-xl font-bold text-white">{user?.name}</h2>
          <p className="text-sm text-white/45">{user?.email}</p>

          {unlimited && (
            <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-brand/15 px-3 py-1 text-xs font-semibold text-brand-soft">
              <Crown className="h-3.5 w-3.5" /> Lifetime · Unlimited access
            </span>
          )}

          {/* Stats */}
          <div className="mt-6 grid w-full grid-cols-2 gap-3 sm:grid-cols-3">
            <Stat icon={Sparkles} label="Credits" value={unlimited ? '∞' : (user?.credits ?? 0)} />
            <Stat icon={Gauge} label="Plan" value={planLabel} />
            <Stat
              icon={CalendarClock}
              label={unlimited ? 'Validity' : 'Renews in'}
              value={unlimited ? 'Never expires' : hasPlan && daysLeft != null ? `${daysLeft} days` : '—'}
              sub={!unlimited && hasPlan && validTill ? validTill : null}
              className="col-span-2 sm:col-span-1"
            />
          </div>

          {/* Actions */}
          <div className="mt-6 w-full space-y-2.5">
            {!unlimited && (
              <button onClick={() => navigate('/subscription')} className="ae-btn w-full">
                <ArrowUpRight className="h-4 w-4" /> {hasPlan ? 'Manage / Upgrade plan' : 'Choose a plan'}
              </button>
            )}
            <button
              onClick={() => {
                dispatch(logout());
                navigate('/');
              }}
              className="ae-btn-ghost w-full !text-red-300/90"
            >
              <LogOut className="h-4 w-4" /> Log out
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function Stat({ icon: Icon, label, value, sub, className = '' }) {
  return (
    <div className={`ae-glass rounded-2xl p-4 text-left ${className}`}>
      <div className="mb-2 inline-grid h-8 w-8 place-items-center rounded-lg bg-brand/15 text-brand-soft">
        <Icon className="h-4 w-4" />
      </div>
      <p className="text-xs text-white/40">{label}</p>
      <p className="truncate text-lg font-semibold text-white">{value}</p>
      {sub && <p className="mt-0.5 text-[11px] text-white/35">till {sub}</p>}
    </div>
  );
}
