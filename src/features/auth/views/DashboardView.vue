<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useThemeStore } from '@stores/theme.store';
import { useAuthStore } from '@stores/auth.store';
import { useLocaleStore } from '@stores/locale.store';
import { useAppToast } from '@shared/composables/useAppToast';

// Shadcn UI Components
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const { t } = useI18n();
const router = useRouter();
const themeStore = useThemeStore();
const authStore = useAuthStore();
const localeStore = useLocaleStore();
const appToast = useAppToast();

function handleLogout() {
  authStore.logout();
  appToast.info(t('auth.logout'));
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

      <!-- Right Controls: Theme + i18n Language Toggle + Logout -->
      <div class="flex items-center gap-3">
        <!-- Auth User Badge -->
        <Badge v-if="authStore.user" variant="outline" class="hidden sm:flex items-center gap-2 py-1.5 px-3">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>{{ authStore.user.name }}</span>
        </Badge>

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

        <!-- Logout Button -->
        <Button variant="destructive" size="sm" @click="handleLogout()" class="text-xs font-semibold cursor-pointer">
          {{ t('auth.logout') }}
        </Button>
      </div>
    </header>

    <!-- Main Dashboard Container -->
    <main class="flex-1 max-w-4xl w-full mx-auto p-6 flex flex-col gap-6">
      <Card class="p-8 shadow-sm border border-border flex flex-col gap-6">
        <CardHeader class="p-0 border-b border-border pb-4">
          <Badge variant="secondary" class="w-fit mb-2">
            🚀 {{ t('header.version') }}
          </Badge>
          <CardTitle class="text-2xl font-bold">{{ t('dashboard.title') }}</CardTitle>
          <CardDescription class="text-sm mt-1">
            {{ t('dashboard.description') }}
          </CardDescription>
        </CardHeader>

        <CardContent class="p-0 flex flex-col gap-4">
          <div class="p-4 rounded-xl bg-muted border border-border flex flex-col gap-2">
            <h3 class="text-sm font-bold text-foreground m-0">{{ t('dashboard.userSectionTitle') }}</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground mt-1">
              <div><strong>الاسم / Name:</strong> {{ authStore.user?.name || '—' }}</div>
              <div><strong>البريد الإلكتروني / Email:</strong> {{ authStore.user?.email || '—' }}</div>
              <div><strong>الصلاحية / Role:</strong> {{ authStore.user?.role || 'USER' }}</div>
              <div><strong>حالة الحساب / Status:</strong> <span class="text-emerald-500 font-bold">نشط ومرخص (Active)</span></div>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-2">
            <router-link :to="{ name: 'courses-list' }">
              <Button variant="default" class="font-bold cursor-pointer">
                {{ t('nav.viewCourses') }} 📚
              </Button>
            </router-link>
          </div>
        </CardContent>
      </Card>
    </main>
  </div>
</template>
