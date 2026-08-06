<script setup lang="ts">
import { useField } from 'vee-validate';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface SelectOption {
  label: string;
  value: string | number;
}

interface Props {
  name: string;
  label?: string;
  options: SelectOption[];
  rules?: any;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  required: false,
  disabled: false,
});

const { t } = useI18n();
const { value, errorMessage, meta } = props.rules !== undefined
  ? useField<string | number>(() => props.name, props.rules)
  : useField<string | number>(() => props.name);

const selectPlaceholder = computed(() => props.placeholder || t('form.categorySelect'));
const hasError = computed(() => !!errorMessage.value && meta.touched);
</script>

<template>
  <div class="flex flex-col gap-1.5 w-full text-start">
    <Label v-if="label" :for="name" class="text-sm font-medium text-foreground">
      {{ label }}
      <span v-if="required" class="text-destructive font-bold ms-0.5">*</span>
    </Label>

    <Select :model-value="String(value || '')" @update:model-value="(val) => { if (val) value = String(val); }" :disabled="disabled">
      <SelectTrigger :class="[hasError && 'border-destructive focus:ring-destructive/20 bg-destructive/5']">
        <SelectValue :placeholder="selectPlaceholder" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem v-for="opt in options" :key="opt.value" :value="String(opt.value)">
          {{ opt.label }}
        </SelectItem>
      </SelectContent>
    </Select>

    <!-- Inline Error -->
    <span v-if="hasError" class="text-xs font-medium text-destructive flex items-center gap-1 mt-0.5">
      ⚠️ {{ errorMessage }}
    </span>
  </div>
</template>
