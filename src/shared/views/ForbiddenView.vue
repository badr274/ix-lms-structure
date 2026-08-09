<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@stores/auth.store';
import { PageHeader } from '@shared/components/layout';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const route = useRoute();
const authStore = useAuthStore();

const attemptedPath = computed(() => (route.query.from as string) || '');
</script>

<template>
  <div class="flex flex-col w-full max-w-2xl mx-auto py-6">
    <PageHeader
      title="403 - Access Denied"
      description="You do not have the required role or permissions to access this page"
    />

    <Card class="border border-destructive/30 shadow-md bg-card overflow-hidden">
      <div class="h-2 w-full bg-destructive" />

      <CardHeader class="text-center pb-2 pt-6">
        <div class="size-16 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center text-3xl mx-auto mb-3 shadow-xs">
          🛡️
        </div>
        <CardTitle class="text-xl font-bold font-heading text-foreground">
          Restricted Page / صفحة مقيدة
        </CardTitle>
        <CardDescription class="text-xs text-muted-foreground mt-1">
          This section requires higher administrative privileges.
        </CardDescription>
      </CardHeader>

      <CardContent class="flex flex-col gap-4 pt-4">
        <!-- Details Box -->
        <div class="p-4 rounded-xl bg-muted/50 border border-border flex flex-col gap-2 text-xs">
          <div class="flex items-center justify-between">
            <span class="text-muted-foreground">Your Current Role:</span>
            <Badge variant="outline" class="font-bold text-primary border-primary/40">
              {{ authStore.user?.role || 'STUDENT' }}
            </Badge>
          </div>
          <div v-if="attemptedPath" class="flex items-center justify-between border-t border-border/50 pt-2">
            <span class="text-muted-foreground">Requested Path:</span>
            <code class="font-mono text-[11px] bg-background px-2 py-0.5 rounded border border-border text-foreground">
              {{ attemptedPath }}
            </code>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <router-link :to="{ name: 'dashboard' }" class="w-full sm:w-auto">
            <Button variant="default" class="w-full font-bold cursor-pointer">
              Back to Dashboard / العودة للرئيسية
            </Button>
          </router-link>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
