import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks';
import { useNavigate } from '@tanstack/react-router';
import { BASE_ROUTES } from '@/constants/routes';
import { IconUser } from '@tabler/icons-react';
import { toast } from 'sonner';

// User Menu Component
export function AvatarMenu() {
  const navigate = useNavigate();

  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    await toast.promise(logout(), {
      loading: 'Logging out...',
      success: () => {
        navigate({
          to: '/$authView',
          params: { authView: 'sign-in' },
          replace: true,
        });
        return 'Logged out successfully';
      },
      error: (error) => error?.message || 'Logout failed',
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className='cursor-pointer rounded-full' style={{ width: '36px', height: '36px' }}>
          {/* Avatar Image */}
          <AvatarImage src={user?.avatar || undefined} alt='user' />
          <AvatarFallback>
            <IconUser className='h-4 w-4' />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align='end' className='w-56'>
        {isAuthenticated ? (
          <>
            <DropdownMenuLabel>
              <div className='flex flex-col space-y-1'>
                <p className='text-sm font-medium leading-none'>{user?.name}</p>
                <p className='text-xs leading-none text-muted-foreground'>{user?.email}</p>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => navigate({ to: BASE_ROUTES.PROFILE })}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate({ to: BASE_ROUTES.ORDERS })}>
              Orders
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem
              onClick={() =>
                navigate({ to: '/$authView', params: { authView: 'sign-in' }, replace: true })
              }
            >
              Sign In
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                navigate({ to: '/$authView', params: { authView: 'sign-up' }, replace: true })
              }
            >
              Sign Up
            </DropdownMenuItem>
          </>
        )}

        {isAuthenticated && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={handleLogout}>Log out</DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
