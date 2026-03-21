import { Outlet, Scripts, createRootRouteWithContext } from '@tanstack/react-router';
import type { RouterContext } from '@/types/router-context';

import { Toaster } from 'sonner';
import { SYSTEM_INFO } from '@/constants';
import Layout from '@/components/partials/layout';

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: SYSTEM_INFO.name,
      },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <Layout>
      <Outlet />
      <Toaster position='top-center' />
      <Scripts />
    </Layout>
  );
}
