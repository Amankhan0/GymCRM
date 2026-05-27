import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Moon, Sun } from 'lucide-react';

import { profileSchema, passwordSchema } from '@/utils/validators';
import { profileService } from '@/services/profileService';
import { useAuth } from '@/hooks/useAuth';
import { updateUser } from '@/store/slices/authSlice';
import { setTheme } from '@/store/slices/uiSlice';
import { useDispatch, useSelector } from 'react-redux';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';

function ProfileCard() {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      gymName: user?.gymName || '',
    },
  });

  const onSubmit = async (values) => {
    setSaving(true);
    try {
      const res = await profileService.update(values);
      dispatch(updateUser(res.data));
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal info</CardTitle>
        <CardDescription>Update your name and contact details.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
          <div>
            <Label>Gym name</Label>
            <Input {...register('gymName')} />
            {errors.gymName && <p className="text-xs text-destructive mt-1">{errors.gymName.message}</p>}
          </div>
          <div>
            <Label>Your name</Label>
            <Input {...register('name')} />
            {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <Label>Email</Label>
            <Input type="email" {...register('email')} />
            {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <Label>Phone</Label>
            <Input {...register('phone')} />
          </div>
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save changes'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function PasswordCard() {
  const [saving, setSaving] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(passwordSchema) });

  const onSubmit = async (values) => {
    setSaving(true);
    try {
      await profileService.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      toast.success('Password updated');
      reset();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change password</CardTitle>
        <CardDescription>Choose a strong password to keep your account secure.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
          <div>
            <Label>Current password</Label>
            <Input type="password" {...register('currentPassword')} />
            {errors.currentPassword && <p className="text-xs text-destructive mt-1">{errors.currentPassword.message}</p>}
          </div>
          <div>
            <Label>New password</Label>
            <Input type="password" {...register('newPassword')} />
            {errors.newPassword && <p className="text-xs text-destructive mt-1">{errors.newPassword.message}</p>}
          </div>
          <div>
            <Label>Confirm new password</Label>
            <Input type="password" {...register('confirmPassword')} />
            {errors.confirmPassword && <p className="text-xs text-destructive mt-1">{errors.confirmPassword.message}</p>}
          </div>
          <Button type="submit" disabled={saving}>
            {saving ? 'Updating...' : 'Update password'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function AppearanceCard() {
  const theme = useSelector((s) => s.ui.theme);
  const dispatch = useDispatch();

  const choose = (value) => dispatch(setTheme(value));

  const Option = ({ value, label, icon: Icon }) => {
    const active = theme === value;
    return (
      <button
        type="button"
        onClick={() => choose(value)}
        className={cn(
          'flex-1 flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors',
          active
            ? 'border-primary bg-primary/5'
            : 'border-input hover:bg-accent'
        )}
      >
        <Icon className={cn('h-6 w-6', active ? 'text-primary' : 'text-muted-foreground')} />
        <span className={cn('text-sm font-medium', active && 'text-primary')}>{label}</span>
      </button>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>Choose how GymCRM looks on your device.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-3 max-w-md">
          <Option value="light" label="Light" icon={Sun} />
          <Option value="dark" label="Dark" icon={Moon} />
        </div>
      </CardContent>
    </Card>
  );
}

export default function Profile() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="text-sm text-muted-foreground">Manage your account.</p>
      </div>
      <ProfileCard />
      <AppearanceCard />
      <PasswordCard />
    </div>
  );
}
