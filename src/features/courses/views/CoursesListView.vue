<script setup lang="ts">
import { ref, computed } from 'vue';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useThemeStore } from '@stores/theme.store';
import { useAuthStore } from '@stores/auth.store';
import { useLocaleStore } from '@stores/locale.store';
import AppSpinner from '@shared/components/ui/AppSpinner.vue';
import { AppButton } from '@shared/components/buttons';
import { Can, usePermissions, PERMISSIONS } from '@core/permissions';
import { createCourseSchema, type CreateCourseInput } from '@features/courses/schemas/course.schema';
import { useCoursesQuery, useCreateCourseMutation, useDeleteCourseMutation } from '@features/courses/composables/useCourses';

// Shadcn Vue UI Components
import { Button } from '@/components/ui/button';
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
const router = useRouter();
const themeStore = useThemeStore();
const authStore = useAuthStore();
const localeStore = useLocaleStore();
const { userRole } = usePermissions();

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
      },
    }
  );
});

function removeCourse(id: string) {
  deleteCourseMutation.mutate(id);
}

function handleLogout() {
  authStore.logout();
  router.push({ name: 'login' });
}
</script>

<template>
  <div class="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors duration-300">
    <!-- Navbar Header -->
    <header class="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-md px-6 py-4 flex justify-between items-center shadow-xs">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl shadow-md">
          IX
        </div>
        <div>
          <h1 class="text-lg font-bold tracking-tight text-foreground m-0">{{ t('header.title') }}</h1>
          <p class="text-xs text-muted-foreground m-0">{{ t('header.subtitle') }}</p>
        </div>
      </div>

      <!-- Right Controls -->
      <div class="flex items-center gap-3">
        <!-- Auth User Badge with Role -->
        <Badge v-if="authStore.user" variant="outline" class="hidden sm:flex items-center gap-2 py-1.5 px-3">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>{{ authStore.user.name }} ({{ userRole }})</span>
        </Badge>

        <router-link :to="{ name: 'dashboard' }">
          <Button variant="ghost" size="sm" class="text-xs font-semibold">
            📊 {{ t('nav.dashboard') }}
          </Button>
        </router-link>

        <!-- Language Switcher Toggle -->
        <Button variant="outline" size="sm" @click="localeStore.toggleLocale()" class="text-xs font-bold gap-1.5 cursor-pointer">
          <span v-if="localeStore.currentLocale === 'ar'">🌐 English (EN)</span>
          <span v-else>🌐 العربية (AR)</span>
        </Button>

        <!-- Dark / Light Mode Toggle Button -->
        <Button variant="outline" size="sm" @click="themeStore.toggleTheme()" class="text-xs font-medium gap-2 cursor-pointer">
          <span v-if="themeStore.isDark">{{ t('header.toggleThemeDark') }}</span>
          <span v-else>{{ t('header.toggleThemeLight') }}</span>
        </Button>

        <Button variant="destructive" size="sm" @click="handleLogout()" class="text-xs font-semibold cursor-pointer">
          {{ t('auth.logout') }}
        </Button>
      </div>
    </header>

    <!-- Main Container -->
    <main class="flex-1 max-w-5xl w-full mx-auto p-6 flex flex-col gap-6">
      <!-- Welcome Hero Card -->
      <Card class="relative overflow-hidden p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Badge variant="secondary" class="mb-2">
            🚀 {{ t('header.version') }}
          </Badge>
          <h2 class="text-xl font-bold text-foreground m-0">{{ t('courses.listTitle') }}</h2>
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

      <Tabs v-model="activeSection">
        <!-- SECTION 1: COURSES LIST VIEW -->
        <TabsContent value="courses">
          <div class="flex flex-col gap-4">
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-bold text-foreground m-0">{{ t('courses.listTitle') }}</h3>
              <span class="text-xs text-muted-foreground">{{ t('courses.count') }}: {{ coursesList?.length || 0 }}</span>
            </div>

            <div v-if="isCoursesLoading" class="p-12 flex flex-col items-center justify-center gap-3 text-muted-foreground">
              <AppSpinner size="lg" />
              <span class="text-xs font-medium">Loading courses...</span>
            </div>

            <div v-else-if="!coursesList || coursesList.length === 0" class="p-8 text-center text-muted-foreground border border-dashed rounded-xl">
              {{ t('courses.empty') }}
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card
                v-for="course in coursesList"
                :key="course.id"
                class="p-5 flex flex-col justify-between gap-4 transition-all hover:border-primary/50"
              >
                <div class="flex flex-col gap-2">
                  <div class="flex justify-between items-start gap-2">
                    <Badge :variant="course.status === 'PUBLISHED' ? 'default' : 'secondary'">
                      {{ course.status === 'PUBLISHED' ? t('courses.statusActive') : t('courses.statusDraft') }}
                    </Badge>
                    <span class="text-lg font-extrabold text-foreground">${{ course.price }}</span>
                  </div>

                  <h4 class="text-base font-bold text-foreground m-0 leading-snug">
                    {{ localeStore.currentLocale === 'ar' ? course.title.ar : course.title.en }}
                  </h4>
                  <p class="text-xs text-muted-foreground m-0">
                    {{ localeStore.currentLocale === 'ar' ? course.title.en : course.title.ar }}
                  </p>

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
            <Card>
              <CardHeader class="border-b border-border pb-4 flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <CardTitle>{{ t('form.createCourseTitle') }}</CardTitle>
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
    </main>
  </div>
</template>
