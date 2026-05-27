import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema } from '../../utils/validators';
import { applyServerError } from '@/lib/formErrors';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const GST_OPTIONS = [0, 5, 12, 18, 28];
const UNIT_OPTIONS = ['pcs', 'kg', 'g', 'ltr', 'ml', 'm', 'cm', 'box', 'pack', 'hr', 'day'];

export function ProductForm({ defaultValues, onSubmit, submitting }) {
  const {
    register, handleSubmit, setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: defaultValues?.name || '',
      description: defaultValues?.description || '',
      sku: defaultValues?.sku || '',
      hsnCode: defaultValues?.hsnCode || '',
      gstPercent: defaultValues?.gstPercent ?? 18,
      price: defaultValues?.price ?? 0,
      unit: defaultValues?.unit || 'pcs',
      stockQuantity: defaultValues?.stockQuantity ?? 0,
      isActive: defaultValues?.isActive ?? true,
    },
  });

  const handleFormSubmit = async (values) => {
    try {
      await onSubmit(values);
    } catch (err) {
      applyServerError(err, setError, 'sku');
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Label>Product name *</Label>
          <Input {...register('name')} />
          {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <Label>SKU</Label>
          <Input className="font-mono uppercase" {...register('sku')} />
          {errors.sku && <p className="text-xs text-destructive mt-1">{errors.sku.message}</p>}
        </div>
        <div>
          <Label>HSN code</Label>
          <Input className="font-mono uppercase" {...register('hsnCode')} />
        </div>
        <div>
          <Label>Price (₹) *</Label>
          <Input type="number" min="0" step="0.01" {...register('price')} />
          {errors.price && <p className="text-xs text-destructive mt-1">{errors.price.message}</p>}
        </div>
        <div>
          <Label>GST %</Label>
          <select
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            {...register('gstPercent')}
          >
            {GST_OPTIONS.map((g) => (
              <option key={g} value={g}>{g}%</option>
            ))}
          </select>
        </div>
        <div>
          <Label>Unit</Label>
          <select
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            {...register('unit')}
          >
            {UNIT_OPTIONS.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </div>
        <div>
          <Label>Stock quantity</Label>
          <Input type="number" min="0" {...register('stockQuantity')} />
        </div>
        <div className="md:col-span-2">
          <Label>Description</Label>
          <Textarea rows={2} {...register('description')} />
        </div>
        <div className="md:col-span-2 flex items-center gap-2">
          <input type="checkbox" id="isActive" {...register('isActive')} className="h-4 w-4" />
          <Label htmlFor="isActive" className="cursor-pointer">Active (available for sale)</Label>
        </div>
      </div>
      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? 'Saving...' : 'Save'}
      </Button>
    </form>
  );
}
