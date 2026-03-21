import { Loader as LoaderIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

export function Loader1({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center justify-center h-full w-full', className)}>
      <LoaderIcon className='animate-spin' />
    </div>
  );
}
