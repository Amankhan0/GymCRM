import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { Users, Clock, IndianRupee, Check, X, Loader2 } from 'lucide-react';
import { adminApi } from '../services/aiService';

const TABS = ['pending', 'approved', 'rejected', 'all'];

export default function Admin() {
  const user = useSelector((s) => s.auth.user);
  const [tab, setTab] = useState('pending');
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const load = () => {
    setLoading(true);
    Promise.all([adminApi.requests(tab), adminApi.stats()])
      .then(([reqs, s]) => { setItems(reqs || []); setStats(s); })
      .catch(() => toast.error('Could not load admin data'))
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [tab]);

  // Only the admin account may see this page.
  if (!user?.isAdmin) return <Navigate to="/app" replace />;

  const act = async (id, kind) => {
    let reason;
    if (kind === 'reject') {
      reason = window.prompt('Reason for rejection?') || 'No reason provided';
    }
    setBusyId(id);
    try {
      if (kind === 'approve') await adminApi.approve(id);
      else await adminApi.reject(id, reason);
      toast.success(kind === 'approve' ? 'Approved — credits added ✨' : 'Rejected');
      load();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Action failed');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-white sm:text-3xl">Admin · Payments</h1>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        <StatCard icon={Users} label="AI users" value={stats?.totalUsers ?? '—'} />
        <StatCard icon={Clock} label="Pending" value={stats?.pending ?? '—'} />
        <StatCard icon={IndianRupee} label="Revenue" value={stats ? `₹${stats.revenue}` : '—'} />
      </div>

      {/* Tabs */}
      <div className="mb-5 inline-flex rounded-xl ae-glass p-1">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-lg px-4 py-1.5 text-sm font-medium capitalize transition ${tab === t ? 'bg-brand-grad text-white' : 'text-white/50 hover:text-white'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid place-items-center py-20 text-white/40"><Loader2 className="h-6 w-6 animate-spin" /></div>
      ) : items.length === 0 ? (
        <div className="ae-card grid place-items-center py-16 text-white/45">No {tab} requests.</div>
      ) : (
        <div className="space-y-2.5">
          {items.map((r) => (
            <div key={r._id} className="flex flex-col gap-3 rounded-2xl ae-glass p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="font-medium text-white">{r.user?.name} <span className="text-white/40">· {r.user?.email}</span></p>
                <p className="mt-0.5 text-sm text-white/55">
                  <span className="capitalize">{r.planKey}</span> · ₹{r.amount} · {r.credits} credits · UTR <span className="font-mono text-white/70">{r.utr}</span>
                </p>
                <p className="text-xs text-white/30">Paid: {new Date(r.paidAt).toLocaleString('en-IN')}</p>
              </div>
              {r.status === 'pending' ? (
                <div className="flex gap-2">
                  <button onClick={() => act(r._id, 'approve')} disabled={busyId === r._id} className="flex items-center gap-1.5 rounded-xl bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-300 hover:bg-emerald-500/25">
                    {busyId === r._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} Approve
                  </button>
                  <button onClick={() => act(r._id, 'reject')} disabled={busyId === r._id} className="flex items-center gap-1.5 rounded-xl bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-300 hover:bg-red-500/20">
                    <X className="h-4 w-4" /> Reject
                  </button>
                </div>
              ) : (
                <span className={`shrink-0 rounded-md px-2.5 py-1 text-xs font-semibold capitalize ${r.status === 'approved' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-red-500/15 text-red-300'}`}>
                  {r.status}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="ae-card p-4">
      <div className="mb-2 inline-grid h-8 w-8 place-items-center rounded-lg bg-brand/15 text-brand-soft"><Icon className="h-4 w-4" /></div>
      <p className="text-xs text-white/40">{label}</p>
      <p className="text-xl font-bold text-white">{value}</p>
    </div>
  );
}
