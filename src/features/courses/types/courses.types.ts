export interface BilingualText {
  ar: string;
  en: string;
}

export type CourseStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface Course {
  id: string;
  title: BilingualText;
  description?: BilingualText;
  coverImage?: string;
  category?: string;
  price: number;
  status: CourseStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCourseDto {
  title: BilingualText;
  description?: BilingualText;
  category?: string;
  price: number;
  coverImage?: File;
}
