import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { useAuthStore } from '@stores/auth.store';

export function authGuard(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const authStore = useAuthStore();

  // Protected route check
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    if (to.name === 'login') return next();
    return next({
      name: 'login',
      query: to.fullPath && to.fullPath !== '/' ? { redirect: to.fullPath } : {},
    });
  }

  // Guest-only route check (login & register)
  if ((to.name === 'login' || to.name === 'register') && authStore.isAuthenticated) {
    return next({ name: 'dashboard' });
  }

  next();
}
