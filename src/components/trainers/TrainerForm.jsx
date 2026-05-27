import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { trainerSchema } from '@/utils/validators';
import { applyServerError } from '@/lib/formErrors';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export function TrainerForm({ defaultValues, onSubmit, submitting }) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(trainerSchema),
    defaultValues: {
      name: defaultValues?.name || '',
      email: defaultValues?.email || '',
      phone: defaultValues?.phone || '',
      gender: defaultValues?.gender || 'male',
      specialization: defaultValues?.specialization || '',
      experience: defaultValues?.experience ?? 0,
      salary: defaultValues?.salary ?? 0,
      status: defaultValues?.status || 'active',
      bio: defaultValues?.bio || '',
    },
  });

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
          <Label>Specialization</Label>
          <Input {...register('specialization')} placeholder="e.g. Strength training" />
        </div>
        <div>
          <Label>Experience (years)</Label>
          <Input type="number" min="0" {...register('experience')} />
        </div>
        <div>
          <Label>Salary</Label>
          <Input type="number" min="0" {...register('salary')} />
        </div>
        <div>
          <Label>Status</Label>
          <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm" {...register('status')}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
      <div>
        <Label>Bio</Label>
        <Textarea {...register('bio')} />
      </div>
      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? 'Saving...' : 'Save'}
      </Button>
    </form>
  );
}
