import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Check, Loader2, Crown, Sparkles, X, Clock, CheckCircle2, XCircle, QrCode } from 'lucide-react';
import { accountApi } from '../services/aiService';
import { PLAN_FALLBACK } from '../lib/constants';

const reqBadge = {
  pending: { label: 'Pending', cls: 'bg-amber-500/15 text-amber-300', icon: Clock },
  approved: { label: 'Approved', cls: 'bg-emerald-500/15 text-emerald-300', icon: CheckCircle2 },
  rejected: { label: 'Rejected', cls: 'bg-red-500/15 text-red-300', icon: XCircle },
};

export default function Subscription() {
  const [plans, setPlans] = useState(PLAN_FALLBACK);
  const [sub, setSub] = useState(null);
  const [selected, setSelected] = useState(null); // plan object for payment modal
  const user = useSelector((s) => s.auth.user);

  const loadPlans = () => accountApi.plans().then((d) => {
    if (d?.plans?.length) setPlans(d.plans);
  }).catch(() => {});
  const loadSub = () => accountApi.mySub().then(setSub).catch(() => {});

  useEffect(() => {
    loadPlans();
    loadSub();
  }, []);

  const pendingReq = sub?.requests?.find((r) => r.status === 'pending');

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-3 text-center">
        {user?.unlimited && (
          <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-brand/15 px-3 py-1 text-xs font-semibold text-brand-soft">
            <Crown className="h-3.5 w-3.5" /> Lifetime unlimited access
          </span>
        )}
        <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
          Buy <span className="ae-gradient-text">credits</span>
        </h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-white/45">
          Pay via UPI and submit the reference — we verify & add your credits manually.
        </p>
      </div>

      {pendingReq && (
        <div className="mx-auto mt-6 max-w-xl rounded-2xl border border-amber-500/25 bg-amber-500/10 p-4 text-center text-sm text-amber-200">
          <Clock className="mx-auto mb-1 h-5 w-5" />
          Your <b>{pendingReq.planKey}</b> payment is under review. Credits will be added once approved.
        </div>
      )}

      {/* Plans */}
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {plans.map((p, i) => {
          const highlight = p.highlight || p.key === 'pro';
          return (
            <motion.div
              key={p.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`relative flex flex-col rounded-3xl p-6 ${highlight ? 'ae-glass-strong ring-1 ring-brand/40 shadow-glow' : 'ae-card'}`}
            >
              {highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-grad px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow-glow-sm">
                  Most popular
                </span>
              )}
              <h3 className="font-display text-lg font-bold text-white">{p.name}</h3>
              <div className="mt-3 flex items-end gap-1">
                <span className="font-display text-4xl font-extrabold text-white">₹{p.price}</span>
                <span className="mb-1.5 text-sm text-white/40">/mo</span>
              </div>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-brand-soft">
                <Sparkles className="h-3.5 w-3.5" /> {p.credits} credits
              </p>
              <ul className="mt-5 flex-1 space-y-2.5">
                {p.perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-2 text-sm text-white/65">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-soft" /> {perk}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setSelected(p)}
                disabled={user?.unlimited || !!pendingReq}
                className={`mt-6 w-full ${highlight ? 'ae-btn' : 'ae-btn-ghost'}`}
              >
                {user?.unlimited ? 'Unlimited active' : pendingReq ? 'Request pending' : 'Buy now'}
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Request history */}
      {sub?.requests?.length > 0 && (
        <div className="mx-auto mt-12 max-w-xl">
          <h3 className="mb-3 text-sm font-semibold text-white/70">Your payments</h3>
          <div className="space-y-2">
            {sub.requests.map((r) => {
              const b = reqBadge[r.status] || reqBadge.pending;
              return (
                <div key={r._id} className="flex items-center justify-between rounded-xl ae-glass px-4 py-3 text-sm">
                  <div>
                    <span className="font-medium text-white capitalize">{r.planKey}</span>
                    <span className="text-white/40"> · ₹{r.amount} · {r.credits} credits</span>
                  </div>
                  <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold ${b.cls}`}>
                    <b.icon className="h-3 w-3" /> {b.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Payment modal */}
      <AnimatePresence>
        {selected && (
          <PaymentModal
            plan={selected}
            onClose={() => setSelected(null)}
            onDone={() => { setSelected(null); loadSub(); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function PaymentModal({ plan, onClose, onDone }) {
  const [utr, setUtr] = useState('');
  const [paidAt, setPaidAt] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!utr.trim()) return toast.error('Enter the UPI transaction reference (UTR)');
    if (!paidAt) return toast.error('Select the payment date & time');
    setBusy(true);
    try {
      await accountApi.submitRequest({ planKey: plan.key, utr: utr.trim(), paidAt });
      toast.success('Payment submitted — credits will be added after verification ✨');
      onDone();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Submission failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md overflow-hidden rounded-3xl ae-glass-strong"
      >
        <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
          <h3 className="font-display font-bold text-white">{plan.name} · ₹{plan.price}</h3>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-white/50 hover:bg-white/5 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 p-5">
          {/* Step 1 — pay */}
          <div className="text-center">
            <p className="mb-3 flex items-center justify-center gap-1.5 text-xs font-medium uppercase tracking-wide text-white/40">
              <QrCode className="h-3.5 w-3.5" /> Step 1 — Pay ₹{plan.price} via UPI
            </p>
            <div className="mx-auto w-fit rounded-2xl bg-white p-2">
              <img src="/payment-qr.jpg" alt="Payment QR code" width={190} height={190} className="rounded-lg object-contain" />
            </div>
            <p className="mt-3 text-xs text-white/40">Scan with any UPI app & pay ₹{plan.price}.</p>
          </div>

          {/* Step 2 — submit reference */}
          <form onSubmit={submit} className="space-y-3 border-t border-white/[0.06] pt-4">
            <p className="text-xs font-medium uppercase tracking-wide text-white/40">Step 2 — Submit payment proof</p>
            <input className="ae-input" placeholder="UPI Transaction ID / UTR" value={utr} onChange={(e) => setUtr(e.target.value)} />
            <input type="datetime-local" className="ae-input [color-scheme:dark]" value={paidAt} onChange={(e) => setPaidAt(e.target.value)} />
            <button type="submit" disabled={busy} className="ae-btn w-full">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Submit for verification'}
            </button>
            <p className="text-center text-[11px] text-white/35">
              Credits are added after we verify your payment (usually quick).
            </p>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}
