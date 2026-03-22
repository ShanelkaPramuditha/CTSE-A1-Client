import { useEffect, useMemo, useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { normalizeProductImageUrl } from '@/lib/image-url';

type ProductImageProps = {
  src?: string | null;
  alt: string;
  className?: string;
  iconClassName?: string;
  loading?: 'lazy' | 'eager';
};

/**
 * Renders product image when `src` is valid; on load error or missing URL shows a neutral placeholder.
 */
export function ProductImage({
  src,
  alt,
  className,
  iconClassName,
  loading = 'lazy',
}: ProductImageProps) {
  const [failed, setFailed] = useState(false);
  const trimmed = src?.trim();
  const resolvedSrc = useMemo(
    () => (trimmed ? normalizeProductImageUrl(trimmed) : undefined),
    [trimmed],
  );
  const showImg = Boolean(resolvedSrc && !failed);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (showImg) {
    return (
      <img
        src={resolvedSrc}
        alt={alt}
        loading={loading}
        className={cn('h-full w-full object-cover', className)}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <div
      className={cn(
        'flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-accent',
        className,
      )}
    >
      <ShoppingBag className={cn('text-muted-foreground/25', iconClassName)} />
    </div>
  );
}
