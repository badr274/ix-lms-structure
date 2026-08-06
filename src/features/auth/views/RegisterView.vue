<script setup lang="ts">
import { computed } from 'vue';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@stores/auth.store';
import { useAppToast } from '@shared/composables/useAppToast';
import { AppButton } from '@shared/components/buttons';
import { registerSchema, type RegisterInput } from '../schemas/auth.schema';

// Shadcn UI Components
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

// Shared Input Components
import { FormInput, FormSelect, FormFileInput } from '@shared/components/inputs';

const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const appToast = useAppToast();

const accountTypeOptions = computed(() => [
  { label: t('auth.typeAcademy'), value: 'academy' },
  { label: t('auth.typeCompany'), value: 'company' },
  { label: t('auth.typeInstructor'), value: 'instructor' },
]);

const { handleSubmit, isSubmitting } = useForm<RegisterInput>({
  validationSchema: toTypedSchema(registerSchema),
  initialValues: {
    personName: '',
    email: '',
    phone: '',
    orgName: '',
    accountType: '',
    password: '',
    confirmPassword: '',
  },
});

const onSubmit = handleSubmit(async (values) => {
  // Simulate auth API call delay
  await new Promise((resolve) => setTimeout(resolve, 600));

  authStore.setSession('auth-token-jwt-999', {
    id: `usr-${Date.now()}`,
    name: values.personName,
    email: values.email,
    role: 'ADMIN',
  });

  appToast.success(t('auth.registerSuccessToast'));

  // Redirect back to original requested URL if redirect query exists, else to dashboard
  const redirectTarget = (route.query.redirect as string) || '/dashboard';
  router.push(redirectTarget);
});
</script>

<template>
  <div class="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
    <Card class="w-full max-w-xl shadow-lg border border-border">
      <CardHeader class="text-center border-b border-border pb-4">
        <div class="w-12 h-12 mx-auto mb-2 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-2xl shadow-md">
          IX
        </div>
        <CardTitle class="text-xl font-bold">{{ t('auth.registerTitle') }}</CardTitle>
        <CardDescription class="text-xs text-muted-foreground mt-1">
          {{ t('auth.registerSub') }}
        </CardDescription>
      </CardHeader>

      <CardContent class="pt-6">
        <form @submit.prevent="onSubmit" class="flex flex-col gap-4">
          <!-- Full Name -->
          <FormInput
            name="personName"
            type="text"
            :label="t('auth.personName')"
            :placeholder="t('auth.personNamePlaceholder')"
            required
          />

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Email (with Mail Icon) -->
            <FormInput
              name="email"
              type="email"
              :label="t('auth.email')"
              :placeholder="t('auth.emailPlaceholder')"
              required
            />

            <!-- Phone (with Phone Icon) -->
            <FormInput
              name="phone"
              type="tel"
              :label="t('auth.phone')"
              :placeholder="t('auth.phonePlaceholder')"
              required
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Organization Name -->
            <FormInput
              name="orgName"
              type="text"
              :label="t('auth.orgName')"
              :placeholder="t('auth.orgNamePlaceholder')"
              required
            />

            <!-- Account Type FormSelect -->
            <FormSelect
              name="accountType"
              :label="t('auth.accountType')"
              :placeholder="t('auth.accountTypeSelect')"
              :options="accountTypeOptions"
              required
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Password (with Lock Icon & Eye Toggle) -->
            <FormInput
              name="password"
              type="password"
              :label="t('auth.password')"
              :placeholder="t('auth.passwordPlaceholder')"
              required
            />

            <!-- Confirm Password -->
            <FormInput
              name="confirmPassword"
              type="password"
              :label="t('auth.confirmPassword')"
              :placeholder="t('auth.confirmPasswordPlaceholder')"
              required
            />
          </div>

          <!-- Logo Image Upload -->
          <FormFileInput
            name="logoImage"
            :label="t('auth.logoImage')"
          />

          <!-- Global Action Button with automatic spinner -->
          <div class="flex flex-col gap-3 pt-4 border-t border-border mt-2">
            <AppButton type="submit" variant="default" full-width :loading="isSubmitting">
              {{ t('auth.submitRegister') }}
            </AppButton>

            <router-link
              :to="{ name: 'login', query: route.query.redirect ? { redirect: route.query.redirect } : {} }"
              class="text-xs text-center text-primary hover:underline"
            >
              {{ t('auth.alreadyHaveAccount') }}
            </router-link>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
