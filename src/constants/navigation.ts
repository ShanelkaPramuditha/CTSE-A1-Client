import { User, Package, LayoutDashboard } from 'lucide-react';
import { BASE_ROUTES } from './routes';

export const ADMIN_SIDEBAR_NAV = [
  {
    title: 'Dashboard',
    to: BASE_ROUTES.ADMIN.DASHBOARD,
    icon: LayoutDashboard,
  },
  {
    title: 'Inventory',
    to: BASE_ROUTES.ADMIN.PRODUCTS,
    icon: Package,
  },
  {
    title: 'Profile',
    to: BASE_ROUTES.PROFILE,
    icon: User,
  },
] as const;

export const USER_SIDEBAR_NAV = [
  {
    title: 'Profile',
    to: BASE_ROUTES.PROFILE,
    icon: User,
  },
] as const;

export const SIDEBAR_NAV = ADMIN_SIDEBAR_NAV;
