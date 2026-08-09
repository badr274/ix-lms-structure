<script setup lang="ts">
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';
import { AppModal, useModal } from '@shared/components/modals';
import { FormInput, FormSelect } from '@shared/components/inputs';
import { IconRoles, IconBranches } from '@shared/components/icons';
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

const modal = useModal();

const inviteSchema = z.object({
  name: z.string().min(2, 'Name is required (at least 2 characters)'),
  email: rules.email,
  role: z.string().min(1, 'Please select a role'),
  branch: z.string().min(1, 'Please select a branch'),
});

type InviteForm = z.infer<typeof inviteSchema>;

const { handleSubmit, resetForm, isSubmitting } = useForm<InviteForm>({
  validationSchema: toTypedSchema(inviteSchema),
  initialValues: {
    name: '',
    email: '',
    role: 'INSTRUCTOR',
    branch: '1',
  },
});

const roleOptions = [
  { label: 'Admin / Manager', value: 'ADMIN' },
  { label: 'Instructor / Teacher', value: 'INSTRUCTOR' },
  { label: 'Learner / Student', value: 'STUDENT' },
];

const branchOptions = [
  { label: 'IX Training Center', value: '1' },
  { label: 'Cairo Main Campus', value: '2' },
  { label: 'Riyadh Digital Academy', value: '3' },
  { label: 'Dubai Innovation Hub', value: '4' },
];

const onSubmit = handleSubmit(async (values) => {
  await new Promise((resolve) => setTimeout(resolve, 600));

  emit('update:open', false);
  resetForm();

  // Show Success Modal (Figma 43:308)
  modal.success({
    title: 'Congratulations !',
    description: `Invitation sent to ${values.email} as ${values.role} successfully.`,
    buttonText: 'Done',
  });

  emit('success');
});

function handleCancel() {
  emit('update:open', false);
  resetForm();
}
</script>

<template>
  <AppModal
    :open="open"
    title="Invite New User"
    description="Send an invitation to join your workspace"
    size="md"
    @update:open="(val) => emit('update:open', val)"
    @close="handleCancel"
  >
    <form @submit.prevent="onSubmit" class="flex flex-col gap-4">
      <!-- Your Name Input -->
      <FormInput
        name="name"
        label="Your Name"
        placeholder="Enter your full name ..."
        required
      />

      <!-- Email Address Input -->
      <FormInput
        name="email"
        type="email"
        label="Email Address"
        placeholder="Enter your email address ..."
        required
      />

      <!-- Role Select -->
      <FormSelect
        name="role"
        label="Role"
        :options="roleOptions"
        :icon="IconRoles"
        placeholder="Select Role .."
        required
      />

      <!-- Branch Select -->
      <FormSelect
        name="branch"
        label="Branch"
        :options="branchOptions"
        :icon="IconBranches"
        placeholder="Select Branch .."
        required
      />

      <!-- Modal Footer Action Buttons (Shadcn Buttons) -->
      <div class="flex items-center justify-end gap-3 pt-4 border-t border-border/60 mt-2">
        <Button
          type="button"
          variant="outline"
          @click="handleCancel"
        >
          Cancel
        </Button>

        <Button
          type="submit"
          :disabled="isSubmitting"
        >
          <span v-if="isSubmitting" class="animate-spin text-sm">⏳</span>
          <span>Send Invitation</span>
        </Button>
      </div>
    </form>
  </AppModal>
</template>
