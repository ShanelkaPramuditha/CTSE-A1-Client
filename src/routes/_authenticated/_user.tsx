import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/_user')({
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}
