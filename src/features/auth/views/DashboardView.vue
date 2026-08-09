<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@stores/auth.store';
import { PageHeader } from '@shared/components/layout';

// Shadcn UI Components
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

const { t } = useI18n();
const authStore = useAuthStore();
</script>

<template>
  <div class="flex flex-col gap-6 max-w-6xl w-full">
    <!-- Reusable Consistent PageHeader (No enclosing border) -->
    <PageHeader
      :title="t('dashboard.title')"
      :description="t('dashboard.description')"
      action-text="Create Course"
      :action-to="{ name: 'courses-list' }"
    />

    <!-- User Profile Details Summary Box -->
    <Card class="border border-border shadow-xs">
      <CardHeader class="border-b border-border pb-4">
        <CardTitle class="text-lg font-bold font-heading text-foreground">
          {{ t('dashboard.userSectionTitle') }}
        </CardTitle>
        <CardDescription class="text-xs text-muted-foreground">
          Current session and account privileges overview
        </CardDescription>
      </CardHeader>

      <CardContent class="pt-6 flex flex-col gap-5">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div class="flex flex-col gap-1 p-3 rounded-xl bg-muted/40 border border-border">
            <span class="text-muted-foreground">الاسم / Name</span>
            <span class="font-bold text-foreground">{{ authStore.user?.name || 'Saeed Kamel' }}</span>
          </div>
          <div class="flex flex-col gap-1 p-3 rounded-xl bg-muted/40 border border-border">
            <span class="text-muted-foreground">البريد / Email</span>
            <span class="font-bold text-foreground truncate">{{ authStore.user?.email || 's.ferguson@example.com' }}</span>
          </div>
          <div class="flex flex-col gap-1 p-3 rounded-xl bg-muted/40 border border-border">
            <span class="text-muted-foreground">الصلاحية / Role</span>
            <span class="font-bold text-primary">{{ authStore.user?.role || 'Lab Manager' }}</span>
          </div>
          <div class="flex flex-col gap-1 p-3 rounded-xl bg-muted/40 border border-border">
            <span class="text-muted-foreground">حالة الحساب / Status</span>
            <span class="font-bold text-emerald-600 dark:text-emerald-400">نشط (Active)</span>
          </div>
        </div>

        <!-- Quick Navigation Actions -->
        <div class="flex justify-end gap-3 pt-2">
          <router-link :to="{ name: 'courses-list' }">
            <Button variant="outline" class="font-bold cursor-pointer">
              {{ t('nav.viewCourses') }} 📚
            </Button>
          </router-link>
        </div>
      </CardContent>
    </Card>

    <!-- Dashboard KPI Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card class="p-4 border border-border flex flex-col justify-between gap-2 shadow-xs">
        <span class="text-xs font-medium text-muted-foreground">Total Learners</span>
        <div class="flex items-baseline justify-between">
          <span class="text-2xl font-extrabold text-foreground font-heading">1,248</span>
          <span class="text-xs font-semibold text-emerald-600 dark:text-emerald-400">+12%</span>
        </div>
      </Card>

      <Card class="p-4 border border-border flex flex-col justify-between gap-2 shadow-xs">
        <span class="text-xs font-medium text-muted-foreground">Active Courses</span>
        <div class="flex items-baseline justify-between">
          <span class="text-2xl font-extrabold text-foreground font-heading">42</span>
          <span class="text-xs font-semibold text-primary">Published</span>
        </div>
      </Card>

      <Card class="p-4 border border-border flex flex-col justify-between gap-2 shadow-xs">
        <span class="text-xs font-medium text-muted-foreground">Active Branches</span>
        <div class="flex items-baseline justify-between">
          <span class="text-2xl font-extrabold text-foreground font-heading">4</span>
          <span class="text-xs font-semibold text-muted-foreground">Branches</span>
        </div>
      </Card>

      <Card class="p-4 border border-border flex flex-col justify-between gap-2 shadow-xs">
        <span class="text-xs font-medium text-muted-foreground">Completion Rate</span>
        <div class="flex items-baseline justify-between">
          <span class="text-2xl font-extrabold text-foreground font-heading">89.4%</span>
          <span class="text-xs font-semibold text-emerald-600 dark:text-emerald-400">+4.2%</span>
        </div>
      </Card>
    </div>
  </div>
</template>
