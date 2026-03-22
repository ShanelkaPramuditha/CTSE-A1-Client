import { SYSTEM_INFO } from '@/constants';
import axios from 'axios';
import { ACCESS_TOKEN_STORAGE_KEY } from '@/constants/storage';

export const apiClient = axios.create({
  baseURL: SYSTEM_INFO.apiBaseUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY) : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || 'An error occurred';
    const apiError = new Error(message);

    // Casting to Object to allow dynamic properties without triggering no-explicit-any
    const errorObj = apiError as unknown as Record<string, unknown>;
    errorObj.status = error.response?.status;
    errorObj.data = error.response?.data;

    return Promise.reject(apiError);
  },
);
