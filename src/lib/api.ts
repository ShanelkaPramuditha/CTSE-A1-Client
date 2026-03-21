import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
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
