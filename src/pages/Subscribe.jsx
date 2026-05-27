import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { CheckCircle2, Clock, XCircle, AlertCircle, ScanLine } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loading } from '@/components/common/Loading';

import { subscriptionService } from '@/services/subscriptionService';
import { useAuth } from '@/hooks/useAuth';
import { useDispatch } from 'react-redux';
import { updateUser } from '@/store/slices/authSlice';
import { formatCurrency, formatDate, cn } from '@/lib/utils';

const stateMeta = {
  trial:   { label: 'Free trial', variant: 'warning', icon: Clock },
  active:  { label: 'Active',     variant: 'success', icon: CheckCircle2 },
  expired: { label: 'Expired',    variant: 'destructive', icon: XCircle },
};

const requestVariant = { pending: 'warning', approved: 'success', rejected: 'destructive' };

export default function Subscribe() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const dispatch = useDispatch();

  const [plans, setPlans] = useState([]);
  const [status, setStatus] = useState(null);
  const [selected, setSelected] = useState(null);
  const [utr, setUtr] = useState('');
  const [paidAt, setPaidAt] = useState(() => new Date().toISOString().slice(0, 16));
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    const [pRes, sRes] = await Promise.all([
      subscriptionService.plans(),
      subscriptionService.status(),
    ]);
    setPlans(pRes.data || []);
    setStatus(sRes.data);
    if (!selected && pRes.data?.length) setSelected(pRes.data[0]);
    // Keep the cached user.subscriptionEndsAt fresh too
    if (sRes.data && user) {
      dispatch(updateUser({
        trialEndsAt: sRes.data.trialEndsAt,
        subscriptionEndsAt: sRes.data.subscriptionEndsAt,
        subscriptionState: sRes.data.state,
      }));
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!selected) return toast.error('Pick a plan first');
    if (!utr.trim()) return toast.error('Enter the UTR / transaction reference');

    setSubmitting(true);
    try {
      await subscriptionService.submit({
        planKey: selected.key,
        utr: utr.trim(),
        paidAt,
        notes,
      });
      toast.success('Request submitted! You will get access once admin approves.');
      setUtr('');
      setNotes('');
      load();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Submit failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (!status) return <Loading label="Loading subscription..." />;

  const StateIcon = stateMeta[status.state]?.icon || AlertCircle;
  const stateInfo = stateMeta[status.state];

  return (
    <div className="max-w-5xl mx-auto p-4 lg:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Subscription</h1>
        <p className="text-sm text-muted-foreground">
          Scan the QR, pay, then submit the UTR — admin verifies and unlocks access.
        </p>
      </div>

      {/* Status banner */}
      <Card>
        <CardContent className="p-6 flex items-center gap-4">
          <div className={cn(
            'rounded-full p-3',
            status.state === 'active' && 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
            status.state === 'trial'   && 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
            status.state === 'expired' && 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
          )}>
            <StateIcon className="h-6 w-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold">Status:</span>
              <Badge variant={stateInfo?.variant || 'secondary'}>{stateInfo?.label || status.state}</Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {status.state === 'trial' && `Free trial ends on ${formatDate(status.trialEndsAt)}`}
              {status.state === 'active' && `Subscription active till ${formatDate(status.subscriptionEndsAt)}`}
              {status.state === 'expired' && 'Trial / subscription expired — submit a payment below to renew.'}
            </p>
          </div>
          {status.state === 'active' && (
            <Button onClick={() => navigate('/dashboard')}>Go to dashboard</Button>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: QR + payment instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><ScanLine className="h-5 w-5" /> Pay via UPI</CardTitle>
            <CardDescription>Scan the QR with any UPI app and pay the plan amount.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <img
                src="/payment-qr.jpg"
                alt="Payment QR code"
                className="rounded-lg border max-w-xs w-full"
              />
            </div>
            <div className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
              <p className="font-medium text-foreground mb-1">After paying:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Copy the <strong>UTR / Transaction reference</strong> from your UPI app</li>
                <li>Pick the plan you paid for</li>
                <li>Submit the form on the right</li>
                <li>Admin will verify within ~24 hours and activate</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Right: plan picker + UTR form */}
        <Card>
          <CardHeader>
            <CardTitle>Submit payment</CardTitle>
            <CardDescription>Fill this only after paying via QR.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <Label className="mb-2 block">Plan</Label>
                <div className="grid grid-cols-2 gap-2">
                  {plans.map((p) => (
                    <button
                      key={p.key}
                      type="button"
                      onClick={() => setSelected(p)}
                      className={cn(
                        'rounded-lg border-2 p-3 text-left transition-colors',
                        selected?.key === p.key ? 'border-primary bg-primary/5' : 'border-input hover:bg-accent'
                      )}
                    >
                      <div className="text-sm font-medium">{p.label}</div>
                      <div className="text-lg font-bold mt-1">{formatCurrency(p.amount)}</div>
                      <div className="text-xs text-muted-foreground">{p.durationDays} days</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label>UTR / Transaction Reference</Label>
                <Input value={utr} onChange={(e) => setUtr(e.target.value)} placeholder="e.g. 412345678901" />
              </div>

              <div>
                <Label>Payment date &amp; time</Label>
                <Input type="datetime-local" value={paidAt} onChange={(e) => setPaidAt(e.target.value)} />
              </div>

              <div>
                <Label>Notes (optional)</Label>
                <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
              </div>

              <Button type="submit" disabled={submitting} className="w-full">
                {submitting ? 'Submitting...' : 'Submit for approval'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* History */}
      <Card>
        <CardHeader>
          <CardTitle>Your requests</CardTitle>
          <CardDescription>Recent subscription payment submissions.</CardDescription>
        </CardHeader>
        <CardContent>
          {status.requests?.length ? (
            <div className="divide-y">
              {status.requests.map((r) => (
                <div key={r._id} className="py-3 flex items-center gap-3 flex-wrap">
                  <Badge variant={requestVariant[r.status] || 'secondary'} className="capitalize">{r.status}</Badge>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">
                      {r.planKey} · {formatCurrency(r.amount)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      UTR: {r.utr} · Paid {formatDate(r.paidAt)}
                      {r.rejectionReason && <> · Rejected: {r.rejectionReason}</>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No requests yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
