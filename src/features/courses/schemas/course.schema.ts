import { z } from 'zod';
import { rules } from '@core/validation';

/**
 * 📝 Course Form Validation Schema
 * Reuses atomic rules V-15 (Bilingual Title), V-14 (Long Text Description), and V-16 (Content Image).
 */
export const createCourseSchema = z.object({
  title: rules.bilingualTitle,
  description: z
    .object({
      ar: rules.longText('الوصف بالعربية'),
      en: rules.longText('Description in English'),
    })
    .optional(),
  price: z.number({ required_error: 'السعر مطلوب' }).min(0, { message: 'السعر لا يمكن أن يكون بالسالب' }),
  coverImage: rules.contentImage.optional(),
});

export type CreateCourseInput = z.infer<typeof createCourseSchema>;
