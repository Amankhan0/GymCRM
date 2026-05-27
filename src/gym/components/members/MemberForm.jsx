import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { memberSchema } from '@/gym/utils/validators';
import { applyServerError } from '@/lib/formErrors';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loading } from '@/shared/components/Loading';
import { planService } from '@/gym/services/planService';
import { trainerService } from '@/gym/services/trainerService';

const toDateInput = (d) => (d ? new Date(d).toISOString().slice(0, 10) : '');

// Populated refs come back as objects; raw refs come back as strings. Normalize to a string id.
const refId = (v) => {
  if (!v) return '';
  if (typeof v === 'object') return String(v._id || '');
  return String(v);
};

export function MemberForm({ defaultValues, onSubmit, submitting }) {
  const [plans, setPlans] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    Promise.all([
      planService.list().then((res) => setPlans(res.data || [])),
      trainerService.list({ limit: 100 }).then((res) => setTrainers(res.data || [])),
    ]).then(() => setReady(true));
  }, []);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      name: defaultValues?.name || '',
      email: defaultValues?.email || '',
      phone: defaultValues?.phone || '',
      gender: defaultValues?.gender || 'male',
      joinDate: toDateInput(defaultValues?.joinDate),
      expiryDate: toDateInput(defaultValues?.expiryDate),
      membershipPlan: refId(defaultValues?.membershipPlan),
      trainer: refId(defaultValues?.trainer),
      status: defaultValues?.status || 'active',
      address: defaultValues?.address || '',
    },
  });

  // Wait for plans & trainers before rendering — otherwise the select renders before its options exist,
  // and the pre-selected value silently fails to match anything.
  if (!ready) return <Loading />;

  // Catch server-side 409 (duplicate email) and pin it next to the email field.
  const handleFormSubmit = async (values) => {
    try {
      await onSubmit(values);
    } catch (err) {
      applyServerError(err, setError, 'email');
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Name *</Label>
          <Input {...register('name')} />
          {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <Label>Phone *</Label>
          <Input
            type="tel"
            inputMode="numeric"
            maxLength={10}
            placeholder="10-digit mobile"
            {...register('phone')}
          />
          {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone.message}</p>}
        </div>
        <div>
          <Label>Email</Label>
          <Input type="email" {...register('email')} />
          {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <Label>Gender</Label>
          <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm" {...register('gender')}>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <Label>Join Date</Label>
          <Input type="date" {...register('joinDate')} />
        </div>
        <div>
          <Label>Expiry Date *</Label>
          <Input type="date" {...register('expiryDate')} />
          {errors.expiryDate && <p className="text-xs text-destructive mt-1">{errors.expiryDate.message}</p>}
        </div>
        <div>
          <Label>Membership Plan</Label>
          <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm" {...register('membershipPlan')}>
            <option value="">— None —</option>
            {plans.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name} ({p.duration})
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label>Trainer</Label>
          <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm" {...register('trainer')}>
            <option value="">— None —</option>
            {trainers.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label>Status</Label>
          <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm" {...register('status')}>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
      <div>
        <Label>Address</Label>
        <Textarea {...register('address')} />
      </div>
      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? 'Saving...' : 'Save'}
      </Button>
    </form>
  );
}
