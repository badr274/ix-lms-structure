import { computed } from 'vue';
import { useAuthStore } from '@stores/auth.store';
import { ROLE_PERMISSIONS, type Permission, type Role } from './permissions.config';

export function usePermissions() {
  const authStore = useAuthStore();

  const userRole = computed<Role>(() => (authStore.user?.role as Role) || 'STUDENT');

  function hasPermission(permission: Permission): boolean {
    const permissions = ROLE_PERMISSIONS[userRole.value] || [];
    return permissions.includes(permission);
  }

  function hasRole(role: Role | Role[]): boolean {
    if (Array.isArray(role)) {
      return role.includes(userRole.value);
    }
    return userRole.value === role;
  }

  return {
    userRole,
    hasPermission,
    hasRole,
  };
}
