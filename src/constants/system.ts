/** Full backend API base, including `/api/v1` path (see `.env.example`). */
const DEFAULT_API_BASE_URL = 'http://localhost:3000/api/v1';

export const SYSTEM_INFO = {
  name: 'E-Commerce',
  version: '1.0.0',
  apiBaseUrl: (import.meta.env.PUBLIC_API_BASE_URL ||
    import.meta.env.PUBLIC_BASE_URL ||
    DEFAULT_API_BASE_URL) as string,
} as const;
