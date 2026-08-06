import type { RouteRecordRaw } from 'vue-router';

export const courseRoutes: RouteRecordRaw[] = [
    {
        path: '/courses',
        name: 'courses-list',
        component: () => import('./views/CoursesListView.vue'),
        meta: { requiresAuth: true },
    },
];
