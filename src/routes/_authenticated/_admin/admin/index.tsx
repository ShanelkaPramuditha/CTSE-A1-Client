import { createFileRoute, Link } from '@tanstack/react-router';
import { Package, ShoppingCart, Users, CreditCard, LayoutDashboard, Plus } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/_authenticated/_admin/admin/')({
  component: AdminDashboard,
});

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  change: string;
  color: 'blue' | 'orange' | 'green' | 'purple';
}

function AdminDashboard() {
  return (
    <div className='p-6 space-y-10 bg-background/50 min-h-screen'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='p-2 bg-primary/10 rounded-xl text-primary'>
            <LayoutDashboard className='h-8 w-8' />
          </div>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>Control Center</h1>
            <p className='text-muted-foreground'>Centralized management for your microservices.</p>
          </div>
        </div>
        <Button variant='default' size='lg' className='shadow-lg'>
          <Plus className='h-5 w-5 mr-2' />
          Add New Resource
        </Button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <StatCard
          icon={<Package className='h-5 w-5' />}
          title='Inventory Items'
          value='1,245'
          change='+12% this week'
          color='blue'
        />
        <StatCard
          icon={<ShoppingCart className='h-5 w-5' />}
          title='Total Orders'
          value='842'
          change='+5% growth'
          color='orange'
        />
        <StatCard
          icon={<Users className='h-5 w-5' />}
          title='User Base'
          value='3,120'
          change='+22 subscribers today'
          color='green'
        />
        <StatCard
          icon={<CreditCard className='h-5 w-5' />}
          title='Revenue (USD)'
          value='$45,210'
          change='+18.4% monthly'
          color='purple'
        />
      </div>

      <div className='grid gap-6 md:grid-cols-2'>
        <Card className='border-none shadow-sm shadow-black/5 bg-card/60 backdrop-blur'>
          <CardHeader>
            <CardTitle>Management Tools</CardTitle>
            <CardDescription>Direct access to core system operations.</CardDescription>
          </CardHeader>
          <CardContent className='grid gap-4'>
            <Link to='/admin/products'>
              <Button variant='outline' className='w-full justify-start h-12 text-md' size='lg'>
                <Package className='h-5 w-5 mr-4 text-blue-500' />
                Manage Product Inventory
              </Button>
            </Link>
            <Button variant='outline' className='w-full justify-start h-12 text-md' size='lg'>
              <ShoppingCart className='h-5 w-5 mr-4 text-orange-500' />
              Monitor Fulfillment Center
            </Button>
            <Button variant='outline' className='w-full justify-start h-12 text-md' size='lg'>
              <Users className='h-5 w-5 mr-4 text-green-500' />
              Identity & Access Management
            </Button>
          </CardContent>
        </Card>

        <Card className='border-none shadow-sm shadow-black/5 bg-card/60 backdrop-blur'>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Last 72 hours across regions.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4 text-sm'>
              <div className='flex items-center justify-between border-b pb-4'>
                <div className='flex gap-4'>
                  <span className='p-2 bg-blue-500/10 text-blue-600 rounded-full h-fit'>
                    <Package className='h-4 w-4' />
                  </span>
                  <div>
                    <p className='font-medium'>New Inventory: AirPods Max</p>
                    <p className='text-xs text-muted-foreground'>Stock arrived from Tokyo hub.</p>
                  </div>
                </div>
                <span className='text-muted-foreground italic font-mono'>10m</span>
              </div>
              <div className='flex items-center justify-between border-b pb-4'>
                <div className='flex gap-4'>
                  <span className='p-2 bg-green-500/10 text-green-600 rounded-full h-fit'>
                    <CreditCard className='h-4 w-4' />
                  </span>
                  <div>
                    <p className='font-medium'>Revenue Goal Reached: Q1 Hub</p>
                    <p className='text-xs text-muted-foreground'>
                      Microservice billing auto-synced.
                    </p>
                  </div>
                </div>
                <span className='text-muted-foreground italic font-mono'>2h</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, change, color }: StatCardProps) {
  const colorMap: Record<string, string> = {
    blue: 'text-blue-500 bg-blue-500/10',
    orange: 'text-orange-500 bg-orange-500/10',
    green: 'text-green-500 bg-green-500/10',
    purple: 'text-purple-500 bg-purple-500/10',
  };
  return (
    <Card className='border-none shadow-sm shadow-black/5'>
      <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
        <CardTitle className='text-sm font-medium'>{title}</CardTitle>
        <div className={`p-2 rounded-lg ${colorMap[color]}`}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className='text-3xl font-bold'>{value}</div>
        <p className='text-xs text-muted-foreground pt-1'>{change}</p>
      </CardContent>
    </Card>
  );
}
