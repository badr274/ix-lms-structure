<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import AppLayout from './AppLayout.vue';
import PageHeader from './PageHeader.vue';
import InviteUserModal from '@features/auth/components/InviteUserModal.vue';
import { useModal } from '@shared/components/modals';

const route = useRoute();
const modal = useModal();

const isInviteModalOpen = ref(false);

const sectionMeta = computed(() => {
  const path = route.path.replace('/', '').toLowerCase();
  switch (path) {
    case 'users':
      return {
        title: 'Users',
        description: 'View and manage organization users',
        actionText: 'Invite User',
      };
    case 'branches':
      return {
        title: 'Branches',
        description: 'Manage organization branches and training centers',
        actionText: 'Add Branch',
      };
    case 'roles':
      return {
        title: 'Roles & Permissions',
        description: 'Configure roles, capabilities, and system access permissions',
        actionText: 'Create Role',
      };
    case 'learners':
      return {
        title: 'Learners',
        description: 'Track and manage enrolled learners and progress',
        actionText: 'Add Learner',
      };
    case 'guardian':
      return {
        title: 'Guardian',
        description: 'Manage parent and guardian accounts and links',
        actionText: 'Add Guardian',
      };
    case 'audit-log':
      return {
        title: 'Audit Log',
        description: 'Track system activities, audit trails, and security logs',
        actionText: 'Export Log',
      };
    case 'settings':
      return {
        title: 'Settings',
        description: 'System settings, organizational preferences, and branding',
        actionText: undefined,
      };
    default: {
      const metaTitle = (route.meta?.title as string) || (path.charAt(0).toUpperCase() + path.slice(1));
      return {
        title: metaTitle,
        description: `Manage and configure ${metaTitle} in NASAQ LMS.`,
        actionText: undefined,
      };
    }
  }
});

async function handleActionClick() {
  const path = route.path.replace('/', '').toLowerCase();
  if (path === 'users') {
    isInviteModalOpen.value = true;
  } else {
    const confirmed = await modal.confirm({
      title: `${sectionMeta.value.actionText}`,
      description: `Do you want to proceed with ${sectionMeta.value.actionText}?`,
      confirmText: 'Proceed',
      variant: 'primary',
    });
    if (confirmed) {
      modal.success({
        title: 'Congratulations !',
        description: `${sectionMeta.value.title} action completed successfully.`,
      });
    }
  }
}
</script>

<template>
  <AppLayout :title="sectionMeta.title">
    <div class="flex flex-col w-full">
      <!-- Reusable Consistent PageHeader -->
      <PageHeader
        :title="sectionMeta.title"
        :description="sectionMeta.description"
        :action-text="sectionMeta.actionText"
        @action="handleActionClick"
      />

      <!-- Content Area -->
      <div class="flex-1 w-full flex flex-col pt-2">
        <div class="p-8 sm:p-12 text-center text-muted-foreground border border-dashed border-border rounded-2xl flex flex-col items-center justify-center gap-3 bg-muted/20">
          <div class="size-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl">
            ✨
          </div>
          <h3 class="font-ibm font-semibold text-foreground text-base m-0">
            {{ sectionMeta.title }} Section Ready
          </h3>
          <p class="text-xs text-muted-foreground max-w-md m-0">
            {{ sectionMeta.description }}
          </p>
        </div>
      </div>
    </div>

    <!-- Invite User Modal (Figma 59:1013) -->
    <InviteUserModal v-model:open="isInviteModalOpen" />
  </AppLayout>
</template>
