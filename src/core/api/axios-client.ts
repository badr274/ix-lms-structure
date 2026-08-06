import axios from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { handleApiError } from './error-handler';

export const apiClient: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api.example.com/v1',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 15000,
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('auth_token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const formattedError = handleApiError(error);
        if (formattedError.statusCode === 401) {
            localStorage.removeItem('auth_token');
        }
        return Promise.reject(formattedError);
    }
);
