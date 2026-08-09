<script setup lang="ts">
import { useField } from 'vee-validate';
import { computed } from 'vue';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Props {
  name: string;
  label?: string;
  rules?: any;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
}

const props = withDefaults(defineProps<Props>(), {
  required: false,
  disabled: false,
  rows: 4,
});

const { value, errorMessage, meta } = props.rules !== undefined
  ? useField<string>(() => props.name, props.rules)
  : useField<string>(() => props.name);

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

    <!-- Shadcn Textarea -->
    <Textarea
      :id="name"
      v-model="value"
      :rows="rows"
      :placeholder="placeholder"
      :disabled="disabled"
      :aria-invalid="hasError"
    />

    <!-- Inline Validation Error -->
    <span
      v-if="hasError"
      class="text-xs font-medium text-destructive flex items-center gap-1 ms-3 animate-in fade-in slide-in-from-top-1"
    >
      ⚠️ {{ errorMessage }}
    </span>
  </div>
</template>
