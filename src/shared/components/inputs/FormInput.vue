<script setup lang="ts">
import { useField } from 'vee-validate';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { Mail, Lock, Phone, Hash, Eye, EyeOff } from '@lucide/vue';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Props {
  name: string;
  label?: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'number';
  rules?: any;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  hint?: string;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  required: false,
  disabled: false,
});

const { t } = useI18n();

// Only pass rules argument to useField if props.rules is explicitly provided
const { value, errorMessage, meta } = props.rules !== undefined
  ? useField<string>(() => props.name, props.rules)
  : useField<string>(() => props.name);

const showPassword = ref(false);

const inputType = computed(() => {
  if (props.type === 'password') {
    return showPassword.value ? 'text' : 'password';
  }
  return props.type;
});

// Icon component based on input type for visual distinction
const leadingIconComponent = computed(() => {
  switch (props.type) {
    case 'email':
      return Mail;
    case 'password':
      return Lock;
    case 'tel':
      return Phone;
    case 'number':
      return Hash;
    default:
      return null;
  }
});

const hasError = computed(() => !!errorMessage.value && meta.touched);
</script>

<template>
  <div class="flex flex-col gap-1.5 w-full text-start">
    <!-- Label -->
    <Label v-if="label" :for="name" class="text-sm font-medium text-foreground flex items-center gap-1">
      {{ label }}
      <span v-if="required" class="text-destructive font-bold ms-0.5">*</span>
    </Label>

    <!-- Input Wrapper with Icon distinctions -->
    <div class="relative w-full flex items-center">
      <!-- Leading Icon Indicator (Email, Password, Tel, Number) -->
      <div
        v-if="leadingIconComponent"
        class="absolute ltr:left-3 rtl:right-3 pointer-events-none text-muted-foreground flex items-center justify-center"
      >
        <component :is="leadingIconComponent" class="w-4 h-4" />
      </div>

      <!-- Shadcn Input Component -->
      <Input
        :id="name"
        v-model="value"
        :type="inputType"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="[
          leadingIconComponent && 'ltr:pl-9 rtl:pr-9',
          type === 'password' && 'ltr:pr-10 rtl:pl-10',
          hasError && 'border-destructive focus-visible:ring-destructive/20 bg-destructive/5'
        ]"
      />

      <!-- Password Toggle Button for type="password" -->
      <button
        v-if="type === 'password'"
        type="button"
        @click="showPassword = !showPassword"
        :title="showPassword ? t('form.hidePassword') : t('form.showPassword')"
        class="absolute ltr:right-3 rtl:left-3 text-muted-foreground hover:text-foreground p-1 transition-colors rounded-md cursor-pointer"
      >
        <EyeOff v-if="showPassword" class="w-4 h-4" />
        <Eye v-else class="w-4 h-4" />
      </button>
    </div>

    <!-- Inline Validation Error Message -->
    <span v-if="hasError" class="text-xs font-medium text-destructive flex items-center gap-1 mt-0.5">
      ⚠️ {{ errorMessage }}
    </span>

    <!-- Hint Text -->
    <span v-else-if="hint" class="text-xs text-muted-foreground">
      {{ hint }}
    </span>
  </div>
</template>
