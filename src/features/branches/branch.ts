import type { RouteRecordRaw } from 'vue-router';

export const branches: RouteRecordRaw[] = [
    {
        path: '/branches',
        name: 'branches',
        component: () => import('./views/BranchList.vue'),
        meta: { requiresAuth: true },
    },
];
