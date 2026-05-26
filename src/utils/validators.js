import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const signupSchema = z.object({
  name: z.string().min(2, 'Name is too short'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
});

export const memberSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().min(7, 'Phone is required'),
  gender: z.enum(['male', 'female', 'other']).default('male'),
  joinDate: z.string().optional(),
  expiryDate: z.string().min(1, 'Expiry date is required'),
  membershipPlan: z.string().optional().or(z.literal('')),
  trainer: z.string().optional().or(z.literal('')),
  status: z.enum(['active', 'expired', 'inactive']).default('active'),
  address: z.string().optional(),
});

export const trainerSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().min(7, 'Phone is required'),
  gender: z.enum(['male', 'female', 'other']).default('male'),
  specialization: z.string().optional(),
  experience: z.coerce.number().min(0).default(0),
  salary: z.coerce.number().min(0).default(0),
  status: z.enum(['active', 'inactive']).default('active'),
  bio: z.string().optional(),
});

export const planSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  duration: z.enum(['monthly', 'quarterly', 'half-yearly', 'yearly']),
  durationInDays: z.coerce.number().min(1, 'Duration in days is required'),
  price: z.coerce.number().min(0, 'Price is required'),
  description: z.string().optional(),
  features: z.string().optional(), // comma-separated, parsed later
  isActive: z.boolean().default(true),
});

export const paymentSchema = z.object({
  memberId: z.string().min(1, 'Member is required'),
  planId: z.string().min(1, 'Plan is required'),
  amount: z.coerce.number().min(0).optional(),
  paymentMethod: z.enum(['cash', 'card', 'upi', 'bank-transfer', 'other']).default('cash'),
  transactionId: z.string().optional(),
  notes: z.string().optional(),
});

export const profileSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
});

export const passwordSchema = z
  .object({
    currentPassword: z.string().min(6, 'Required'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Required'),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
