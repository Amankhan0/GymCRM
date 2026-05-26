import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { paymentSchema } from '@/utils/validators';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loading } from '@/components/common/Loading';
import { memberService } from '@/services/memberService';
import { planService } from '@/services/planService';

export function PaymentForm({ onSubmit, submitting, defaultMemberId = '', lockMember = false }) {
  const [members, setMembers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    Promise.all([
      memberService.list({ limit: 200 }).then((r) => setMembers(r.data || [])),
      planService.list().then((r) => setPlans(r.data || [])),
    ]).then(() => setReady(true));
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      memberId: defaultMemberId || '',
      planId: '',
      paymentMethod: 'cash',
      amount: '',
      transactionId: '',
      notes: '',
    },
  });

  if (!ready) return <Loading />;

  const lockedMember = lockMember ? members.find((m) => m._id === defaultMemberId) : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label>Member *</Label>
        {lockMember && lockedMember ? (
          <Input value={`${lockedMember.name} (${lockedMember.phone})`} readOnly disabled />
        ) : (
          <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm" {...register('memberId')}>
            <option value="">Select member</option>
            {members.map((m) => (
              <option key={m._id} value={m._id}>
                {m.name} ({m.phone})
              </option>
            ))}
          </select>
        )}
        {errors.memberId && <p className="text-xs text-destructive mt-1">{errors.memberId.message}</p>}
        {lockMember && <input type="hidden" {...register('memberId')} />}
      </div>
      <div>
        <Label>Plan *</Label>
        <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm" {...register('planId')}>
          <option value="">Select plan</option>
          {plans.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name} — ₹{p.price}
            </option>
          ))}
        </select>
        {errors.planId && <p className="text-xs text-destructive mt-1">{errors.planId.message}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Amount</Label>
          <Input type="number" min="0" {...register('amount')} placeholder="Defaults to plan price" />
        </div>
        <div>
          <Label>Method</Label>
          <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm" {...register('paymentMethod')}>
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="upi">UPI</option>
            <option value="bank-transfer">Bank transfer</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>
      <div>
        <Label>Transaction ID</Label>
        <Input {...register('transactionId')} />
      </div>
      <div>
        <Label>Notes</Label>
        <Textarea {...register('notes')} />
      </div>
      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? 'Saving...' : 'Record payment'}
      </Button>
    </form>
  );
}
