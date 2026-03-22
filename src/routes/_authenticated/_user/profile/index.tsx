import { useEffect, useState } from 'react';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { useAuth } from '@/hooks';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  BadgeCheckIcon,
  UserIcon,
  ShieldCheckIcon,
  CameraIcon,
  Loader2Icon,
  Settings2Icon,
  BarChart3Icon,
  LogOutIcon,
  Clock3Icon,
  MonitorIcon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  updateProfileSchema,
  changePasswordSchema,
  type UpdateProfileSchema,
  type ChangePasswordSchema,
} from '@/schemas/auth/auth.schema';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import type { DashboardRange, User } from '@/types/auth';
import { useDashboardStats } from '@/queries/auth.queries';

const dashboardRangeOptions: Array<{ label: string; value: DashboardRange }> = [
  { label: 'Last Week', value: '7d' },
  { label: 'Last Month', value: '30d' },
  { label: 'Last 3 Months', value: '90d' },
  { label: 'Last Year', value: '365d' },
  { label: 'All Time', value: 'all' },
];

const profileTabOptions = ['overview', 'edit', 'security', 'stats'] as const;
type ProfileTab = (typeof profileTabOptions)[number];

function isProfileTab(tab: unknown): tab is ProfileTab {
  return typeof tab === 'string' && profileTabOptions.includes(tab as ProfileTab);
}

