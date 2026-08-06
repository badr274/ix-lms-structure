import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { useI18n } from 'vue-i18n';
import { queryKeys } from '@core/query/query-keys';
import { useAppToast } from '@shared/composables/useAppToast';
import { coursesApi } from '../api/courses.api';
import type { CreateCourseDto } from '../types/courses.types';

export function useCoursesQuery() {
  return useQuery({
    queryKey: queryKeys.courses.list(),
    queryFn: coursesApi.getCourses,
  });
}

export function useCreateCourseMutation() {
  const queryClient = useQueryClient();
  const { t } = useI18n();
  const appToast = useAppToast();

  return useMutation({
    mutationFn: ({ payload, simulateError }: { payload: CreateCourseDto; simulateError?: boolean }) =>
      coursesApi.createCourse(payload, simulateError),
    onSuccess: () => {
      appToast.success(t('form.successToast'));
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.all });
    },
    onError: (err: Error) => {
      appToast.error(err.message || t('form.errorToast'));
    },
  });
}

export function useDeleteCourseMutation() {
  const queryClient = useQueryClient();
  const { t } = useI18n();
  const appToast = useAppToast();

  return useMutation({
    mutationFn: (id: string) => coursesApi.deleteCourse(id),
    onSuccess: () => {
      appToast.success(t('courses.deleteSuccessToast'));
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.all });
    },
    onError: () => {
      appToast.error(t('courses.deleteErrorToast'));
    },
  });
}
