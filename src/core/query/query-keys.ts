export const queryKeys = {
    auth: {
        me: () => ['auth', 'me'] as const,
    },
    courses: {
        all: ['courses'] as const,
        list: (filters?: Record<string, any>) => [...queryKeys.courses.all, 'list', filters] as const,
        detail: (id: string) => [...queryKeys.courses.all, 'detail', id] as const,
    },
} as const;
