import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Briefcase } from 'lucide-react';

import { signupSchema } from '../utils/validators';
import { authService } from '../services/authService';
import { useAuth } from '../hooks/useAuth';
import { applyServerError } from '@/lib/formErrors';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

export default function Signup() {
  const navigate = useNavigate();
  const { setCredentials } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      companyName: '', ownerName: '', email: '', password: '', phone: '',
      gstNumber: '', address: '', city: '', state: '', pincode: '',
    },
  });

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const res = await authService.signup(values);
      setCredentials({ token: res.data.token, user: res.data.user });
      toast.success('Account created — welcome!');
      navigate('/dashboard');
    } catch (err) {
      if (!applyServerError(err, setError, 'email')) {
        toast.error(err?.response?.data?.message || 'Signup failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 p-4">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardContent className="p-8">
          <div className="flex flex-col items-center mb-6">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-3 shadow-lg shadow-indigo-500/30">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold">Create your business workspace</h1>
            <p className="text-sm text-muted-foreground mt-1">7-day free trial · no card required</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Identity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Company name *</Label>
                <Input placeholder="Acme Industries Pvt Ltd" {...register('companyName')} />
                {errors.companyName && <p className="text-xs text-destructive mt-1">{errors.companyName.message}</p>}
              </div>
              <div>
                <Label>Your name *</Label>
                <Input {...register('ownerName')} />
                {errors.ownerName && <p className="text-xs text-destructive mt-1">{errors.ownerName.message}</p>}
              </div>
              <div>
                <Label>Email *</Label>
                <Input type="email" {...register('email')} />
                {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <Label>Phone *</Label>
                <Input type="tel" inputMode="numeric" maxLength={10} placeholder="10-digit mobile" {...register('phone')} />
                {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone.message}</p>}
              </div>
              <div className="md:col-span-2">
                <Label>Password *</Label>
                <Input type="password" {...register('password')} />
                {errors.password && <p className="text-xs text-destructive mt-1">{errors.password.message}</p>}
              </div>
            </div>

            {/* Business details — optional */}
            <div className="pt-2 border-t">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                Business details (optional, you can add later)
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>GSTIN</Label>
                  <Input placeholder="22AAAAA0000A1Z5" maxLength={15} className="font-mono uppercase" {...register('gstNumber')} />
                  {errors.gstNumber && <p className="text-xs text-destructive mt-1">{errors.gstNumber.message}</p>}
                </div>
                <div>
                  <Label>Pincode</Label>
                  <Input inputMode="numeric" maxLength={6} {...register('pincode')} />
                  {errors.pincode && <p className="text-xs text-destructive mt-1">{errors.pincode.message}</p>}
                </div>
                <div className="md:col-span-2">
                  <Label>Address</Label>
                  <Input {...register('address')} />
                </div>
                <div>
                  <Label>City</Label>
                  <Input {...register('city')} />
                </div>
                <div>
                  <Label>State</Label>
                  <Input {...register('state')} />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
            >
              {loading ? 'Creating...' : 'Create account'}
            </Button>
          </form>

          <p className="text-sm text-center text-muted-foreground mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
