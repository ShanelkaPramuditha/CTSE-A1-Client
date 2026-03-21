import * as React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { HeaderLogo } from './logo';
import { AvatarMenu } from './avatar-menu';
import { Cart } from './cart';

interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  showSidebarTrigger: boolean;
  showHeaderLogo: boolean;
  showNotification: boolean;
  showCart: boolean;
  showAvatarMenu: boolean;
}

export function Header({
  showSidebarTrigger,
  showHeaderLogo,
  showCart,
  showAvatarMenu,
}: HeaderProps) {
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
          {showCart && <Cart />}
          {showAvatarMenu && <AvatarMenu />}
        </div>
      </div>
    </header>
  );
}

Header.displayName = 'Header';
