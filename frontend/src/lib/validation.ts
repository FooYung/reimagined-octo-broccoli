import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(100, 'Name must be at most 100 characters'),
  email: z.email('Enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain an uppercase letter')
    .regex(/[a-z]/, 'Password must contain a lowercase letter')
    .regex(/[0-9]/, 'Password must contain a digit'),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const checkoutSchema = z.object({
  shippingName: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(100, 'Name must be at most 100 characters'),
  shippingLine1: z
    .string()
    .trim()
    .min(1, 'Address line 1 is required')
    .max(200, 'Address line 1 must be at most 200 characters'),
  shippingLine2: z
    .string()
    .trim()
    .max(200, 'Address line 2 must be at most 200 characters')
    .optional(),
  shippingCity: z
    .string()
    .trim()
    .min(1, 'City is required')
    .max(100, 'City must be at most 100 characters'),
  shippingPostcode: z
    .string()
    .trim()
    .min(1, 'Postcode is required')
    .max(20, 'Postcode must be at most 20 characters'),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
