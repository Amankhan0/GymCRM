import { z } from 'zod';

const PHONE = /^[6-9]\d{9}$/;
const GST = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
const PINCODE = /^[1-9][0-9]{5}$/;

export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Shared schema for Customer + Supplier (identical shape per the prompt). The page determines
// which collection the data lands in; validation is the same either way.
export const partySchema = z.object({
  companyName: z.string().min(2, 'Company name is required'),
  contactPerson: z.string().optional().or(z.literal('')),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().regex(PHONE, 'Enter a valid 10-digit mobile').optional().or(z.literal('')),
  gstNumber: z.string().regex(GST, 'Invalid GSTIN').optional().or(z.literal('')),
  billingAddress: z.string().optional().or(z.literal('')),
  shippingAddress: z.string().optional().or(z.literal('')),
  city: z.string().optional().or(z.literal('')),
  state: z.string().optional().or(z.literal('')),
  pincode: z.string().regex(PINCODE, 'Invalid pincode').optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal('')),
});

export const productSchema = z.object({
  name: z.string().min(2, 'Product name is required'),
  description: z.string().optional().or(z.literal('')),
  sku: z.string().optional().or(z.literal('')),
  hsnCode: z.string().optional().or(z.literal('')),
  gstPercent: z.coerce.number().min(0).max(50).default(18),
  price: z.coerce.number().min(0, 'Price is required'),
  unit: z.string().optional().or(z.literal('pcs')),
  stockQuantity: z.coerce.number().min(0).default(0),
  isActive: z.boolean().default(true),
});

export const signupSchema = z.object({
  companyName: z.string().min(2, 'Company name is required'),
  ownerName: z.string().min(2, 'Your name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().regex(PHONE, 'Enter a valid 10-digit mobile number'),
  // GST and address are optional at signup — businesses without GSTIN can still onboard.
  gstNumber: z.string().regex(GST, 'Invalid GSTIN').optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
  city: z.string().optional().or(z.literal('')),
  state: z.string().optional().or(z.literal('')),
  pincode: z.string().regex(PINCODE, 'Invalid pincode').optional().or(z.literal('')),
});
