import { createFileRoute } from '@tanstack/react-router';
import { AdminInventoryPage } from '@/components/pages/admin/admin-inventory';

export const Route = createFileRoute('/_authenticated/_admin/admin/products')({
  component: AdminInventoryPage,
});
