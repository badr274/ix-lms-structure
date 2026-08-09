<script setup lang="ts">
import { ref, computed } from 'vue';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { useI18n } from 'vue-i18n';
import { useLocaleStore } from '@stores/locale.store';
import AppSpinner from '@shared/components/ui/AppSpinner.vue';
import { AppButton } from '@shared/components/buttons';
import { Can, PERMISSIONS } from '@core/permissions';
import { createCourseSchema, type CreateCourseInput } from '@features/courses/schemas/course.schema';
import { useCoursesQuery, useCreateCourseMutation, useDeleteCourseMutation } from '@features/courses/composables/useCourses';
import { useModal } from '@shared/components/modals';

// Shadcn Vue UI Components
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

// Shared Reusable Form Components
import {
  FormInput,
  FormTextarea,
  FormSelect,
  FormFileInput,
} from '@shared/components/inputs';

const { t } = useI18n();
const localeStore = useLocaleStore();
const modal = useModal();

// Active Tab ('courses' | 'create')
const activeSection = ref<'courses' | 'create'>('courses');

// Toggle to simulate 500 Network API error
const simulateApiError = ref(false);

// Vue Query Hooks
const { data: coursesList, isLoading: isCoursesLoading } = useCoursesQuery();
const createCourseMutation = useCreateCourseMutation();
const deleteCourseMutation = useDeleteCourseMutation();

// Form Setup
const { handleSubmit, resetForm } = useForm<CreateCourseInput>({
  validationSchema: toTypedSchema(createCourseSchema),
  initialValues: {
    title: { ar: '', en: '' },
    price: 99,
  },
});

const categoryOptions = computed(() => [
  { label: t('form.categoryDev'), value: 'dev' },
  { label: t('form.categoryDesign'), value: 'design' },
  { label: t('form.categoryBusiness'), value: 'business' },
]);

const onSubmit = handleSubmit((values) => {
  createCourseMutation.mutate(
    {
      payload: {
        title: values.title,
        description: values.description,
        price: values.price,
        coverImage: values.coverImage,
      },
      simulateError: simulateApiError.value,
    },
    {
      onSuccess: () => {
        resetForm();
        activeSection.value = 'courses';
        modal.success({
          title: 'Congratulations !',
          description: 'Course created successfully.',
        });
      },
    }
  );
});

async function removeCourse(id: string) {
  const confirmed = await modal.confirm({
    title: t('courses.deleteBtn', 'Delete Course'),
    description: 'Are you sure you want to delete this course? This action cannot be undone.',
    variant: 'destructive',
    confirmText: 'Delete',
  });
  if (confirmed) {
    deleteCourseMutation.mutate(id);
  }
}
</script>

