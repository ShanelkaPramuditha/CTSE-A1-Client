import { Link } from '@tanstack/react-router';
import { ShoppingBag } from 'lucide-react';

export function HeaderLogo() {
  return (
    <Link
      to='/'
      className='flex items-center gap-2 text-primary hover:text-primary/90 transition-all active:scale-95 cursor-pointer'
    >
      <div className='p-1.5 bg-primary rounded-lg text-primary-foreground'>
        <ShoppingBag className='h-5 w-5' />
      </div>
      <span className='hidden font-bold text-xl sm:inline-block tracking-tight text-foreground'>
        E-Commerce
      </span>
    </Link>
  );
}
