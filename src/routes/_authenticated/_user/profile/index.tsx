'use client';

import { createFileRoute } from '@tanstack/react-router';
import { useAuth } from '@/hooks';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BadgeCheckIcon } from 'lucide-react';

export const Route = createFileRoute('/_authenticated/_user/profile/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className='flex flex-col items-center justify-center py-16'>
        <p className='text-sm text-muted-foreground'>No user data available.</p>
      </div>
    );
  }

  const name = user.name ?? '';
  const email = user.email ?? '';
  const avatar = user.avatar;

  const initials =
    (name || email || 'U')
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .join('')
      .toUpperCase() || 'U';

  return (
    <div className='mx-auto w-full lg:px-0'>
      <Card className='mt-20 opacity-80 w-full  backdrop-blur-sm '>
        <CardHeader className='flex flex-col items-center gap-4'>
          <Avatar className='h-40 w-40 rounded-full border-4'>
            <AvatarImage src={avatar} alt={name || email} />
            <AvatarFallback className='text-lg font-semibold'>{initials}</AvatarFallback>
          </Avatar>
          <div className='space-y-1 text-center'>
            <CardTitle className='flex items-center justify-center gap-1.5 text-xl'>
              {name || 'Unnamed user'}
              <BadgeCheckIcon className='h-5 w-5 text-blue-500' />
            </CardTitle>
            <CardDescription>{email}</CardDescription>
            <div className='mt-2 px-3 py-1 bg-primary/10 rounded-full inline-block text-xs font-bold uppercase text-primary'>
              {user.role}
            </div>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}
