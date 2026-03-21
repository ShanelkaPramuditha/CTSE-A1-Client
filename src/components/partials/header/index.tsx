import * as React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { HeaderLogo } from './logo';
import { AvatarMenu } from './avatar-menu';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';
import { useAuth } from '@/hooks';
import { UserRole } from '@/types/auth';
import { BASE_ROUTES } from '@/constants/routes';

interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  showSidebarTrigger: boolean;
  showHeaderLogo: boolean;
  showNotification: boolean;
  showAvatarMenu: boolean;
}

export function Header({ showSidebarTrigger, showHeaderLogo, showAvatarMenu }: HeaderProps) {
  return (
    <header className='sticky top-0 z-50 h-(--h-header) shrink-0 flex items-center bg-background/80 backdrop-blur-md border-b'>
      <div className='flex items-center justify-between gap-4 px-6 w-full max-w-[100vw] overflow-hidden'>
        {/* Left side */}
        <div className='flex items-center gap-4'>
          {showSidebarTrigger && <SidebarTrigger className='hidden md:flex' />}
          {showHeaderLogo && <HeaderLogo />}
        </div>

        {/* Right side */}
        <div className='flex items-center gap-3'>
          {showAvatarMenu && <CartButton />}
          {showAvatarMenu && <AvatarMenu />}
        </div>
      </div>
    </header>
  );
}

function CartButton() {
  const { user } = useAuth();
  const isAdmin = user?.role === UserRole.ADMIN;

  if (isAdmin) return null;

  return (
    <Link to={BASE_ROUTES.CART}>
      <Button
        variant='ghost'
        size='icon'
        className='rounded-full h-9 w-9 relative hover:bg-accent/80 transition-colors'
      >
        <ShoppingCart className='h-5 w-5' />
        <span className='absolute top-0.5 right-0.5 bg-primary text-primary-foreground text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center border-2 border-background'>
          2
        </span>
      </Button>
    </Link>
  );
}

Header.displayName = 'Header';
