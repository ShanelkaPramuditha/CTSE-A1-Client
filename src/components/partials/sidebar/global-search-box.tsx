import { IconSearch, IconX } from '@tabler/icons-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type GlobalSearchBoxProps = {
  onSearchChange?: (value: string) => void;
};

export function GlobalSearchBox({ onSearchChange }: GlobalSearchBoxProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleToggle = () => {
    setIsExpanded((prev) => !prev);
  };

  const handleClose = useCallback(() => {
    setIsExpanded(false);
    setSearchValue('');
    onSearchChange?.('');
  }, [onSearchChange]);

  // SEND SEARCH VALUE TO SIDEBAR
  useEffect(() => {
    onSearchChange?.(searchValue);

    if (searchValue.trim()) {
      console.log('Global artist search:', searchValue);
    }
  }, [searchValue, onSearchChange]);

  // Focus input when expanded
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    if (isExpanded) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isExpanded, handleClose]);

  return (
    <div className='relative flex items-center'>
      {/* Search Icon */}
      <Button
        variant='ghost'
        size='icon'
        onClick={handleToggle}
        className={cn(
          'h-9 w-9 transition-all duration-300 rounded-full',
          isExpanded && 'opacity-0 pointer-events-none',
        )}
        aria-label='Search artists'
      >
        <div className='flex pl-12 items-center gap-1'>
          <IconSearch data-slot='icon' className='h-5 w-5' />
          <span>Artists</span>
        </div>
      </Button>

      {/* Expandable Input */}
      <div
        className={cn(
          'absolute right-2 top-0 flex items-center transition-all duration-300',
          isExpanded
            ? 'w opacity-100 translate-x-0'
            : 'w-0 opacity-0 translate-x-2 pointer-events-none',
        )}
      >
        <div className='relative w-full'>
          <Input
            ref={inputRef}
            placeholder='Search artists...'
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className='h-9 rounded-full pl-4 pr-10 text-sm focus-visible:ring-0'
          />

          <Button
            type='button'
            variant='ghost'
            size='icon'
            onClick={handleClose}
            className='absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full'
            aria-label='Clear search'
          >
            <IconX className='h-3 w-3' />
          </Button>
        </div>
      </div>
    </div>
  );
}
