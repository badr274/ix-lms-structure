import { createRouter, createWebHistory } from 'vue-router';
import { courseRoutes } from '@features/courses/routes';
import { authRoutes } from '@features/auth/routes';
import { authGuard } from './guards/auth.guard';
import {branches} from "@features/branches/branch.ts";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/register',
    },
    ...authRoutes,
    ...courseRoutes,
    ...branches,
    {
      path: '/:pathMatch(.*)*',
      redirect: '/register',
    },
  ],
});

router.beforeEach(authGuard);
