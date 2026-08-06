import { QueryClient } from '@tanstack/vue-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 دقائق
            gcTime: 1000 * 60 * 15,
            refetchOnWindowFocus: false,
        },
    },
});
