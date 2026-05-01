import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { Loader2Icon } from 'lucide-react';
import { useAuth } from '@/hooks';

export const Route = createFileRoute('/_authenticated')({
  component: AuthenticatedLayout,
  beforeLoad: async ({ context: { auth }, location }) => {
    if (auth.isLoading) {
      return;
    }

    // Check and redirect if not authenticated
    if (!auth.isAuthenticated) {
      throw redirect({
        to: '/$authView',
        params: { authView: 'sign-in' },
        search: {
          redirect: location.href,
        },
      });
    }
  },
});

function AuthenticatedLayout() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className='flex min-h-[50vh] items-center justify-center'>
        <Loader2Icon className='h-8 w-8 animate-spin text-primary' />
      </div>
    );
  }

  return <Outlet />;
}
