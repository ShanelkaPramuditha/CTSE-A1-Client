import { SYSTEM_INFO } from '@/constants';
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: SYSTEM_INFO.apiBaseUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

const refreshClient = axios.create({
  baseURL: SYSTEM_INFO.apiBaseUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;
    const retryableRequest = originalRequest as typeof originalRequest & {
      _retry?: boolean;
    };

    const shouldAttemptRefresh =
      error.response?.status === 401 &&
      originalRequest &&
      !retryableRequest._retry &&
      !String(originalRequest.url || '').includes('/auth/login') &&
      !String(originalRequest.url || '').includes('/auth/register') &&
      !String(originalRequest.url || '').includes('/auth/refresh') &&
      !String(originalRequest.url || '').includes('/auth/logout');

    if (shouldAttemptRefresh) {
      retryableRequest._retry = true;

      try {
        await refreshClient.post('/auth/refresh');
        return apiClient.request(retryableRequest);
      } catch {
        // Fall through to the normalized error below when refresh fails.
      }
    }

    const message = error.response?.data?.message || error.message || 'An error occurred';
    const apiError = new Error(message);

    // Casting to Object to allow dynamic properties without triggering no-explicit-any
    const errorObj = apiError as unknown as Record<string, unknown>;
    errorObj.status = error.response?.status;
    errorObj.data = error.response?.data;

    return Promise.reject(apiError);
  },
);
