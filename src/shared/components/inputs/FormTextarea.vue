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
  rows?: number;
  maxlength?: number;
  required?: boolean;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  rows: 4,
  required: false,
  disabled: false,
});

const { value, errorMessage, meta } = props.rules !== undefined
  ? useField<string>(() => props.name, props.rules)
  : useField<string>(() => props.name);

const charCount = computed(() => (value.value ? value.value.length : 0));
const hasError = computed(() => !!errorMessage.value && meta.touched);
</script>

<template>
  <div class="flex flex-col gap-1.5 w-full text-start">
    <!-- Label & Counter -->
    <div class="flex justify-between items-center">
      <Label v-if="label" :for="name" class="text-sm font-medium text-foreground">
        {{ label }}
        <span v-if="required" class="text-destructive font-bold ms-0.5">*</span>
      </Label>
      <span v-if="maxlength" class="text-xs text-muted-foreground font-mono">
        {{ charCount }} / {{ maxlength }}
      </span>
    </div>

    <!-- Textarea Component from Shadcn Vue -->
    <Textarea
      :id="name"
      v-model="value"
      :rows="rows"
      :maxlength="maxlength"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="[
        hasError && 'border-destructive focus-visible:ring-destructive/20 bg-destructive/5'
      ]"
    />

    <!-- Inline Error -->
    <span v-if="hasError" class="text-xs font-medium text-destructive flex items-center gap-1 mt-0.5">
      ⚠️ {{ errorMessage }}
    </span>
  </div>
</template>
