<script setup lang="ts">
import { useField } from 'vee-validate';
import { computed, type Component } from 'vue';
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
  icon?: Component;
}

const props = withDefaults(defineProps<Props>(), {
  required: false,
  disabled: false,
});

const { t } = useI18n();
const { value, errorMessage, meta } = props.rules !== undefined
  ? useField<string | number>(() => props.name, props.rules)
  : useField<string | number>(() => props.name);

const selectPlaceholder = computed(() => props.placeholder || t('form.categorySelect', 'Select option ...'));
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

    <!-- Capsule Select Trigger -->
    <Select
      :model-value="String(value || '')"
      @update:model-value="(val) => { if (val) value = String(val); }"
      :disabled="disabled"
    >
      <SelectTrigger :id="name" :aria-invalid="hasError">
        <div class="flex items-center gap-3 flex-1 truncate">
          <component
            :is="icon"
            v-if="icon"
            class="size-5 shrink-0 text-muted-foreground pointer-events-none"
          />
          <SelectValue :placeholder="selectPlaceholder" />
        </div>
      </SelectTrigger>

      <SelectContent>
        <SelectItem
          v-for="opt in options"
          :key="opt.value"
          :value="String(opt.value)"
        >
          {{ opt.label }}
        </SelectItem>
      </SelectContent>
    </Select>

    <!-- Inline Validation Error -->
    <span
      v-if="hasError"
      class="text-xs font-medium text-destructive flex items-center gap-1 ms-3 animate-in fade-in slide-in-from-top-1"
    >
      ⚠️ {{ errorMessage }}
    </span>
  </div>
</template>
