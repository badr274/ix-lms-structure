export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        ME: '/auth/me',
        LOGOUT: '/auth/logout',
    },
    COURSES: {
        BASE: '/courses',
        BY_ID: (id: string) => `/courses/${id}`,
    },
} as const;
