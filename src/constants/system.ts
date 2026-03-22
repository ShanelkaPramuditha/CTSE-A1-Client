const defaultApiBaseUrl = 'http://localhost:3000/api/v1';
const rawApiBaseUrl = import.meta.env.PUBLIC_BASE_URL?.trim();
const normalizedApiBaseUrl = rawApiBaseUrl ? rawApiBaseUrl.replace(/\/$/, '') : '';

export const SYSTEM_INFO = {
  name: 'E-Commerce',
  version: '1.0.0',
  apiBaseUrl: normalizedApiBaseUrl || defaultApiBaseUrl,
} as const;
