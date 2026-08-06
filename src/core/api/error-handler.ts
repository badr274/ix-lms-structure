import { AxiosError } from 'axios';

export interface ApiErrorResponse {
    message: string;
    statusCode: number;
    errors?: Record<string, string[]>;
}

export function handleApiError(error: unknown): ApiErrorResponse {
    if (error && typeof error === 'object' && 'isAxiosError' in error) {
        const axiosErr = error as AxiosError<ApiErrorResponse>;
        const response = axiosErr.response;

        if (response?.data) {
            return {
                message: response.data.message || 'حدث خطأ في الاتصال بالخادم',
                statusCode: response.status,
                errors: response.data.errors,
            };
        }
    }

    return {
        message: error instanceof Error ? error.message : 'حدث خطأ غير متوقع',
        statusCode: 500,
    };
}
