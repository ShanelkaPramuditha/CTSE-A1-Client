import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Loader2, Package2, Sparkles, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useInfiniteProducts } from '../../../queries/product.queries';
import { useAddCartItem } from '../../../queries/cart.queries';
import type { Product } from '@/types/product';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    maximumFractionDigits: 2,
  }).format(price);
}

function ProductCard({ product }: { product: Product }) {
  const addToCart = useAddCartItem();
  const [imageUnavailable, setImageUnavailable] = useState(!product.imageUrl);
  const imageUrl = product.imageUrl ?? '';
  const isInStock = (product.availableStock ?? product.stock) > 0;

  const handleAddToCart = () => {
    addToCart.mutate(
      {
        productId: product._id,
        productName: product.name,
        price: product.price,
        quantity: 1,
        image: product.imageUrl,
      },
      {
        onSuccess: () => {
          toast.success(`Added ${product.name} to cart`);
        },
        onError: (error) => {
          toast.error(error instanceof Error ? error.message : 'Failed to add to cart');
        },
      },
    );
  };

  return (
    <Card className='group overflow-hidden border-border/60 bg-card/90 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10'>
      <div className='relative'>
        <Link to='/products/$productId' params={{ productId: product._id }} className='block'>
          <div className='aspect-square overflow-hidden bg-muted'>
            {imageUnavailable ? (
              <div className='flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-muted to-muted/60 text-muted-foreground'>
                <Package2 className='h-10 w-10 opacity-70' />
                <span className='text-xs font-medium'>Image unavailable</span>
              </div>
            ) : (
              <img
                src={imageUrl}
                alt={product.name}
                className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
                loading='lazy'
                onError={() => setImageUnavailable(true)}
              />
            )}
          </div>
        </Link>

        <div className='absolute right-3 top-3 rounded-full bg-background/95 px-3 py-1 text-xs font-medium shadow-sm'>
          <Sparkles className='mr-1 inline h-3.5 w-3.5 text-emerald-500' />
          Fresh pick
        </div>
      </div>

      <CardContent className='flex min-h-44 flex-col gap-3 p-4'>
        <div className='flex items-start justify-between gap-4'>
          <CardTitle className='line-clamp-2 min-h-12 text-[1.05rem] leading-6'>
            {product.name}
          </CardTitle>
          <div className='shrink-0 text-right text-lg font-semibold tracking-tight'>
            {formatPrice(product.price)}
          </div>
        </div>

        <CardDescription className='line-clamp-2 min-h-10 text-sm leading-5'>
          {product.description}
        </CardDescription>

        <Button
          type='button'
          className='mt-auto h-11 w-full rounded-full bg-emerald-500 text-white shadow-none hover:bg-emerald-600'
          onClick={handleAddToCart}
          disabled={addToCart.isPending || !isInStock}
        >
          {addToCart.isPending ? (
            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
          ) : isInStock ? (
            <ShoppingCart className='mr-2 h-4 w-4' />
          ) : null}
          {addToCart.isPending ? 'Adding...' : isInStock ? 'Add to cart' : 'Stock unavailable'}
        </Button>
      </CardContent>
    </Card>
  );
}

