import { createFileRoute } from '@tanstack/react-router';
import { Spinner } from '@/components/ui/spinner';
import { useAuth } from '@/hooks';
import { UserRole } from '@/types/auth';
import { AllProductsPage } from '@/components/pages/product/all-product';
import { AdminDashboard } from '@/components/pages/dashboards/admin';

export const Route = createFileRoute('/')({
  component: HomeComponent,
});

function HomeComponent() {
  const { isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className='fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur'>
        <Spinner className='h-10 w-10 text-primary' />
      </div>
    );
  }

  if (user?.role === UserRole.ADMIN) {
    return <AdminDashboard />;
  }

  return <AllProductsPage />;
}
