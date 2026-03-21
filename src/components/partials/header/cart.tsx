import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BASE_ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks';
import { useCart } from '@/queries/cart.queries';
import { UserRole } from '@/types/auth';
import { Link } from '@tanstack/react-router';
import { ShoppingCart } from 'lucide-react';

export function Cart() {
  const { user, isAuthenticated } = useAuth();
  const isAdmin = user?.role === UserRole.ADMIN;

  // Only fetch cart count for authenticated non-admin users
  const shouldFetchCart = isAuthenticated && !isAdmin;
  const { data: cart } = useCart(shouldFetchCart);
  const cartCount = shouldFetchCart ? (cart?.items?.length ?? 0) : 0;

  if (isAdmin) return null;

  // If not authenticated, show cart icon without badge (clicking will redirect to login)
  if (!isAuthenticated) {
    return (
      <Link to='/$authView' params={{ authView: 'sign-in' }}>
        <Button
          variant='ghost'
          size='icon'
          className='rounded-full h-9 w-9 relative hover:bg-accent/80 transition-colors'
        >
          <ShoppingCart className='h-5 w-5' />
        </Button>
      </Link>
    );
  }

  return (
    <Link to={BASE_ROUTES.CART}>
      <Button
        variant='ghost'
        size='icon'
        className='rounded-full h-9 w-9 relative hover:bg-accent/80 transition-colors'
      >
        <ShoppingCart className='h-5 w-5' />
        {cartCount > 0 && (
          <Badge className='absolute top-0 right-0 h-4 w-4 flex items-center justify-center p-0 text-xs'>
            {cartCount > 99 ? '99+' : cartCount}
          </Badge>
        )}
      </Button>
    </Link>
  );
}
