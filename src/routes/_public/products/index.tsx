import { createFileRoute } from '@tanstack/react-router';
import { AllProductsPage } from '@/components/pages/product/all-product';

export const Route = createFileRoute('/_public/products/')({
  component: AllProductsPage,
});
