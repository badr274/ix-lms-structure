import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { courseRoutes } from '@features/courses/routes';
import { authRoutes } from '@features/auth/routes';
import { PERMISSIONS, ROLES } from '@core/permissions';
import { authGuard } from './guards/auth.guard';
import { branches as branchesRoutes } from "@features/branches/branch.ts";

const genericRoutes: RouteRecordRaw[] = [
  // {
  //   path: '/branches',
  //   name: 'branches',
  //   component: () => import('@shared/components/layout/GenericSectionView.vue'),
  //   meta: {
  //     requiresAuth: true,
  //     title: 'Branches',
  //     roles: [ROLES.ADMIN],
  //     permissions: [PERMISSIONS.BRANCH_MANAGE],
  //   },
  // },
  {
    path: '/roles',
    name: 'roles',
    component: () => import('@shared/components/layout/GenericSectionView.vue'),
    meta: {
      requiresAuth: true,
      title: 'Roles & Permissions',
      roles: [ROLES.ADMIN],
      permissions: [PERMISSIONS.ROLE_MANAGE],
    },
  },
  {
    path: '/users',
    name: 'users',
    component: () => import('@shared/components/layout/GenericSectionView.vue'),
    meta: {
      requiresAuth: true,
      title: 'Users',
      roles: [ROLES.ADMIN],
      permissions: [PERMISSIONS.USER_MANAGE],
    },
  },
  {
    path: '/learners',
    name: 'learners',
    component: () => import('@shared/components/layout/GenericSectionView.vue'),
    meta: {
      requiresAuth: true,
      title: 'Learners',
      roles: [ROLES.ADMIN, ROLES.INSTRUCTOR],
      permissions: [PERMISSIONS.LEARNER_MANAGE],
    },
  },
  {
    path: '/guardian',
    name: 'guardian',
    component: () => import('@shared/components/layout/GenericSectionView.vue'),
    meta: {
      requiresAuth: true,
      title: 'Guardian',
      roles: [ROLES.ADMIN],
      permissions: [PERMISSIONS.GUARDIAN_MANAGE],
    },
  },
  {
    path: '/audit-log',
    name: 'audit-log',
    component: () => import('@shared/components/layout/GenericSectionView.vue'),
    meta: {
      requiresAuth: true,
      title: 'Audit Log',
      roles: [ROLES.ADMIN],
      permissions: [PERMISSIONS.AUDIT_VIEW],
    },
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@shared/components/layout/GenericSectionView.vue'),
    meta: {
      requiresAuth: true,
      title: 'Settings',
      roles: [ROLES.ADMIN],
      permissions: [PERMISSIONS.SETTINGS_MANAGE],
    },
  },
  {
    path: '/forbidden',
    name: 'forbidden',
    component: () => import('@shared/views/ForbiddenView.vue'),
    meta: {
      requiresAuth: true,
      title: 'Access Denied',
    },
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/register',
    },
    ...authRoutes,
    ...courseRoutes,
    ...branchesRoutes,
    ...genericRoutes,
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@shared/views/NotFoundView.vue'),
      meta: {
        title: 'Page Not Found',
        requiresAuth: false,
      },
    },
  ],
});

router.beforeEach(authGuard);
