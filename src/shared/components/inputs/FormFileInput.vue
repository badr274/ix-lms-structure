<script setup lang="ts">
import { useField } from 'vee-validate';
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface Props {
  name: string;
  label?: string;
  rules?: any;
  accept?: string;
  maxSizeMB?: number;
  required?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  accept: 'image/jpeg,image/png',
  maxSizeMB: 3,
  required: false,
});

const { t } = useI18n();
const { errorMessage, setValue, meta } = props.rules !== undefined
  ? useField<File | null>(() => props.name, props.rules)
  : useField<File | null>(() => props.name);

const previewUrl = ref<string | null>(null);

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    setValue(file);
    previewUrl.value = URL.createObjectURL(file);
  }
}

function removeFile() {
  setValue(null);
  previewUrl.value = null;
}

const hasError = computed(() => !!errorMessage.value && meta.touched);
</script>

<template>
  <div class="flex flex-col gap-1.5 w-full text-start">
    <Label v-if="label" class="text-sm font-medium text-foreground">
      {{ label }}
      <span v-if="required" class="text-destructive font-bold ms-0.5">*</span>
    </Label>

    <!-- Upload Box -->
    <div
      :class="[
        'relative border-2 border-dashed rounded-xl p-4 transition-all flex flex-col items-center justify-center text-center cursor-pointer bg-muted/50 hover:bg-muted',
        hasError ? 'border-destructive bg-destructive/10' : 'border-border hover:border-primary'
      ]"
    >
      <input
        type="file"
        :accept="accept"
        @change="handleFileChange"
        class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      />

      <!-- Image Preview -->
      <div v-if="previewUrl" class="relative z-20 flex flex-col items-center gap-2">
        <img :src="previewUrl" alt="Preview" class="h-24 w-24 object-cover rounded-lg border border-border shadow-sm" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          @click.stop="removeFile"
          class="text-xs text-destructive hover:text-destructive hover:bg-destructive/10 font-medium cursor-pointer"
        >
          {{ t('form.deleteImage') }}
        </Button>
      </div>

      <!-- Placeholder Text -->
      <div v-else class="flex flex-col items-center gap-1 text-muted-foreground">
        <span class="text-2xl">🖼️</span>
        <span class="text-xs font-medium text-foreground">{{ t('form.coverImageClick') }}</span>
        <span class="text-[11px] text-muted-foreground">{{ t('form.coverImageFormat') }}</span>
      </div>
    </div>

    <!-- Inline Error -->
    <span v-if="hasError" class="text-xs font-medium text-destructive flex items-center gap-1 mt-0.5">
      ⚠️ {{ errorMessage }}
    </span>
  </div>
</template>
