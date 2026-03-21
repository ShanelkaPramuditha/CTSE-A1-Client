import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated')({
  component: AuthenticatedLayout,
  beforeLoad: async ({ context: { auth }, location }) => {
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
  return <Outlet />;
}
