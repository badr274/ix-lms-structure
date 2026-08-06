import { z } from 'zod';
import { rules } from '@core/validation/rules';

/**
 * 📝 Auth Register Form Validation Schema
 * Reuses atomic validation rules for email, phone, password, person name, org name, account type, and logo.
 */
export const registerSchema = z
  .object({
    personName: rules.personName,
    email: rules.email,
    phone: rules.phone,
    orgName: rules.orgName,
    accountType: z.string().min(1, { message: 'يرجى اختيار نوع الحساب' }),
    password: rules.password,
    confirmPassword: z.string().min(1, { message: 'تأكيد كلمة المرور مطلوب' }),
    logoImage: rules.logoImage.optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'كلمة المرور وتأكيدها غير متطابقين',
    path: ['confirmPassword'],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

/**
 * 🔑 Auth Login Form Validation Schema
 * Restored full atomic rules.email and rules.password validation
 */
export const loginSchema = z.object({
  email: rules.email,
  password: rules.password,
});

export type LoginInput = z.infer<typeof loginSchema>;
