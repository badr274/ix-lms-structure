<script setup lang="ts">
import { ref } from 'vue';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@stores/auth.store';
import { useAppToast } from '@shared/composables/useAppToast';
import { AppButton } from '@shared/components/buttons';
import { authApi } from '../api/auth.api';
import { loginSchema, type LoginInput } from '../schemas/auth.schema';

// Shadcn UI Components
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Shared Input Components
import { FormInput } from '@shared/components/inputs';

const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const appToast = useAppToast();

const isSubmitting = ref(false);

const { handleSubmit, setValues } = useForm<LoginInput>({
  validationSchema: toTypedSchema(loginSchema),
  initialValues: {
    email: 'emilys@dummyjson.com',
    password: 'emilyspass',
  },
});

function fillDemoCredentials() {
  setValues({
    email: 'emilys@dummyjson.com',
    password: 'emilyspass',
  });
}

const onSubmit = handleSubmit(async (values) => {
  isSubmitting.value = true;
  try {
    const res = await authApi.login({
      email: values.email,
      password: values.password,
    });

    authStore.setSession(res.token, res.user);
    appToast.success(t('auth.loginSuccessToast'));

    const redirectTarget = (route.query.redirect as string) || '/dashboard';
    router.push(redirectTarget);
  } catch (err: any) {
    const errorMsg = err.response?.data?.message || err.message || t('form.errorToast');
    appToast.error(`❌ ${errorMsg}`);
  } finally {
    isSubmitting.value = false;
  }
});
</script>

<template>
  <div class="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
    <Card class="w-full max-w-md shadow-lg border border-border">
      <CardHeader class="text-center border-b border-border pb-4">
        <div class="w-12 h-12 mx-auto mb-2 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-2xl shadow-md">
          IX
        </div>
        <CardTitle class="text-xl font-bold">{{ t('auth.loginTitle') }}</CardTitle>
        <CardDescription class="text-xs text-muted-foreground mt-1">
          {{ t('auth.loginSub') }}
        </CardDescription>
      </CardHeader>

      <CardContent class="pt-6 flex flex-col gap-4">
        <!-- Demo Credentials Hint Box -->
        <div class="p-3 rounded-lg bg-muted/70 border border-border text-xs flex justify-between items-center gap-2">
          <div class="flex flex-col text-start">
            <span class="font-bold text-foreground">💡 Test API Credentials (DummyJSON):</span>
            <span class="text-muted-foreground font-mono">User: emilys / Pass: emilyspass</span>
          </div>
          <Badge variant="outline" class="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors" @click="fillDemoCredentials">
            Autofill 🪄
          </Badge>
        </div>

        <form @submit.prevent="onSubmit" class="flex flex-col gap-4">
          <!-- Email Input -->
          <FormInput
            name="email"
            type="email"
            :label="t('auth.email')"
            :placeholder="t('auth.emailPlaceholder')"
            required
          />

          <!-- Password Input -->
          <FormInput
            name="password"
            type="password"
            :label="t('auth.password')"
            :placeholder="t('auth.passwordPlaceholder')"
            required
          />

          <!-- Global Action Button with automatic spinner -->
          <div class="flex flex-col gap-3 pt-4 border-t border-border mt-2">
            <AppButton type="submit" variant="default" full-width :loading="isSubmitting">
              {{ t('auth.submitLogin') }}
            </AppButton>

            <router-link
              :to="{ name: 'register', query: route.query.redirect ? { redirect: route.query.redirect } : {} }"
              class="text-xs text-center text-primary hover:underline"
            >
              {{ t('auth.dontHaveAccount') }}
            </router-link>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
