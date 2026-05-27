import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { ScanLine, CheckCircle2, Clock, XCircle } from 'lucide-react';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loading } from '@/components/common/Loading';

import { subscriptionService } from '@/services/subscriptionService';
import { setSubscriptionDialogOpen } from '@/store/slices/uiSlice';
import { updateUser } from '@/store/slices/authSlice';
import { useAuth } from '@/hooks/useAuth';
import { formatCurrency, formatDate, cn } from '@/lib/utils';

const stateMeta = {
  trial:   { label: 'Trial',   variant: 'warning',     icon: Clock },
  active:  { label: 'Active',  variant: 'success',     icon: CheckCircle2 },
  expired: { label: 'Expired', variant: 'destructive', icon: XCircle },
};

const requestVariant = { pending: 'warning', approved: 'success', rejected: 'destructive' };

export function SubscriptionDialog() {
  const open = useSelector((s) => s.ui.subscriptionDialogOpen);
  const dispatch = useDispatch();
  const { user } = useAuth();

  const [plans, setPlans] = useState([]);
  const [status, setStatus] = useState(null);
  const [selected, setSelected] = useState(null);
  const [utr, setUtr] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const close = () => dispatch(setSubscriptionDialogOpen(false));

  const load = async () => {
    const [pRes, sRes] = await Promise.all([
      subscriptionService.plans(),
      subscriptionService.status(),
    ]);
    setPlans(pRes.data || []);
    setStatus(sRes.data);
    if (pRes.data?.length) setSelected((curr) => curr || pRes.data[0]);
    if (sRes.data && user) {
      dispatch(updateUser({
        trialEndsAt: sRes.data.trialEndsAt,
        subscriptionEndsAt: sRes.data.subscriptionEndsAt,
        subscriptionState: sRes.data.state,
      }));
    }
  };

  // Only fetch when the dialog opens — avoids unnecessary hits when user never opens it.
  useEffect(() => {
    if (open) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!selected) return toast.error('Pick a plan first');
    if (!utr.trim()) return toast.error('Enter the UTR / transaction reference');

    setSubmitting(true);
    try {
      // paidAt auto-set to "now" — user doesn't enter date/time, backend just needs the field
      await subscriptionService.submit({
        planKey: selected.key,
        utr: utr.trim(),
        paidAt: new Date().toISOString(),
      });
      toast.success('Request submitted — admin will verify shortly.');
      setUtr('');
      load();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Submit failed');
    } finally {
      setSubmitting(false);
    }
  };

  const StateIcon = stateMeta[status?.state]?.icon || Clock;
  const stateInfo = stateMeta[status?.state];

  return (
    <Dialog open={open} onOpenChange={(v) => dispatch(setSubscriptionDialogOpen(v))}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ScanLine className="h-5 w-5" /> Subscription
          </DialogTitle>
          <DialogDescription>Scan the QR, pay, then submit the UTR.</DialogDescription>
        </DialogHeader>

        {!status ? (
          <Loading />
        ) : (
          <div className="space-y-4">
            {/* Status pill */}
            <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2">
              <StateIcon className={cn(
                'h-4 w-4',
                status.state === 'active'  && 'text-green-600',
                status.state === 'trial'   && 'text-amber-600',
                status.state === 'expired' && 'text-red-600',
              )} />
              <Badge variant={stateInfo?.variant || 'secondary'}>{stateInfo?.label || status.state}</Badge>
              <span className="text-xs text-muted-foreground truncate">
                {status.state === 'trial'   && `Ends ${formatDate(status.trialEndsAt)}`}
                {status.state === 'active'  && `Till ${formatDate(status.subscriptionEndsAt)}`}
                {status.state === 'expired' && 'Renew to regain access'}
              </span>
            </div>

            {/* QR */}
            <div className="flex justify-center">
              <img
                src="/payment-qr.jpg"
                alt="Payment QR code"
                className="rounded-lg border w-44 h-44 object-contain bg-white"
              />
            </div>

            <form onSubmit={onSubmit} className="space-y-3">
              {/* Plan picker — shows amount; user just picks one */}
              <div>
                <Label className="mb-2 block text-xs">Select plan</Label>
                <div className="grid grid-cols-2 gap-2">
                  {plans.map((p) => (
                    <button
                      key={p.key}
                      type="button"
                      onClick={() => setSelected(p)}
                      className={cn(
                        'rounded-md border-2 p-2 text-left transition-colors',
                        selected?.key === p.key ? 'border-primary bg-primary/5' : 'border-input hover:bg-accent'
                      )}
                    >
                      <div className="text-xs font-medium">{p.label}</div>
                      <div className="text-base font-bold">{formatCurrency(p.amount)}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-xs">UTR / Transaction Reference</Label>
                <Input
                  value={utr}
                  onChange={(e) => setUtr(e.target.value)}
                  placeholder="e.g. 412345678901"
                />
              </div>

              <Button type="submit" disabled={submitting} className="w-full">
                {submitting ? 'Submitting...' : 'Submit for approval'}
              </Button>
            </form>

            {/* Recent requests — compact */}
            {status.requests?.length > 0 && (
              <div className="border-t pt-3">
                <p className="text-xs font-medium mb-2 text-muted-foreground">Recent requests</p>
                <div className="space-y-1.5 max-h-32 overflow-y-auto">
                  {status.requests.slice(0, 5).map((r) => (
                    <div key={r._id} className="flex items-center gap-2 text-xs">
                      <Badge variant={requestVariant[r.status] || 'secondary'} className="capitalize text-[10px] px-1.5 py-0">
                        {r.status}
                      </Badge>
                      <span className="capitalize">{r.planKey}</span>
                      <span className="text-muted-foreground">·</span>
                      <span className="font-mono truncate flex-1">{r.utr}</span>
                      <span className="text-muted-foreground">{formatCurrency(r.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
