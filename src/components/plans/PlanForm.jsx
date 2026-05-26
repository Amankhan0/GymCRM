import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { planSchema } from '@/utils/validators';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export function PlanForm({ defaultValues, onSubmit, submitting }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(planSchema),
    defaultValues: {
      name: defaultValues?.name || '',
      duration: defaultValues?.duration || 'monthly',
      durationInDays: defaultValues?.durationInDays || 30,
      price: defaultValues?.price || 0,
      description: defaultValues?.description || '',
      features: (defaultValues?.features || []).join(', '),
      isActive: defaultValues?.isActive ?? true,
    },
  });

  const submitWrapper = (values) => {
    const features = values.features
      ? values.features.split(',').map((f) => f.trim()).filter(Boolean)
      : [];
    onSubmit({ ...values, features });
  };

  return (
    <form onSubmit={handleSubmit(submitWrapper)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Plan name *</Label>
          <Input {...register('name')} />
          {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <Label>Duration *</Label>
          <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm" {...register('duration')}>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="half-yearly">Half-yearly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
        <div>
          <Label>Duration in days *</Label>
          <Input type="number" min="1" {...register('durationInDays')} />
          {errors.durationInDays && <p className="text-xs text-destructive mt-1">{errors.durationInDays.message}</p>}
        </div>
        <div>
          <Label>Price *</Label>
          <Input type="number" min="0" {...register('price')} />
          {errors.price && <p className="text-xs text-destructive mt-1">{errors.price.message}</p>}
        </div>
      </div>
      <div>
        <Label>Description</Label>
        <Textarea {...register('description')} />
      </div>
      <div>
        <Label>Features (comma-separated)</Label>
        <Input {...register('features')} placeholder="Gym access, Locker, Trainer sessions" />
      </div>
      <label className="flex items-center gap-2">
        <input type="checkbox" {...register('isActive')} />
        <span className="text-sm">Active</span>
      </label>
      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? 'Saving...' : 'Save'}
      </Button>
    </form>
  );
}
