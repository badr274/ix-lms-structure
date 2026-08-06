import { createRouter, createWebHistory } from 'vue-router';
import { courseRoutes } from '@features/courses/routes';
import { authRoutes } from '@features/auth/routes';
import { authGuard } from './guards/auth.guard';

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/register',
    },
    ...authRoutes,
    ...courseRoutes,
    {
      path: '/:pathMatch(.*)*',
      redirect: '/register',
    },
  ],
});

router.beforeEach(authGuard);
