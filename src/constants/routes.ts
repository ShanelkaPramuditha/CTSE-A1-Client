export const BASE_ROUTES = {
  HOME: '/',
  AUTH: '/$authView',
  PROFILE: '/profile',
  PRODUCTS: '/products',
  CART: '/cart',
  ADMIN: {
    DASHBOARD: '/admin',
    PRODUCTS: '/admin/products',
  },
} as const;

export const ROUTES = {
  DASHBOARD: BASE_ROUTES.ADMIN.DASHBOARD,
  PROFILE: BASE_ROUTES.PROFILE,
  PRODUCTS: BASE_ROUTES.PRODUCTS,
  CART: BASE_ROUTES.CART,
} as const;