export const Route = createFileRoute('/_authenticated/_user/profile/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { user, updateProfile, changePassword, logout } = useAuth();
  const router = useRouter();
  const [selectedRange, setSelectedRange] = useState<DashboardRange>('30d');
  const { data: dashboardStats, isLoading: isDashboardLoading } = useDashboardStats(selectedRange);
  const [sessionStartedAt] = useState<string | null>(() => {
    if (typeof window === 'undefined') {
      return null;
    }

    return window.localStorage.getItem('auth.session.startedAt');
  });
  const getTabFromUrl = (): ProfileTab => {
    if (typeof window === 'undefined') {
      return 'overview';
    }

    const tab = new URLSearchParams(window.location.search).get('tab');
    return isProfileTab(tab) ? tab : 'overview';
  };

  const [activeTab, setActiveTab] = useState<ProfileTab>(getTabFromUrl);

  useEffect(() => {
    const handlePopState = () => {
      setActiveTab(getTabFromUrl());
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const handleTabChange = (nextTab: string) => {
    if (!isProfileTab(nextTab)) {
      return;
    }

    setActiveTab(nextTab);

    const url = new URL(window.location.href);
    if (nextTab === 'overview') {
      url.searchParams.delete('tab');
    } else {
      url.searchParams.set('tab', nextTab);
    }

    window.history.replaceState(window.history.state, '', url);
  };

  const handleLogoutSession = async () => {
    try {
      await logout();
      toast.success('Session ended successfully');
      router.navigate({ to: '/$authView', params: { authView: 'sign-in' } });
    } catch {
      toast.error('Failed to end session');
    }
  };

  if (!user) {
    return (
      <div className='flex flex-col items-center justify-center py-16'>
        <Loader2Icon className='h-8 w-8 animate-spin text-primary' />
        <p className='mt-4 text-sm text-muted-foreground'>Loading user data...</p>
      </div>
    );
  }

  const initials =
    (user.name || user.email || 'U')
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .join('')
      .toUpperCase() || 'U';

  return (
    <div className='container mx-auto max-w-5xl py-10 px-4 md:px-0'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className='relative mb-10'>
          <div className='h-32 w-full rounded-xl bg-linear-to-r from-primary/20 via-primary/40 to-primary/20 backdrop-blur-md border border-primary/10' />

          <div className='relative z-10 flex flex-col md:flex-row items-center md:items-end gap-6 px-8'>
            <div className='relative group -mt-12'>
              <Avatar className='h-32 w-32 rounded-2xl border-4 border-background shadow-xl'>
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className='text-3xl font-bold bg-primary/10 text-primary'>
                  {initials}
                </AvatarFallback>
              </Avatar>
              <button className='absolute bottom-2 right-2 p-2 bg-primary text-primary-foreground rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity'>
                <CameraIcon className='h-4 w-4' />
              </button>
            </div>

            <div className='flex-1 pb-2 text-center md:text-left'>
              <div className='flex items-center justify-center md:justify-start gap-2'>
                <h1 className='text-3xl font-bold tracking-tight'>{user.name || 'Unnamed user'}</h1>
                <BadgeCheckIcon className='h-6 w-6 text-primary fill-primary/10' />
              </div>
              <p className='text-muted-foreground font-medium'>{user.email}</p>
              <div className='mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 shadow-sm'>
                {user.role.toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} className='w-full' onValueChange={handleTabChange}>
          <div className='flex flex-col md:flex-row gap-8'>
            <div className='w-full md:w-64'>
              <TabsList className='flex md:flex-col h-auto w-full bg-transparent gap-2 p-0 justify-start'>
                <TabsTrigger
                  value='overview'
                  className='flex items-center justify-start gap-3 px-4 py-3 w-full data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-xl transition-all'
                >
                  <UserIcon className='h-4 w-4' />
                  <span className='font-semibold'>Account Overview</span>
                </TabsTrigger>
                <TabsTrigger
                  value='edit'
                  className='flex items-center justify-start gap-3 px-4 py-3 w-full data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-xl transition-all'
                >
                  <Settings2Icon className='h-4 w-4' />
                  <span className='font-semibold'>Edit Profile</span>
                </TabsTrigger>
                <TabsTrigger
                  value='security'
                  className='flex items-center justify-start gap-3 px-4 py-3 w-full data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-xl transition-all'
                >
                  <ShieldCheckIcon className='h-4 w-4' />
                  <span className='font-semibold'>Security</span>
                </TabsTrigger>
                <TabsTrigger
                  value='stats'
                  className='flex items-center justify-start gap-3 px-4 py-3 w-full data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-xl transition-all'
                >
                  <BarChart3Icon className='h-4 w-4' />
                  <span className='font-semibold'>User Stats</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <div className='flex-1'>
              <AnimatePresence mode='wait'>
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <TabsContent value='overview' className='mt-0'>
                    <div className='space-y-6'>
                      <Card className='border-none shadow-lg bg-card/50 backdrop-blur-sm'>
                        <CardHeader>
                          <CardTitle>Overview</CardTitle>
                          <CardDescription>View your account status and details.</CardDescription>
                        </CardHeader>
                        <CardContent className='space-y-6'>
                          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div className='p-4 rounded-xl border bg-background/50 space-y-1'>
                              <p className='text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                                Full Name
                              </p>
                              <p className='font-semibold'>{user.name}</p>
                            </div>
                            <div className='p-4 rounded-xl border bg-background/50 space-y-1'>
                              <p className='text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                                Email Address
                              </p>
                              <p className='font-semibold'>{user.email}</p>
                            </div>
                            <div className='p-4 rounded-xl border bg-background/50 space-y-1'>
                              <p className='text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                                Role
                              </p>
                              <p className='font-semibold capitalize'>{user.role}</p>
                            </div>
                            <div className='p-4 rounded-xl border bg-background/50 space-y-1'>
                              <p className='text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                                Organization Status
                              </p>
                              <p className='font-semibold flex items-center gap-1.5'>
                                Verified Account
                                <BadgeCheckIcon className='h-4 w-4 text-primary' />
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value='edit' className='mt-0'>
                    <EditProfileForm user={user} updateProfile={updateProfile} />
                  </TabsContent>

                  <TabsContent value='security' className='mt-0'>
                    <div className='space-y-6'>
                      <SessionManagementCard
                        sessionStartedAt={sessionStartedAt}
                        onLogout={handleLogoutSession}
                      />
                      <ChangePasswordForm changePassword={changePassword} />
                    </div>
                  </TabsContent>

                  <TabsContent value='stats' className='mt-0'>
                    <Card className='border-none shadow-lg bg-card/50 backdrop-blur-sm'>
                      <CardHeader>
                        <div className='flex flex-col gap-4 md:flex-row md:items-start md:justify-between'>
                          <div>
                            <CardTitle className='flex items-center gap-2'>
                              <BarChart3Icon className='h-5 w-5 text-primary' />
                              User Stats Dashboard
                            </CardTitle>
                            <CardDescription>
                              Live stats integrated from order and payment services.
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className='space-y-5'>
                        {isDashboardLoading ? (
                          <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                            <Loader2Icon className='h-4 w-4 animate-spin' />
                            Loading dashboard stats...
                          </div>
                        ) : dashboardStats ? (
                          <>
                            <div className='flex flex-wrap gap-2'>
                              {dashboardRangeOptions.map((option) => (
                                <Button
                                  key={option.value}
                                  type='button'
                                  size='sm'
                                  variant={selectedRange === option.value ? 'default' : 'outline'}
                                  onClick={() => setSelectedRange(option.value)}
                                >
                                  {option.label}
                                </Button>
                              ))}
                            </div>
                            <div className='flex flex-wrap items-center gap-2 text-xs'>
                              <span className='rounded-full border px-3 py-1'>
                                Order Service:{' '}
                                {dashboardStats.integration.orderServiceConnected
                                  ? 'Connected'
                                  : 'Unavailable'}
                              </span>
                              <span className='rounded-full border px-3 py-1'>
                                Payment Service:{' '}
                                {dashboardStats.integration.paymentServiceConnected
                                  ? 'Connected'
                                  : 'Unavailable'}
                              </span>
                            </div>

                            <div className='grid grid-cols-2 lg:grid-cols-4 gap-3'>
                              <div className='rounded-xl border bg-background/50 p-3'>
                                <p className='text-xs text-muted-foreground'>Total Orders</p>
                                <p className='text-lg font-semibold'>
                                  {dashboardStats.metrics.totalOrders}
                                </p>
                              </div>
                              <div className='rounded-xl border bg-background/50 p-3'>
                                <p className='text-xs text-muted-foreground'>Total Spent</p>
                                <p className='text-lg font-semibold'>
                                  ${dashboardStats.metrics.totalSpent.toFixed(2)}
                                </p>
                              </div>
                              <div className='rounded-xl border bg-background/50 p-3'>
                                <p className='text-xs text-muted-foreground'>Paid Orders</p>
                                <p className='text-lg font-semibold'>
                                  {dashboardStats.metrics.paidOrders}
                                </p>
                              </div>
                              <div className='rounded-xl border bg-background/50 p-3'>
                                <p className='text-xs text-muted-foreground'>Pending Orders</p>
                                <p className='text-lg font-semibold'>
                                  {dashboardStats.metrics.pendingOrders}
                                </p>
                              </div>
                            </div>

                            <div className='grid grid-cols-2 lg:grid-cols-4 gap-3'>
                              <div className='rounded-xl border bg-background/50 p-3'>
                                <p className='text-xs text-muted-foreground'>Weekly Avg Order</p>
                                <p className='text-lg font-semibold'>
                                  ${dashboardStats.metrics.weeklyAverageOrderValue.toFixed(2)}
                                </p>
                                <p className='text-xs text-muted-foreground mt-1'>
                                  {dashboardStats.metrics.weeklyOrderCount} orders in 7 days
                                </p>
                              </div>
                              <div className='rounded-xl border bg-background/50 p-3'>
                                <p className='text-xs text-muted-foreground'>Monthly Avg Order</p>
                                <p className='text-lg font-semibold'>
                                  ${dashboardStats.metrics.monthlyAverageOrderValue.toFixed(2)}
                                </p>
                                <p className='text-xs text-muted-foreground mt-1'>
                                  {dashboardStats.metrics.monthlyOrderCount} orders in 30 days
                                </p>
                              </div>
                              <div className='rounded-xl border bg-background/50 p-3'>
                                <p className='text-xs text-muted-foreground'>Delivered Orders</p>
                                <p className='text-lg font-semibold'>
                                  {dashboardStats.metrics.deliveredOrders}
                                </p>
                              </div>
                              <div className='rounded-xl border bg-background/50 p-3'>
                                <p className='text-xs text-muted-foreground'>Items Purchased</p>
                                <p className='text-lg font-semibold'>
                                  {dashboardStats.metrics.totalItemsOrdered}
                                </p>
                              </div>
                            </div>

                            <div className='grid grid-cols-2 lg:grid-cols-4 gap-3'>
                              <div className='rounded-xl border bg-background/50 p-3'>
                                <p className='text-xs text-muted-foreground'>Confirmed</p>
                                <p className='text-lg font-semibold'>
                                  {dashboardStats.metrics.confirmedOrders}
                                </p>
                              </div>
                              <div className='rounded-xl border bg-background/50 p-3'>
                                <p className='text-xs text-muted-foreground'>Failed Orders</p>
                                <p className='text-lg font-semibold'>
                                  {dashboardStats.metrics.failedOrders}
                                </p>
                              </div>
                              <div className='rounded-xl border bg-background/50 p-3'>
                                <p className='text-xs text-muted-foreground'>Cancelled</p>
                                <p className='text-lg font-semibold'>
                                  {dashboardStats.metrics.cancelledOrders}
                                </p>
                              </div>
                              <div className='rounded-xl border bg-background/50 p-3'>
                                <p className='text-xs text-muted-foreground'>
                                  Payment Success Rate
                                </p>
                                <p className='text-lg font-semibold'>
                                  {dashboardStats.metrics.paymentSuccessRate.toFixed(1)}%
                                </p>
                              </div>
                            </div>

                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                              <div className='rounded-xl border bg-background/50 p-4 space-y-3'>
                                <h3 className='text-sm font-semibold'>Payment Amount Summary</h3>
                                <div className='space-y-2 text-sm'>
                                  <div className='flex items-center justify-between'>
                                    <span className='text-muted-foreground'>Successful Amount</span>
                                    <span className='font-semibold'>
                                      ${dashboardStats.metrics.successfulPaymentAmount.toFixed(2)}
                                    </span>
                                  </div>
                                  <div className='flex items-center justify-between'>
                                    <span className='text-muted-foreground'>Failed Amount</span>
                                    <span className='font-semibold'>
                                      ${dashboardStats.metrics.failedPaymentAmount.toFixed(2)}
                                    </span>
                                  </div>
                                  <div className='flex items-center justify-between'>
                                    <span className='text-muted-foreground'>Success Count</span>
                                    <span className='font-semibold'>
                                      {dashboardStats.metrics.successfulPayments}
                                    </span>
                                  </div>
                                  <div className='flex items-center justify-between'>
                                    <span className='text-muted-foreground'>Failure Count</span>
                                    <span className='font-semibold'>
                                      {dashboardStats.metrics.failedPayments}
                                    </span>
                                  </div>
                                  <div className='flex items-center justify-between'>
                                    <span className='text-muted-foreground'>Avg Order Value</span>
                                    <span className='font-semibold'>
                                      ${dashboardStats.metrics.averageOrderValue.toFixed(2)}
                                    </span>
                                  </div>
                                  <div className='flex items-center justify-between'>
                                    <span className='text-muted-foreground'>Last Order</span>
                                    <span className='font-semibold'>
                                      {dashboardStats.metrics.lastOrderDate
                                        ? new Date(
                                            dashboardStats.metrics.lastOrderDate,
                                          ).toLocaleDateString()
                                        : 'N/A'}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className='rounded-xl border bg-background/50 p-4 space-y-3'>
                                <h3 className='text-sm font-semibold'>Mostly Bought Products</h3>
                                {dashboardStats.topProducts.length === 0 ? (
                                  <p className='text-sm text-muted-foreground'>
                                    No product stats yet.
                                  </p>
                                ) : (
                                  <div className='space-y-2'>
                                    {dashboardStats.topProducts.map((product) => (
                                      <div
                                        key={product.productId}
                                        className='flex items-center justify-between text-sm'
                                      >
                                        <span
                                          className='truncate max-w-30'
                                          title={product.productName}
                                        >
                                          {product.productName}
                                        </span>
                                        <span>{product.quantity} units</span>
                                        <span>${product.totalAmount.toFixed(2)}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </>
                        ) : (
                          <p className='text-sm text-muted-foreground'>
                            Dashboard stats are currently unavailable.
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </Tabs>
      </motion.div>
    </div>
  );
}

interface EditProfileFormProps {
  user: User;
  updateProfile: (data: Partial<User>) => Promise<User>;
}

function EditProfileForm({ user, updateProfile }: EditProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<UpdateProfileSchema>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      avatar: user.avatar || '',
    },
  });

  async function onSubmit(data: UpdateProfileSchema) {
    setIsSubmitting(true);
    try {
      await updateProfile(data);
      toast.success('Profile updated successfully');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className='border-none shadow-lg bg-card/50 backdrop-blur-sm'>
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
        <CardDescription>Update your personal information and profile picture.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter your name' {...field} className='bg-background/50' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter your email' {...field} className='bg-background/50' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='avatar'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='https://example.com/avatar.jpg'
                      {...field}
                      className='bg-background/50'
                    />
                  </FormControl>
                  <FormDescription>Link to your profile picture.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit' className='w-full md:w-auto mt-2' disabled={isSubmitting}>
              {isSubmitting && <Loader2Icon className='mr-2 h-4 w-4 animate-spin' />}
              Save Changes
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

interface ChangePasswordFormProps {
  changePassword: (data: Record<string, string>) => Promise<void>;
}

function ChangePasswordForm({ changePassword }: ChangePasswordFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ChangePasswordSchema>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(data: ChangePasswordSchema) {
    setIsSubmitting(true);
    try {
      await changePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });
      toast.success('Password changed successfully');
      form.reset();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to change password';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className='border-none shadow-lg bg-card/50 backdrop-blur-sm'>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>
          Ensure your account is using a long, random password to stay secure.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='oldPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <Input
                      type='password'
                      placeholder='••••••••'
                      {...field}
                      className='bg-background/50'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='newPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      type='password'
                      placeholder='••••••••'
                      {...field}
                      className='bg-background/50'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='confirmPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <Input
                      type='password'
                      placeholder='••••••••'
                      {...field}
                      className='bg-background/50'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit' className='w-full md:w-auto mt-2' disabled={isSubmitting}>
              {isSubmitting && <Loader2Icon className='mr-2 h-4 w-4 animate-spin' />}
              Update Password
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

interface SessionManagementCardProps {
  sessionStartedAt: string | null;
  onLogout: () => Promise<void>;
}

function SessionManagementCard({ sessionStartedAt, onLogout }: SessionManagementCardProps) {
  const [isEndingSession, setIsEndingSession] = useState(false);

  const startedLabel = sessionStartedAt
    ? new Date(sessionStartedAt).toLocaleString()
    : 'This device session started when you last signed in.';

  async function handleLogout() {
    setIsEndingSession(true);
    try {
      await onLogout();
    } finally {
      setIsEndingSession(false);
    }
  }

  return (
    <Card className='border-none shadow-lg bg-card/50 backdrop-blur-sm'>
      <CardHeader>
        <CardTitle>Session Management</CardTitle>
        <CardDescription>Review the current device session and end it when needed.</CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='grid gap-3 md:grid-cols-3'>
          <div className='rounded-xl border bg-background/50 p-4 space-y-1'>
            <div className='flex items-center gap-2 text-sm font-medium'>
              <MonitorIcon className='h-4 w-4 text-primary' />
              Current Device
            </div>
            <p className='text-sm text-muted-foreground'>Active session on this browser.</p>
          </div>
          <div className='rounded-xl border bg-background/50 p-4 space-y-1'>
            <div className='flex items-center gap-2 text-sm font-medium'>
              <Clock3Icon className='h-4 w-4 text-primary' />
              Session Started
            </div>
            <p className='text-sm text-muted-foreground'>{startedLabel}</p>
          </div>
          <div className='rounded-xl border bg-background/50 p-4 space-y-1'>
            <div className='flex items-center gap-2 text-sm font-medium'>
              <ShieldCheckIcon className='h-4 w-4 text-primary' />
              Session Status
            </div>
            <p className='text-sm text-muted-foreground'>Authenticated and auto-refreshed.</p>
          </div>
        </div>

        <div className='flex flex-col gap-3 rounded-xl border bg-background/50 p-4 md:flex-row md:items-center md:justify-between'>
          <div>
            <p className='font-medium'>End this session</p>
            <p className='text-sm text-muted-foreground'>
              This clears the cookies and revokes the stored refresh token on the server.
            </p>
          </div>
          <Button
            type='button'
            variant='destructive'
            onClick={handleLogout}
            disabled={isEndingSession}
          >
            {isEndingSession ? (
              <Loader2Icon className='mr-2 h-4 w-4 animate-spin' />
            ) : (
              <LogOutIcon className='mr-2 h-4 w-4' />
            )}
            Log out device
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
