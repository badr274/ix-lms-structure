<script setup lang="ts">
import { computed } from 'vue';
import { usePermissions } from './usePermissions';
import type { Permission, Role } from './permissions.config';

const props = defineProps<{
  permission?: Permission;
  role?: Role | Role[];
}>();

const { hasPermission, hasRole } = usePermissions();

const isAllowed = computed(() => {
  if (props.permission && !hasPermission(props.permission)) {
    return false;
  }
  if (props.role && !hasRole(props.role)) {
    return false;
  }
  return true;
});
</script>

<template>
  <slot v-if="isAllowed" />
</template>
