<script setup lang="ts">
import { useField } from 'vee-validate';
import { ref, watch, computed } from 'vue';
import { Label } from '@/components/ui/label';

interface Props {
  name: string;
  label?: string;
  rules?: any;
  length?: number;
}

const props = withDefaults(defineProps<Props>(), {
  length: 6,
});

const { errorMessage, setValue, meta } = props.rules !== undefined
  ? useField<string>(() => props.name, props.rules)
  : useField<string>(() => props.name);

const digits = ref<string[]>(Array(props.length).fill(''));
const inputRefs = ref<HTMLInputElement[]>([]);

watch(
  digits,
  (newDigits) => {
    setValue(newDigits.join(''));
  },
  { deep: true }
);

function handleInput(index: number, event: Event) {
  const input = event.target as HTMLInputElement;
  const val = input.value;

  if (val && index < props.length - 1) {
    inputRefs.value[index + 1]?.focus();
  }
}

function handleKeydown(index: number, event: KeyboardEvent) {
  if (event.key === 'Backspace' && !digits.value[index] && index > 0) {
    inputRefs.value[index - 1]?.focus();
  }
}

function handlePaste(event: ClipboardEvent) {
  event.preventDefault();
  const pastedData = event.clipboardData?.getData('text').trim() || '';
  if (/^\d+$/.test(pastedData)) {
    const chars = pastedData.slice(0, props.length).split('');
    chars.forEach((char, idx) => {
      digits.value[idx] = char;
    });
    inputRefs.value[Math.min(chars.length, props.length - 1)]?.focus();
  }
}

const hasError = computed(() => !!errorMessage.value && meta.touched);
</script>

<template>
  <div class="flex flex-col gap-2 items-center text-center">
    <Label v-if="label" class="text-sm font-medium text-foreground">
      {{ label }}
    </Label>

    <!-- OTP Input Boxes -->
    <div class="flex gap-2 justify-center dir-ltr" @paste="handlePaste">
      <input
        v-for="(_, index) in length"
        :key="index"
        ref="inputRefs"
        v-model="digits[index]"
        type="text"
        maxlength="1"
        inputmode="numeric"
        @input="handleInput(index, $event)"
        @keydown="handleKeydown(index, $event)"
        :class="[
          'w-11 h-12 text-center text-xl font-bold rounded-lg border transition-all focus:outline-none focus:ring-2 bg-background text-foreground',
          hasError
            ? 'border-destructive focus:ring-destructive/20 bg-destructive/5 text-destructive'
            : 'border-input focus:border-primary focus:ring-primary/20',
        ]"
      />
    </div>

    <!-- Inline Error -->
    <span v-if="hasError" class="text-xs font-medium text-destructive mt-1">
      ⚠️ {{ errorMessage }}
    </span>
  </div>
</template>
