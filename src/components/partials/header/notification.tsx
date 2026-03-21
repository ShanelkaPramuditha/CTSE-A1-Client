import { BellIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

// Notification Menu Component
export function Notification() {
  const notificationCount = 3;
  const onItemClick = (item: string) => {
    console.log('Notification item clicked:', item);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' className='h-9 w-9 rounded-full relative'>
          <BellIcon className='h-4 w-4' />
          {notificationCount > 0 && (
            <Badge className='absolute top-0 right-0 h-4 w-4 flex items-center justify-center p-0 text-xs'>
              {notificationCount > 9 ? '9+' : notificationCount}
            </Badge>
          )}
          <span className='sr-only'>Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-80 '>
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onItemClick?.('notification1')}>
          <div className='flex flex-col gap-1'>
            <p className='text-sm font-medium'>New message received</p>
            <p className='text-xs text-muted-foreground'>2 minutes ago</p>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onItemClick?.('notification2')}>
          <div className='flex flex-col gap-1'>
            <p className='text-sm font-medium'>System update available</p>
            <p className='text-xs text-muted-foreground'>1 hour ago</p>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onItemClick?.('notification3')}>
          <div className='flex flex-col gap-1'>
            <p className='text-sm font-medium'>Weekly report ready</p>
            <p className='text-xs text-muted-foreground'>3 hours ago</p>
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onItemClick?.('view-all')}>
          View all notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
