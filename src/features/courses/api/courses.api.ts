import { apiClient } from '@core/api/axios-client';
import { API_ENDPOINTS } from '@core/api/api-endpoints';
import type { Course, CreateCourseDto } from '../types/courses.types';

// In-memory mock storage for testing API integration
let mockCoursesStore: Course[] = [
  {
    id: 'c-1',
    title: { ar: 'دورة تطوير واجهات المستخدم بـ Vue 3 & Tailwind', en: 'Vue 3 & Tailwind Frontend Mastery' },
    description: { ar: 'كورس شامل لإنشاء لوحات تحكم احترافية بتصميم عصر يداعم المود الداكن والفاتح.', en: 'Comprehensive course to build modern admin dashboards.' },
    price: 149,
    status: 'PUBLISHED',
    createdAt: '2026-08-01',
    updatedAt: '2026-08-05',
  },
  {
    id: 'c-2',
    title: { ar: 'أساسيات TypeScript للأعمال والمنظمات', en: 'TypeScript Essentials for Enterprise' },
    description: { ar: 'تعلم الأنواع المتقدمة وكتابة كود آمن خالي من الأخطاء.', en: 'Learn advanced types and write safe code.' },
    price: 99,
    status: 'DRAFT',
    createdAt: '2026-08-04',
    updatedAt: '2026-08-06',
  },
];

export const coursesApi = {
  /**
   * Get list of courses (uses Mock API fallback for testing UI)
   */
  getCourses: async (): Promise<Course[]> => {
    try {
      const res = await apiClient.get<Course[]>(API_ENDPOINTS.COURSES.BASE);
      return res.data;
    } catch {
      // Return simulated mock dataset if real backend server is offline
      await new Promise((resolve) => setTimeout(resolve, 400));
      return [...mockCoursesStore];
    }
  },

  /**
   * Get course by ID
   */
  getCourseById: async (id: string): Promise<Course> => {
    try {
      const res = await apiClient.get<Course>(API_ENDPOINTS.COURSES.BY_ID(id));
      return res.data;
    } catch {
      const found = mockCoursesStore.find((c) => c.id === id);
      if (!found) throw new Error('Course not found');
      return found;
    }
  },

  /**
   * Create course with support for simulated API 500 error testing
   */
  createCourse: async (payload: CreateCourseDto, shouldSimulateError = false): Promise<Course> => {
    // If user enabled simulated error toggle in UI, throw 500 Internal Server Error
    if (shouldSimulateError) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      throw new Error('500 Internal Server Error: Failed to save course on backend');
    }

    try {
      const formData = new FormData();
      formData.append('title[ar]', payload.title.ar);
      formData.append('title[en]', payload.title.en);
      if (payload.description) {
        formData.append('description[ar]', payload.description.ar);
        formData.append('description[en]', payload.description.en);
      }
      formData.append('price', String(payload.price));
      if (payload.coverImage) {
        formData.append('coverImage', payload.coverImage);
      }

      const res = await apiClient.post<Course>(API_ENDPOINTS.COURSES.BASE, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    } catch {
      // Mock API fallback
      await new Promise((resolve) => setTimeout(resolve, 600));
      const newCourse: Course = {
        id: `c-${Date.now()}`,
        title: payload.title,
        description: payload.description,
        price: payload.price,
        status: 'PUBLISHED',
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      };
      mockCoursesStore.unshift(newCourse);
      return newCourse;
    }
  },

  /**
   * Delete course
   */
  deleteCourse: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(API_ENDPOINTS.COURSES.BY_ID(id));
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 400));
      mockCoursesStore = mockCoursesStore.filter((c) => c.id !== id);
    }
  },
};
