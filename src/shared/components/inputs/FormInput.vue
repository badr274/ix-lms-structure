<script setup lang="ts">
import { useField } from 'vee-validate';
import { computed, ref, type Component } from 'vue';
import { useI18n } from 'vue-i18n';
import { Mail, Lock, Phone, Hash, Eye, EyeOff, User } from '@lucide/vue';
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
  icon?: Component;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  required: false,
  disabled: false,
});

const { t } = useI18n();

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

const resolvedIcon = computed(() => {
  if (props.icon) return props.icon;
  if (props.name.toLowerCase().includes('name')) return User;
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
  <div class="flex flex-col gap-1.5 w-full text-start select-none">
    <!-- Shadcn Label -->
    <Label
      v-if="label"
      :for="name"
      class="font-zain text-[14px] text-foreground font-normal flex items-center gap-1 cursor-pointer"
    >
      <span>{{ label }}</span>
      <span v-if="required" class="text-destructive font-bold ms-0.5">*</span>
    </Label>

    <!-- Relative Container for Shadcn Input + Icons -->
    <div class="relative flex w-full items-center">
      <!-- Leading Icon -->
      <div
        v-if="resolvedIcon || $slots.icon"
        class="absolute start-4 pointer-events-none text-muted-foreground flex items-center justify-center z-10"
      >
        <slot name="icon">
          <component :is="resolvedIcon" class="size-5" />
        </slot>
      </div>

      <!-- Shadcn Input Component -->
      <Input
        :id="name"
        v-model="value"
        :type="inputType"
        :placeholder="placeholder"
        :disabled="disabled"
        :aria-invalid="hasError"
        :class="[
          (resolvedIcon || $slots.icon) && 'ps-12',
          type === 'password' && 'pe-12',
        ]"
      />

      <!-- Password Eye Toggle -->
      <button
        v-if="type === 'password'"
        type="button"
        @click="showPassword = !showPassword"
        :title="showPassword ? t('form.hidePassword') : t('form.showPassword')"
        class="absolute end-3 size-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer shrink-0 focus:outline-none z-10"
      >
        <EyeOff v-if="showPassword" class="size-4" />
        <Eye v-else class="size-4" />
      </button>

      <div v-if="$slots.trailing" class="absolute end-3 z-10">
        <slot name="trailing" />
      </div>
    </div>

    <!-- Validation Error -->
    <span
      v-if="hasError"
      class="text-xs font-medium text-destructive flex items-center gap-1 ms-3 animate-in fade-in slide-in-from-top-1"
    >
      ⚠️ {{ errorMessage }}
    </span>

    <!-- Hint -->
    <span v-else-if="hint" class="text-xs text-muted-foreground ms-3">
      {{ hint }}
    </span>
  </div>
</template>
