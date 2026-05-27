import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { partySchema } from '../../utils/validators';
import { applyServerError } from '@/lib/formErrors';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

// Shared form for Customer + Supplier — same schema, same fields.
// Parent passes the right onSubmit (customerService.create vs supplierService.create).
export function PartyForm({ defaultValues, onSubmit, submitting }) {
  const {
    register, handleSubmit, setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(partySchema),
    defaultValues: {
      companyName: defaultValues?.companyName || '',
      contactPerson: defaultValues?.contactPerson || '',
      email: defaultValues?.email || '',
      phone: defaultValues?.phone || '',
      gstNumber: defaultValues?.gstNumber || '',
      billingAddress: defaultValues?.billingAddress || '',
      shippingAddress: defaultValues?.shippingAddress || '',
      city: defaultValues?.city || '',
      state: defaultValues?.state || '',
      pincode: defaultValues?.pincode || '',
      notes: defaultValues?.notes || '',
    },
  });

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
          <Label>Company name *</Label>
          <Input {...register('companyName')} />
          {errors.companyName && <p className="text-xs text-destructive mt-1">{errors.companyName.message}</p>}
        </div>
        <div>
          <Label>Contact person</Label>
          <Input {...register('contactPerson')} />
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
        <div className="md:col-span-2">
          <Label>GSTIN</Label>
          <Input maxLength={15} className="font-mono uppercase" {...register('gstNumber')} />
          {errors.gstNumber && <p className="text-xs text-destructive mt-1">{errors.gstNumber.message}</p>}
        </div>
        <div className="md:col-span-2">
          <Label>Billing address</Label>
          <Textarea rows={2} {...register('billingAddress')} />
        </div>
        <div className="md:col-span-2">
          <Label>Shipping address</Label>
          <Textarea rows={2} {...register('shippingAddress')} />
        </div>
        <div>
          <Label>City</Label>
          <Input {...register('city')} />
        </div>
        <div>
          <Label>State</Label>
          <Input {...register('state')} />
        </div>
        <div>
          <Label>Pincode</Label>
          <Input inputMode="numeric" maxLength={6} {...register('pincode')} />
          {errors.pincode && <p className="text-xs text-destructive mt-1">{errors.pincode.message}</p>}
        </div>
      </div>
      <div>
        <Label>Notes</Label>
        <Textarea rows={2} {...register('notes')} />
      </div>
      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? 'Saving...' : 'Save'}
      </Button>
    </form>
  );
}
