import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { useAuthStore } from '@stores/auth.store';
import { ROLE_PERMISSIONS, type Permission, type Role } from '@core/permissions';

export function authGuard(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const authStore = useAuthStore();

  const requiresAuth = to.matched.some((record) => record.meta?.requiresAuth !== false);
  const isGuestOnly = to.matched.some((record) => record.name === 'login' || record.name === 'register');

  // 1. Guest-only route redirect for authenticated users
  if (isGuestOnly && authStore.isAuthenticated) {
    return next({ name: 'dashboard' });
  }

  // 2. Protected route authentication check
  if (requiresAuth && !authStore.isAuthenticated) {
    if (to.name === 'login' || to.name === 'register') return next();
    return next({
      name: 'login',
      query: to.fullPath && to.fullPath !== '/' ? { redirect: to.fullPath } : {},
    });
  }

  // 3. Strict Route-Level RBAC Authorization Check
  if (requiresAuth && authStore.isAuthenticated) {
    const userRole = (authStore.user?.role as Role) || 'STUDENT';
    const userPermissions = ROLE_PERMISSIONS[userRole] || [];

    // Collect all required roles from matched records
    const requiredRoles = to.matched
      .map((r) => r.meta?.roles as Role[] | undefined)
      .filter((roles): roles is Role[] => Boolean(roles && roles.length > 0))
      .flat();

    // Check Role Authorization
    if (requiredRoles.length > 0 && !requiredRoles.includes(userRole)) {
      // User is authenticated, but their role is NOT authorized for this specific URL
      return next({
        name: 'forbidden',
        query: { from: to.fullPath },
      });
    }

    // Collect all required permissions from matched records
    const requiredPermissions = to.matched
      .map((r) => r.meta?.permissions as Permission[] | undefined)
      .filter((perms): perms is Permission[] => Boolean(perms && perms.length > 0))
      .flat();

    // Check Permission Authorization
    if (requiredPermissions.length > 0) {
      const hasAnyPermission = requiredPermissions.some((p) => userPermissions.includes(p));
      if (!hasAnyPermission) {
        return next({
          name: 'forbidden',
          query: { from: to.fullPath },
        });
      }
    }
  }

  next();
}
