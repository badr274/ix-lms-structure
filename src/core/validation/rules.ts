import { z } from 'zod';
import { i18n } from '@core/i18n';

/**
 * Helper to dynamically translate validation error messages with dynamic parameters ({min}, {max}, {length}, etc.)
 */
const t = (key: string, defaultMsg: string, params?: Record<string, unknown>) => {
  try {
    return (i18n.global.t as (k: string, p?: Record<string, unknown>) => string)(key, params) || defaultMsg;
  } catch {
    return defaultMsg;
  }
};

/**
 * ==========================================
 * 🛡️ CENTRALIZED LMS VALIDATION RULES (V-01 to V-16) WITH DYNAMIC i18n
 * ==========================================
 * Atomic, reusable Zod schemas enforcing system-wide business rules with dynamic localization & parameters.
 */

// Helper to create required string with custom field name and dynamic min/max parameters
const requiredString = (_fieldNameKey?: string, min = 1, max = 255) =>
  z
    .string({ required_error: t('validation.required', 'هذا الحقل مطلوب') })
    .trim()
    .min(min, { message: t('validation.minChar', `يجب أن يتكون الحقل من ${min} حروف على الأقل`, { min }) })
    .max(max, { message: t('validation.maxChar', `لا يمكن أن يتجاوز الحقل ${max} حرفاً`, { max }) });

export const rules = {
  /**
   * V-01: Email format
   */
  email: z
    .string({ required_error: t('validation.emailRequired', 'البريد الإلكتروني مطلوب') })
    .trim()
    .min(1, { message: t('validation.emailRequired', 'البريد الإلكتروني مطلوب') })
    .email({ message: t('validation.invalidEmail', 'صيغة البريد الإلكتروني غير صحيحة') }),

  /**
   * V-02: Phone number
   */
  phone: z
    .string({ required_error: t('validation.phoneRequired', 'رقم الهاتف مطلوب') })
    .trim()
    .min(1, { message: t('validation.phoneRequired', 'رقم الهاتف مطلوب') })
    .regex(/^(\+|\d{2})\d{7,14}$/, {
      message: t('validation.invalidPhone', 'رقم الهاتف يجب أن يبدأ بكود الدولة'),
    }),

  /**
   * V-03: Password (Dynamic min length parameter)
   */
  password: z
    .string({ required_error: t('validation.passwordRequired', 'كلمة المرور مطلوبة') })
    .min(8, { message: t('validation.passwordFormat', 'كلمة المرور يجب أن لا تقل عن 8 خانات', { min: 8 }) }),
  // .regex(/^(?=.*[A-Za-z])(?=.*\d)/, {
  //   message: t('validation.passwordFormat', 'كلمة المرور يجب أن تحتوي على حرف واحد ورقم واحد على الأقل', { min: 8 }),
  // }),

  /**
   * V-04: Organization name
   */
  orgName: requiredString('validation.orgNameRequired', 3, 100),

  /**
   * V-05: Logo image (Dynamic maxSize parameter)
   */
  logoImage: z
    .custom<File>((file) => file instanceof File, { message: t('validation.contentImageSelect', 'يرجى اختيار صورة الشعار') })
    .refine((file) => ['image/jpeg', 'image/png'].includes(file.type), {
      message: t('validation.contentImageType', 'يُسمح فقط بصور بصيغة JPG أو PNG'),
    })
    .refine((file) => file.size <= 2 * 1024 * 1024, {
      message: t('validation.contentImageSize', 'حجم الشعار يجب ألا يتجاوز 2 ميجابايت', { maxSize: 2 }),
    }),

  /**
   * V-06: Branch name
   */
  branchName: requiredString('validation.branchNameRequired', 2, 80),

  /**
   * V-07: Person name
   */
  personName: requiredString('validation.personNameRequired', 2, 80),

  /**
   * V-08: Learner Code
   */
  learnerCode: z
    .string()
    .trim()
    .regex(/^[A-Z]{3,4}-\d{4}$/, {
      message: t('validation.learnerCodeFormat', 'كود الطالب غير صحيح، يجب أن يكون بالشكل [ORG-1234]'),
    }),

  /**
   * V-09: OTP code (Dynamic length parameter)
   */
  otp: z
    .string({ required_error: t('validation.otpRequired', 'رمز التحقق مطلوب') })
    .trim()
    .length(6, { message: t('validation.otpDigits', 'رمز التحقق يتكون من 6 أرقام', { length: 6 }) })
    .regex(/^\d{6}$/, { message: t('validation.otpDigits', 'رمز التحقق يجب أن يحتوي على أرقام فقط', { length: 6 }) }),

  /**
   * V-10: Invitation link token
   */
  invitationLink: z
    .string({ required_error: t('validation.invitationLinkRequired', 'رابط الدعوة غير صالح') })
    .min(1, { message: t('validation.invitationLinkRequired', 'رابط الدعوة مطلوب') }),

  /**
   * V-12: Inline Required field fallback
   */
  required: requiredString,

  /**
   * V-13: Short text
   */
  shortText: (fieldNameKey?: string) => requiredString(fieldNameKey, 1, 150),

  /**
   * V-14: Long text
   */
  longText: (fieldNameKey?: string) => requiredString(fieldNameKey, 1, 1000),

  /**
   * V-15: Bilingual title (Dynamic min/max parameters)
   */
  bilingualTitle: z.object({
    ar: z
      .string({ required_error: t('validation.bilingualArRequired', 'العنوان بالعربية مطلوب') })
      .trim()
      .min(3, { message: t('validation.bilingualArMin', 'العنوان بالعربية يجب أن لا يقل عن 3 أحرف', { min: 3 }) })
      .max(100, { message: t('validation.bilingualArMax', 'العنوان بالعربية لا يتجاوز 100 حرف', { max: 100 }) }),
    en: z
      .string({ required_error: t('validation.bilingualEnRequired', 'Title in English is required') })
      .trim()
      .min(3, { message: t('validation.bilingualEnMin', 'English title must be at least 3 characters', { min: 3 }) })
      .max(100, { message: t('validation.bilingualEnMax', 'English title must not exceed 100 characters', { max: 100 }) }),
  }),

  /**
   * V-16: Content image (Dynamic maxSize parameter)
   */
  contentImage: z
    .custom<File>((file) => file instanceof File, { message: t('validation.contentImageSelect', 'يرجى اختيار صورة المحتوى') })
    .refine((file) => ['image/jpeg', 'image/png'].includes(file.type), {
      message: t('validation.contentImageType', 'يُسمح فقط بصور بصيغة JPG أو PNG'),
    })
    .refine((file) => file.size <= 3 * 1024 * 1024, {
      message: t('validation.contentImageSize', 'حجم الصورة يجب ألا يتجاوز 3 ميجابايت', { maxSize: 3 }),
    }),
};

/**
 * Helper to construct Password + Confirm Password Schema (V-03)
 */
export function createPasswordWithConfirmSchema() {
  return z
    .object({
      password: rules.password,
      confirmPassword: z.string({ required_error: t('validation.passwordRequired', 'تأكيد كلمة المرور مطلوب') }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('validation.passwordMismatch', 'كلمة المرور وتأكيدها غير متطابقين'),
      path: ['confirmPassword'],
    });
}
