import { createFileRoute, Link, redirect } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { ShoppingBag, ShieldCheck, User as UserIcon } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { useAuth } from '@/hooks';
import { UserRole } from '@/types/auth';

export const Route = createFileRoute('/')({
  beforeLoad: ({ context }) => {
    const { isAuthenticated, user } = context.auth;
    if (isAuthenticated) {
      if (user?.role === UserRole.ADMIN) {
        throw redirect({ to: '/admin' });
      }
      throw redirect({ to: '/products' });
    }
  },
  component: HomeComponent,
});

function HomeComponent() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className='fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur'>
        <Spinner className='h-10 w-10 text-primary' />
      </div>
    );
  }

  return (
    <div className='min-h-screen w-full bg-background'>
      {/* Navbar */}
      <nav className='flex items-center justify-between px-6 py-5 max-w-7xl mx-auto'>
        <h1 className='text-2xl font-bold text-foreground'>E-Commerce Gateway</h1>
      </nav>

      {/* Hero Section */}
      <section className='max-w-7xl mx-auto px-6 py-20 text-center space-y-6'>
        <div className='inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm text-primary bg-primary/10'>
          <ShoppingBag className='h-4 w-4' />
          Welcome to the Future of Shopping
        </div>

        <h2 className='text-5xl md:text-6xl font-bold text-foreground leading-tight'>
          Your One-Stop Gateway
          <br />
          <span className='text-primary'>Powered by Microservices</span>
        </h2>

        <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
          Secure, fast, and scalable e-commerce infrastructure for modern businesses.
        </p>

        <div className='flex flex-wrap justify-center gap-4 pt-6'>
          <Link to='/$authView' params={{ authView: 'sign-in' }}>
            <Button size='lg' className='px-8 shadow-lg shadow-primary/20 hover:shadow-primary/40'>
              Get Started
            </Button>
          </Link>

          <Link to='/products'>
            <Button size='lg' variant='outline' className='px-8'>
              Browse as Guest
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className='max-w-7xl mx-auto px-6 pb-24'>
        <div className='grid gap-8 md:grid-cols-3'>
          <FeatureCard
            icon={<ShieldCheck className='h-6 w-6' />}
            title='Admin Dashboard'
            description='Powerful management tools for products, orders, and users.'
          />

          <FeatureCard
            icon={<ShoppingBag className='h-6 w-6' />}
            title='Fast Checkout'
            description='Optimized payment workflows for seamless customer experience.'
          />

          <FeatureCard
            icon={<UserIcon className='h-6 w-6' />}
            title='Real-time Sync'
            description='Inventory and order state synchronized across all microservices.'
          />
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className='rounded-2xl border bg-card p-8 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 hover:border-primary/50'>
      <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary'>
        {icon}
      </div>
      <h3 className='mb-2 text-xl font-semibold text-foreground'>{title}</h3>
      <p className='text-muted-foreground'>{description}</p>
    </div>
  );
}