<template>
  <div class="flex flex-col gap-6 max-w-6xl w-full">
    <!-- Welcome Hero Card -->
    <Card class="relative overflow-hidden p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border border-border shadow-xs">
      <div>
        <Badge variant="secondary" class="mb-2">
          🚀 {{ t('header.version') }}
        </Badge>
        <h2 class="text-xl font-bold text-foreground font-heading m-0">{{ t('courses.listTitle') }}</h2>
        <p class="text-sm text-muted-foreground mt-1 m-0">
          {{ t('header.welcomeSubtitle') }}
        </p>
      </div>

      <!-- Navigation Tabs (Create Tab Protected with PERMISSIONS.COURSE_CREATE constant) -->
      <Tabs :model-value="activeSection" @update:model-value="(val) => activeSection = val as 'courses' | 'create'">
        <TabsList>
          <TabsTrigger value="courses">
            {{ t('nav.viewCourses') }} ({{ coursesList?.length || 0 }})
          </TabsTrigger>
          <Can :permission="PERMISSIONS.COURSE_CREATE">
            <TabsTrigger value="create">
              {{ t('nav.createCourse') }}
            </TabsTrigger>
          </Can>
        </TabsList>
      </Tabs>
    </Card>

    <!-- Main Content Container with TabsContent -->
    <Tabs :model-value="activeSection">
      <!-- SECTION 1: VIEW COURSES LIST -->
      <TabsContent value="courses">
        <!-- Loading State using Global Spinner -->
        <div v-if="isCoursesLoading" class="flex flex-col items-center justify-center p-12 gap-3">
          <AppSpinner size="lg" />
          <span class="text-xs text-muted-foreground">{{ t('courses.loading') }}</span>
        </div>

        <!-- Empty State -->
        <div v-else-if="!coursesList || coursesList.length === 0" class="text-center p-12 border border-dashed border-border rounded-xl bg-card">
          <div class="text-3xl mb-2">📂</div>
          <p class="text-muted-foreground text-sm font-medium">{{ t('courses.noCourses') }}</p>
          <Can :permission="PERMISSIONS.COURSE_CREATE">
            <AppButton class="mt-4" size="sm" @click="activeSection = 'create'">
              ➕ {{ t('courses.addCourseBtn') }}
            </AppButton>
          </Can>
        </div>

        <!-- Courses Grid List -->
        <div v-else class="flex flex-col gap-4">
          <div class="flex justify-between items-center px-1">
            <span class="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {{ t('courses.totalCount') }}: {{ coursesList.length }}
            </span>
            <Can :permission="PERMISSIONS.COURSE_CREATE">
              <AppButton size="sm" @click="activeSection = 'create'">
                ➕ {{ t('courses.addCourseBtn') }}
              </AppButton>
            </Can>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <Card
              v-for="course in coursesList"
              :key="course.id"
              class="overflow-hidden border border-border bg-card hover:shadow-md transition-shadow flex flex-col justify-between p-5"
            >
              <div>
                <div class="flex justify-between items-start gap-2 mb-2">
                  <Badge variant="outline" class="font-mono text-[10px]">
                    {{ course.category || 'General' }}
                  </Badge>
                  <span class="text-sm font-bold text-primary">${{ course.price }}</span>
                </div>

                <h3 class="font-bold text-base text-foreground font-heading mt-1">
                  {{ localeStore.currentLocale === 'ar' ? course.title.ar : course.title.en }}
                </h3>

                <p v-if="course.description?.ar" class="text-xs text-muted-foreground line-clamp-2 mt-1">
                  {{ localeStore.currentLocale === 'ar' ? course.description.ar : course.description.en }}
                </p>
              </div>

              <div class="flex justify-between items-center border-t border-border pt-3 text-xs text-muted-foreground">
                <span>{{ t('courses.createdDate') }}: {{ course.createdAt }}</span>
                
                <!-- Delete Action Protected with PERMISSIONS.COURSE_DELETE constant -->
                <Can :permission="PERMISSIONS.COURSE_DELETE">
                  <AppButton
                    type="button"
                    variant="ghost"
                    size="sm"
                    @click="removeCourse(course.id)"
                    :loading="deleteCourseMutation.isPending.value"
                    class="text-destructive hover:text-destructive hover:bg-destructive/10 text-xs font-semibold"
                  >
                    {{ t('courses.deleteBtn') }}
                  </AppButton>
                </Can>
              </div>
            </Card>
          </div>
        </div>
      </TabsContent>

      <!-- SECTION 2: CREATE COURSE FORM (Protected) -->
      <TabsContent value="create">
        <Can :permission="PERMISSIONS.COURSE_CREATE">
          <Card class="border border-border shadow-xs">
            <CardHeader class="border-b border-border pb-4 flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div>
                <CardTitle class="font-heading">{{ t('form.createCourseTitle') }}</CardTitle>
                <CardDescription>{{ t('form.createCourseSub') }}</CardDescription>
              </div>

              <!-- API Error Simulator Toggle Switch -->
              <div class="flex items-center gap-2 p-2 rounded-lg bg-muted border border-border text-xs">
                <input
                  type="checkbox"
                  id="simulateErrorCourse"
                  v-model="simulateApiError"
                  class="rounded cursor-pointer accent-destructive"
                />
                <label for="simulateErrorCourse" class="cursor-pointer font-medium text-destructive">
                  {{ t('form.simulatedApiToggle') }}
                </label>
              </div>
            </CardHeader>

            <CardContent class="pt-6 flex flex-col gap-5">
              <p v-if="simulateApiError" class="text-xs text-destructive bg-destructive/10 p-3 rounded-lg border border-destructive/20 m-0">
                ⚠️ {{ t('form.simulatedApiNotice') }}
              </p>

              <form @submit.prevent="onSubmit" class="flex flex-col gap-5">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    name="title.ar"
                    :label="t('form.titleAr')"
                    :placeholder="t('form.titleArPlaceholder')"
                    required
                  />
                  <FormInput
                    name="title.en"
                    :label="t('form.titleEn')"
                    :placeholder="t('form.titleEnPlaceholder')"
                    required
                  />
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    name="price"
                    type="number"
                    :label="t('form.price')"
                    :placeholder="t('form.pricePlaceholder')"
                    required
                  />

                  <FormSelect
                    name="category"
                    :label="t('form.category')"
                    :placeholder="t('form.categorySelect')"
                    :options="categoryOptions"
                    required
                  />
                </div>

                <FormTextarea
                  name="description.ar"
                  :label="t('form.description')"
                  :placeholder="t('form.descriptionPlaceholder')"
                  :maxlength="1000"
                />

                <FormFileInput
                  name="coverImage"
                  :label="t('form.coverImage')"
                />

                <div class="flex justify-end gap-3 border-t border-border pt-4 mt-2">
                  <AppButton type="button" variant="outline" @click="resetForm()" :disabled="createCourseMutation.isPending.value">
                    {{ t('form.resetBtn') }}
                  </AppButton>
                  <AppButton type="submit" variant="default" :loading="createCourseMutation.isPending.value">
                    {{ t('form.submitBtn') }}
                  </AppButton>
                </div>
              </form>
            </CardContent>
          </Card>
        </Can>
      </TabsContent>
    </Tabs>
  </div>
</template>
