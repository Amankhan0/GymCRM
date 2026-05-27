import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { leadSchema, LEAD_STATUS, LEAD_SOURCE } from '../../utils/validators';
import { applyServerError } from '@/lib/formErrors';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

// Title-case for the source/status dropdown labels — keeps the raw enum keys on the wire.
const fmt = (s) => s.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

const toDateInput = (d) => (d ? new Date(d).toISOString().slice(0, 10) : '');

export function LeadForm({ defaultValues, onSubmit, submitting }) {
  const isLost = defaultValues?.status === 'lost';

  const {
    register, handleSubmit, watch, setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: defaultValues?.name || '',
      contactCompany: defaultValues?.contactCompany || '',
      email: defaultValues?.email || '',
      phone: defaultValues?.phone || '',
      source: defaultValues?.source || 'other',
      status: defaultValues?.status || 'new',
      estimatedValue: defaultValues?.estimatedValue ?? '',
      description: defaultValues?.description || '',
      notes: defaultValues?.notes || '',
      followUpDate: toDateInput(defaultValues?.followUpDate),
      lostReason: defaultValues?.lostReason || '',
    },
  });

  const status = watch('status');

  const handleFormSubmit = async (values) => {
    // Empty strings should be sent as undefined so the server doesn't store ''.
    const cleaned = Object.fromEntries(
      Object.entries(values).map(([k, v]) => [k, v === '' ? undefined : v])
    );
    try {
      await onSubmit(cleaned);
    } catch (err) {
      applyServerError(err, setError, 'email');
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Lead name *</Label>
          <Input placeholder="Person or company" {...register('name')} />
          {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <Label>Their company</Label>
          <Input {...register('contactCompany')} />
        </div>
        <div>
          <Label>Email</Label>
          <Input type="email" {...register('email')} />
          {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <Label>Phone</Label>
          <Input type="tel" inputMode="numeric" maxLength={10} {...register('phone')} />
          {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone.message}</p>}
        </div>
        <div>
          <Label>Source</Label>
          <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm" {...register('source')}>
            {LEAD_SOURCE.map((s) => <option key={s} value={s}>{fmt(s)}</option>)}
          </select>
        </div>
        <div>
          <Label>Status</Label>
          <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm" {...register('status')}>
            {LEAD_STATUS.map((s) => <option key={s} value={s}>{fmt(s)}</option>)}
          </select>
        </div>
        <div>
          <Label>Estimated value (₹)</Label>
          <Input type="number" min="0" step="0.01" placeholder="optional" {...register('estimatedValue')} />
        </div>
        <div>
          <Label>Follow-up date</Label>
          <Input type="date" {...register('followUpDate')} />
        </div>
      </div>

      <div>
        <Label>What they're looking for</Label>
        <Textarea rows={2} placeholder="Requirements, quantities, timeline..." {...register('description')} />
      </div>

      <div>
        <Label>Notes</Label>
        <Textarea rows={2} placeholder="Internal notes" {...register('notes')} />
      </div>

      {/* Lost reason only relevant when status=lost. Shown conditionally so the form stays clean. */}
      {(status === 'lost' || isLost) && (
        <div>
          <Label>Lost reason</Label>
          <Input placeholder="Why didn't this convert?" {...register('lostReason')} />
        </div>
      )}

      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? 'Saving...' : 'Save'}
      </Button>
    </form>
  );
}
