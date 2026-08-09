import type { RouteRecordRaw } from 'vue-router';
import { PERMISSIONS, ROLES } from '@core/permissions';

export const branches: RouteRecordRaw[] = [
  {
    path: '/branches',
    name: 'branches',
    component: () => import('./views/BranchList.vue'),
    meta: {
      requiresAuth: true,
      title: 'Branches',
      roles: [ROLES.ADMIN],
      permissions: [PERMISSIONS.BRANCH_MANAGE],
    },
  },
];
