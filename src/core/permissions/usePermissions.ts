import { computed } from 'vue';
import { useAuthStore } from '@stores/auth.store';
import { ROLE_PERMISSIONS, type Permission, type Role } from './permissions.config';

export function usePermissions() {
  const authStore = useAuthStore();

  const userRole = computed<Role>(() => (authStore.user?.role as Role) || 'STUDENT');

  const userPermissions = computed<Permission[]>(() => {
    // 1. If backend API explicitly provided a list of permissions for this user:
    if (authStore.user?.permissions && Array.isArray(authStore.user.permissions)) {
      return authStore.user.permissions;
    }
    // 2. Otherwise fallback to client-side role-to-permissions map:
    return ROLE_PERMISSIONS[userRole.value] || [];
  });

  function hasPermission(permission: Permission): boolean {
    // Super-admin bypass: ADMIN always has all permissions
    if (userRole.value === 'ADMIN') return true;

    return userPermissions.value.includes(permission);
  }

  function hasAnyPermission(permissions: Permission[]): boolean {
    if (userRole.value === 'ADMIN') return true;
    if (!permissions || permissions.length === 0) return true;

    return permissions.some((p) => userPermissions.value.includes(p));
  }

  function hasAllPermissions(permissions: Permission[]): boolean {
    if (userRole.value === 'ADMIN') return true;
    if (!permissions || permissions.length === 0) return true;

    return permissions.every((p) => userPermissions.value.includes(p));
  }

  function hasRole(role: Role | Role[]): boolean {
    if (Array.isArray(role)) {
      return role.includes(userRole.value);
    }
    return userRole.value === role;
  }

  return {
    userRole,
    userPermissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
  };
}
