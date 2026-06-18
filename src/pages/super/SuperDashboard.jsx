import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Users,
  CreditCard,
  Clock,
  Inbox,
  IndianRupee,
  ShieldCheck,
  LogOut,
  Check,
  X,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Loading } from '@/shared/components/Loading';
import { EmptyState } from '@/shared/components/EmptyState';
import { StatCard } from '@/gym/components/dashboard/StatCard';
import { superadminService } from '@/services/superadminService';
import { formatCurrency, formatDate } from '@/lib/utils';

const requestVariant = { pending: 'warning', approved: 'success', rejected: 'destructive' };

// Which product (website) a user / payment belongs to.
const productMeta = {
  gym: { label: 'Gym', cls: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300' },
  b2b: { label: 'B2B', cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300' },
  ai: { label: 'AI', cls: 'bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300' },
};
function ProductBadge({ product }) {
  const m = productMeta[product] || { label: product || '—', cls: 'bg-muted text-muted-foreground' };
  return <span className={`inline-block rounded px-2 py-0.5 text-xs font-semibold ${m.cls}`}>{m.label}</span>;
}

export default function SuperDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [tab, setTab] = useState('pending'); // pending | all | users
  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Belt-and-braces noindex meta in addition to the Vercel response header for /super/*.
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => { document.head.removeChild(meta); };
  }, []);

  // If the stored token is missing/expired, bounce to login.
  useEffect(() => {
    if (!superadminService.isAuthed()) {
      navigate('/super');
    }
  }, [navigate]);

  const loadStats = async () => {
    try {
      const res = await superadminService.stats();
      setStats(res.data);
    } catch (err) {
      if (err?.response?.status === 401) {
        superadminService.logout();
        navigate('/super');
      }
    }
  };

  const loadTab = async (currentTab) => {
    setLoading(true);
    try {
      if (currentTab === 'users') {
        const res = await superadminService.users();
        setUsers(res.data || []);
      } else {
        const res = await superadminService.requests(currentTab);
        setRequests(res.data || []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
    loadTab(tab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const onApprove = async (id) => {
    if (!confirm('Approve this payment? Subscription will be extended.')) return;
    try {
      await superadminService.approve(id);
      toast.success('Approved & subscription extended');
      loadStats();
      loadTab(tab);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed');
    }
  };

  const onReject = async (id) => {
    const reason = prompt('Rejection reason (shown to user):');
    if (reason === null) return;
    try {
      await superadminService.reject(id, reason);
      toast.success('Rejected');
      loadStats();
      loadTab(tab);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed');
    }
  };

  const logout = () => {
    superadminService.logout();
    navigate('/super');
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-semibold">Super Admin</h1>
            <p className="text-xs text-slate-400">Platform control panel</p>
          </div>
        </div>
        <Button variant="secondary" size="sm" onClick={logout}>
          <LogOut className="h-4 w-4 mr-1" /> Logout
        </Button>
      </header>

      <main className="max-w-7xl mx-auto p-4 lg:p-6 space-y-6">
        {/* Stats */}
        {stats ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard title="Total Users" value={stats.totalUsers} icon={Users} tone="indigo" />
            <StatCard title="Active Subscriptions" value={stats.activeSubscriptions} icon={CreditCard} tone="green" />
            <StatCard title="On Trial" value={stats.trialUsers} icon={Clock} tone="amber" />
            <StatCard title="Pending Requests" value={stats.pendingRequests} icon={Inbox} tone="red" accent="text-red-600 dark:text-red-400" />
            <StatCard title="Total Revenue" value={formatCurrency(stats.totalRevenue)} icon={IndianRupee} tone="purple" />
          </div>
        ) : (
          <Loading />
        )}

        {/* Tabs */}
        <div className="flex gap-2 border-b">
          {[
            { id: 'pending', label: 'Pending requests' },
            { id: 'all',     label: 'All requests' },
            { id: 'users',   label: 'Users' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                tab === t.id
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <Card>
          <CardContent className="p-4">
            {loading ? (
              <Loading />
            ) : tab === 'users' ? (
              users.length === 0 ? (
                <EmptyState icon={Users} title="No users yet" />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Gym / Credits</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Sub ends</TableHead>
                      <TableHead>State</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((u) => (
                      <TableRow key={u._id}>
                        <TableCell className="font-medium">{u.name}</TableCell>
                        <TableCell><ProductBadge product={u.product} /></TableCell>
                        <TableCell className="text-xs">
                          {u.product === 'ai' ? `${u.credits ?? 0} credits` : u.gymName || '-'}
                        </TableCell>
                        <TableCell className="text-xs">{u.email}</TableCell>
                        <TableCell>{u.subscriptionEndsAt ? formatDate(u.subscriptionEndsAt) : '-'}</TableCell>
                        <TableCell>
                          <Badge variant={
                            u.state === 'active' ? 'success' :
                            u.state === 'trial'  ? 'warning' : 'destructive'
                          } className="capitalize">{u.state}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )
            ) : requests.length === 0 ? (
              <EmptyState icon={Inbox} title={tab === 'pending' ? 'No pending requests' : 'No requests'} />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>UTR</TableHead>
                    <TableHead>Paid at</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((r) => (
                    <TableRow key={r._id}>
                      <TableCell className="text-xs">{formatDate(r.createdAt)}</TableCell>
                      <TableCell><ProductBadge product={r.product} /></TableCell>
                      <TableCell>
                        <div className="font-medium">{r.user?.gymName || r.user?.name || '-'}</div>
                        <div className="text-xs text-muted-foreground">{r.user?.email}</div>
                      </TableCell>
                      <TableCell className="capitalize">{r.planKey}</TableCell>
                      <TableCell>{formatCurrency(r.amount)}</TableCell>
                      <TableCell className="font-mono text-xs">{r.utr}</TableCell>
                      <TableCell className="text-xs">{formatDate(r.paidAt)}</TableCell>
                      <TableCell>
                        <Badge variant={requestVariant[r.status] || 'secondary'} className="capitalize">{r.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {r.status === 'pending' ? (
                          <div className="flex gap-1 justify-end">
                            <Button size="sm" variant="outline" onClick={() => onApprove(r._id)}>
                              <Check className="h-4 w-4 text-green-700" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => onReject(r._id)}>
                              <X className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
