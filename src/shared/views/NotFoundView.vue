<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@stores/auth.store';
import { PageHeader } from '@shared/components/layout';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const missingPath = computed(() => {
  const pathMatch = route.params.pathMatch;
  if (Array.isArray(pathMatch)) {
    return '/' + pathMatch.join('/');
  }
  return route.fullPath || '';
});

function handleGoBack() {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push({ name: 'dashboard' });
  }
}
</script>

<template>
  <div class="flex flex-col items-center justify-center w-full max-w-2xl mx-auto py-8">
    <PageHeader
      v-if="authStore.isAuthenticated"
      title="404 - Page Not Found"
      description="The page you are looking for does not exist or has been moved"
    />

    <Card class="border border-border shadow-md bg-card overflow-hidden w-full">
      <div class="h-2 w-full bg-primary" />

      <CardHeader class="text-center pb-2 pt-8">
        <div class="size-20 rounded-3xl bg-primary/10 text-primary flex items-center justify-center text-4xl mx-auto mb-4 shadow-xs">
          🔍
        </div>

        <span class="font-zain font-bold text-5xl sm:text-6xl text-primary leading-none tracking-tight">
          404
        </span>

        <CardTitle class="text-xl font-bold font-heading text-foreground mt-3">
          Page Not Found / الصفحة غير موجودة
        </CardTitle>
        <CardDescription class="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
          We couldn't find the page you're looking for. It might have been removed, had its name changed, or is temporarily unavailable.
        </CardDescription>
      </CardHeader>

      <CardContent class="flex flex-col gap-5 pt-4">
        <!-- Missing URL box -->
        <div v-if="missingPath" class="p-3 rounded-xl bg-muted/50 border border-border flex items-center justify-between text-xs">
          <span class="text-muted-foreground">Requested URL:</span>
          <code class="font-mono text-[11px] bg-background px-2 py-0.5 rounded border border-border text-foreground truncate max-w-xs">
            {{ missingPath }}
          </code>
        </div>

        <!-- Navigation Action Buttons -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            variant="outline"
            @click="handleGoBack()"
            class="w-full sm:w-auto font-medium cursor-pointer"
          >
            ← Go Back / السابق
          </Button>

          <router-link
            :to="authStore.isAuthenticated ? { name: 'dashboard' } : { name: 'login' }"
            class="w-full sm:w-auto"
          >
            <Button variant="default" class="w-full font-bold cursor-pointer">
              {{ authStore.isAuthenticated ? 'Back to Dashboard / الرئيسية' : 'Go to Login / تسجيل الدخول' }}
            </Button>
          </router-link>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