export function AllProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, error } =
    useInfiniteProducts(selectedCategory === 'all' ? undefined : selectedCategory);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const products = useMemo(() => data?.pages.flatMap((page) => page.data) ?? [], [data]);
  const totalAvailable = data?.pages[0]?.total ?? products.length;
  const categories = useMemo(() => {
    const apiCategories = data?.pages[0]?.categories ?? [];
    const safeCategories = apiCategories
      .filter((category: string) => typeof category === 'string')
      .map((category: string) => category.trim())
      .filter((category: string) => category.length > 0);

    return ['all', ...safeCategories];
  }, [data]);

  useEffect(() => {
    const element = loadMoreRef.current;

    if (!element || !hasNextPage) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        if (entry?.isIntersecting && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: '400px 0px' },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <div className='mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8'>
      <section className='relative overflow-hidden rounded-3xl border bg-card/80 p-6 shadow-sm backdrop-blur-sm sm:p-8'>
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.16),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.12),transparent_28%)]' />
        <div className='relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between'>
          <div className='max-w-2xl space-y-3'>
            <Badge variant='outline' className='w-fit rounded-full px-3 py-1'>
              <Sparkles className='mr-2 h-3.5 w-3.5' />
              Curated catalog
            </Badge>
            <h1 className='text-balance text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl'>
              Discover products in a calmer, cleaner catalog view.
            </h1>
            <p className='max-w-xl text-sm leading-6 text-muted-foreground sm:text-base'>
              Browse products in chunks, load more as you scroll, and keep the page centered to a
              standard content width for better readability.
            </p>
          </div>

          <div className='grid grid-cols-3 gap-3 sm:min-w-80'>
            <div className='rounded-2xl border bg-background/70 p-4 text-center'>
              <div className='text-2xl font-semibold'>{totalAvailable}</div>
              <div className='text-xs text-muted-foreground'>Available</div>
            </div>
            <div className='rounded-2xl border bg-background/70 p-4 text-center'>
              <div className='text-2xl font-semibold'>{products.length}</div>
              <div className='text-xs text-muted-foreground'>Loaded</div>
            </div>
            <div className='rounded-2xl border bg-background/70 p-4 text-center'>
              <div className='text-2xl font-semibold'>{hasNextPage ? '...' : 'End'}</div>
              <div className='text-xs text-muted-foreground'>More</div>
            </div>
          </div>
        </div>
      </section>

      <section className='space-y-3 rounded-2xl border bg-card/70 p-4 shadow-sm'>
        <div className='flex items-center justify-between gap-3'>
          <div>
            <h2 className='text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground'>
              Category Filter
            </h2>
            <p className='text-sm text-muted-foreground'>Filter the catalog by product category.</p>
          </div>
          <Badge variant='outline' className='rounded-full px-3 py-1'>
            {selectedCategory === 'all' ? 'All categories' : selectedCategory}
          </Badge>
        </div>
        <div className='flex flex-wrap gap-2'>
          {categories.map((category) => {
            const isActive = selectedCategory === category;

            return (
              <Button
                key={category}
                type='button'
                size='sm'
                variant={isActive ? 'default' : 'outline'}
                className={cn('rounded-full', isActive && 'shadow-sm')}
                onClick={() => setSelectedCategory(category)}
              >
                {category === 'all' ? 'All' : category}
              </Button>
            );
          })}
        </div>
      </section>

      {isError ? (
        <div className='rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-sm text-destructive'>
          {(error as Error)?.message || 'Failed to load products.'}
        </div>
      ) : null}

      {isLoading ? (
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3'>
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className='overflow-hidden animate-pulse border-border/60 bg-card/60'>
              <div className='aspect-square bg-muted/70' />
              <CardContent className='space-y-4 p-6'>
                <div className='flex items-start justify-between gap-4'>
                  <div className='h-6 w-2/3 rounded-md bg-muted' />
                  <div className='h-6 w-20 rounded-md bg-muted' />
                </div>
                <div className='h-4 w-full rounded-md bg-muted' />
                <div className='h-4 w-4/5 rounded-md bg-muted' />
                <div className='h-11 w-full rounded-full bg-muted' />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}

      {!isLoading && products.length === 0 ? (
        <Card className='border-dashed border-border/60 bg-card/60'>
          <CardContent className='flex flex-col items-center justify-center gap-3 py-16 text-center'>
            <Package2 className='h-12 w-12 text-muted-foreground/60' />
            <h2 className='text-xl font-semibold'>No products yet</h2>
            <p className='max-w-md text-sm text-muted-foreground'>
              Once products are created in the catalog, they will appear here in a paginated
              infinite scroll feed.
            </p>
          </CardContent>
        </Card>
      ) : null}

      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'>
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      <div ref={loadMoreRef} className='flex min-h-24 items-center justify-center py-4'>
        {isFetchingNextPage ? (
          <div className='flex items-center gap-2 text-sm text-muted-foreground'>
            <Loader2 className='h-4 w-4 animate-spin' />
            Loading more products...
          </div>
        ) : hasNextPage ? (
          <div className='text-sm text-muted-foreground'>Scroll to load more products.</div>
        ) : products.length > 0 ? (
          <div className='text-sm text-muted-foreground'>
            You have reached the end of the catalog.
          </div>
        ) : null}
      </div>
    </div>
  );
}
