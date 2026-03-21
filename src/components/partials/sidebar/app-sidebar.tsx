import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Link } from '@tanstack/react-router';
import { ADMIN_SIDEBAR_NAV, USER_SIDEBAR_NAV } from '@/constants/navigation';
import { useAuth } from '@/hooks';
import { UserRole } from '@/types/auth';

export function AppSidebar() {
  const { user } = useAuth();
  const isAdmin = user?.role === UserRole.ADMIN;
  const navItems = isAdmin ? ADMIN_SIDEBAR_NAV : USER_SIDEBAR_NAV;

  return (
    <Sidebar collapsible='icon'>
      <SidebarHeader className='border-b h-(--h-header) p-4 flex items-center justify-center'>
        <h2 className='font-bold text-xl group-data-[collapsible=icon]:hidden'>E-Commerce</h2>
        <div className='hidden group-data-[collapsible=icon]:block font-bold text-xl'>E</div>
      </SidebarHeader>

      <SidebarContent className='p-2 overflow-hidden'>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild tooltip={item.title}>
                <Link to={item.to} className='flex gap-4'>
                  <item.icon className='h-5 w-5' />
                  <span className='group-data-[collapsible=icon]:hidden'>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter />
    </Sidebar>
  );
}
