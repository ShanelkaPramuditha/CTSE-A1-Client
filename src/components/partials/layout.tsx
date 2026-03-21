import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/partials/sidebar/app-sidebar';
import { Header } from '@/components/partials/header';
import { useAuth } from '@/hooks';
import { UserRole } from '@/types/auth';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth();

  const isAdmin = isAuthenticated && user?.role === UserRole.ADMIN;

  const showSidebar = isAdmin;

  // Header configs
  const showHeaderLogo = !isAdmin;
  const showNotification = isAuthenticated;
  const showAvatarMenu = true;

  return (
    <SidebarProvider>
      <div className='flex h-screen w-full overflow-hidden'>
        {showSidebar && <AppSidebar />}

        <div className='flex flex-1 flex-col'>
          <Header
            showSidebarTrigger={showSidebar}
            showAvatarMenu={showAvatarMenu}
            showHeaderLogo={showHeaderLogo}
            showNotification={showNotification}
          />

          <main className='flex-1 overflow-auto p-4 min-h-[calc(100vh-var(--h-header))]'>
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
