<script setup lang="ts">
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';
import { useAuthStore } from '@stores/auth.store';
import { AppModal, useModal } from '@shared/components/modals';
import { FormInput } from '@shared/components/inputs';
import { Button } from '@/components/ui/button';
import { rules } from '@core/validation/rules';

interface Props {
  open: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: 'update:open', value: boolean): void;
  (e: 'success'): void;
}>();

const authStore = useAuthStore();
const modal = useModal();

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: rules.phone,
  email: rules.email,
});

type ProfileForm = z.infer<typeof profileSchema>;

const { handleSubmit, isSubmitting } = useForm<ProfileForm>({
  validationSchema: toTypedSchema(profileSchema),
  initialValues: {
    name: authStore.user?.name || 'Mohamed Ahmed',
    phone: '01234567890',
    email: authStore.user?.email || 'mohamed.ahmed95@gmail.com',
  },
});

const onSubmit = handleSubmit(async (values) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (authStore.user) {
    authStore.user.name = values.name;
    authStore.user.email = values.email;
  }

  emit('update:open', false);

  modal.success({
    title: 'Congratulations !',
    description: 'Your personal information has been updated successfully.',
    buttonText: 'Done',
  });

  emit('success');
});
</script>

<template>
  <AppModal
    :open="open"
    title="Edit Personal Information"
    size="md"
    @update:open="(val) => emit('update:open', val)"
  >
    <!-- Avatar with Upload Badge (Figma Frame 43:125) -->
    <div class="flex items-center justify-center mb-2">
      <div class="relative size-24 rounded-full bg-muted/60 border-2 border-border flex items-center justify-center shadow-xs">
        <img
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
          alt="Profile Avatar"
          class="size-22 rounded-full object-cover pointer-events-none"
        />
        <!-- Upload Badge Indicator -->
        <button
          type="button"
          class="absolute bottom-0 end-0 size-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs shadow-md hover:bg-primary/90 transition-transform active:scale-95 cursor-pointer"
          title="Upload new photo"
        >
          ☁️
        </button>
      </div>
    </div>

    <!-- Form Fields -->
    <form @submit.prevent="onSubmit" class="flex flex-col gap-4">
      <FormInput
        name="name"
        label="Your Name"
        placeholder="Enter your name ..."
        required
      />

      <FormInput
        name="phone"
        type="tel"
        label="Phone Number"
        placeholder="Enter phone number ..."
        required
      />

      <FormInput
        name="email"
        type="email"
        label="Email Address"
        placeholder="Enter email address ..."
        required
      />

      <!-- Action Buttons (Shadcn Buttons) -->
      <div class="flex items-center justify-end gap-3 pt-4 border-t border-border/60 mt-2">
        <Button
          type="button"
          variant="outline"
          @click="emit('update:open', false)"
        >
          Cancel
        </Button>

        <Button
          type="submit"
          :disabled="isSubmitting"
        >
          <span v-if="isSubmitting" class="animate-spin text-sm">⏳</span>
          <span>Save</span>
        </Button>
      </div>
    </form>
  </AppModal>
</template>
