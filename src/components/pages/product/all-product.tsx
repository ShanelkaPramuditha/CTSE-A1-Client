import { useMemo, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { ChevronLeft, ChevronRight, Package, ShoppingBag, Star, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { useProducts } from '@/queries/product.queries';

const PAGE_LIMIT = 20;
const FALLBACK_IMAGE = 'https://essstr.blob.core.windows.net/essimg/350x/Small/Pic915025.jpg';

function formatPrice(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

export function AllProductsPage() {
  const [page, setPage] = useState(0);
  const skip = page * PAGE_LIMIT;
  const {
    data: productsResponse,
    isLoading,
    error,
    isFetching,
  } = useProducts({
    skip,
    limit: PAGE_LIMIT,
  });

  const products = productsResponse?.data ?? [];
  const total = productsResponse?.total ?? 0;
  const totalPages = productsResponse?.totalPages ?? 0;
  const hasMore = productsResponse?.hasMore ?? false;

  const rangeLabel = useMemo(() => {
    if (total === 0 || products.length === 0) {
      return '0 products';
    }

    const start = skip + 1;
    const end = skip + products.length;
    return `${start}-${end} of ${total}`;
  }, [products.length, skip, total]);

  return (
    <div className='space-y-8 p-6'>
      <div className='flex flex-col gap-4 md:flex-row md:items-end md:justify-between'>
        <div className='space-y-2'>
          <div className='inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground'>
            <Package className='h-3.5 w-3.5' />
            Gateway-backed catalog
          </div>
          <h1 className='text-3xl font-bold tracking-tight'>Featured Products</h1>
          <p className='max-w-2xl text-muted-foreground'>
            Browse the live catalog from the API gateway. Pagination keeps requests small and the
            stock numbers reflect the backend response.
          </p>
        </div>
        <div className='flex items-center gap-3 rounded-2xl border bg-card px-4 py-3 text-sm shadow-sm'>
          <span className='text-muted-foreground'>Showing</span>
          <span className='font-medium'>{rangeLabel}</span>
        </div>
      </div>

      {isLoading ? (
        <div className='flex min-h-[320px] items-center justify-center rounded-3xl border bg-card/70'>
          <Spinner className='h-10 w-10 text-primary' />
        </div>
      ) : error ? (
        <Card className='border-red-200 bg-red-50/60'>
          <CardContent className='flex items-center gap-3 py-6 text-red-700'>
            <ShoppingBag className='h-5 w-5' />
            <p>Failed to load products from the gateway.</p>
          </CardContent>
        </Card>
      ) : products.length === 0 ? (
        <Card>
          <CardContent className='py-16 text-center text-muted-foreground'>
            No products returned from the catalog yet.
          </CardContent>
        </Card>
      ) : (
        <>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4'>
            {products.map((product) => {
              const availableStock = product.availableStock ?? 0;
              const isBestseller = product.totalOrders > 0;

              return (
                <Link
                  key={product._id}
                  to='/products/$productId'
                  params={{ productId: product._id }}
                  className='group block'
                >
                  <Card className='h-full overflow-hidden border-none bg-card/80 shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl'>
                    <div className='relative aspect-square overflow-hidden bg-muted'>
                      <img
                        src={product.imageUrl || FALLBACK_IMAGE}
                        alt={product.name}
                        className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
                        loading='lazy'
                      />
                      <div className='absolute left-3 top-3 flex gap-2'>
                        {isBestseller && (
                          <Badge className='rounded-full bg-amber-500/90 text-amber-950 hover:bg-amber-500'>
                            Bestseller
                          </Badge>
                        )}
                        <Badge variant='secondary' className='rounded-full'>
                          {product.category}
                        </Badge>
                      </div>
                      <div className='absolute bottom-3 right-3 rounded-full bg-background/90 px-3 py-1 text-xs font-medium shadow-sm'>
                        {availableStock > 0 ? `${availableStock} in stock` : 'Out of stock'}
                      </div>
                    </div>
                    <CardHeader className='space-y-2'>
                      <div className='flex items-start justify-between gap-3'>
                        <CardTitle className='line-clamp-1 text-base'>{product.name}</CardTitle>
                        <span className='shrink-0 font-semibold text-foreground'>
                          {formatPrice(product.price)}
                        </span>
                      </div>
                      <CardDescription className='line-clamp-2 min-h-10'>
                        {product.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className='flex items-center justify-between text-sm text-muted-foreground'>
                        <div className='flex items-center gap-1'>
                          <Star className='h-4 w-4 fill-amber-400 text-amber-400' />
                          {product.totalOrders} orders
                        </div>
                        <div className='flex items-center gap-1'>
                          <TrendingUp className='h-4 w-4' />
                          {product.orderedQuantity} ordered
                        </div>
                      </div>
                      <Button className='mt-5 w-full' variant='default'>
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          <div className='flex flex-col gap-4 rounded-2xl border bg-card/80 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between'>
            <p className='text-sm text-muted-foreground'>
              Page {page + 1} of {Math.max(totalPages, 1)}
              {isFetching ? ' · Updating...' : ''}
            </p>
            <div className='flex items-center gap-3'>
              <Button
                variant='outline'
                onClick={() => setPage((currentPage) => Math.max(0, currentPage - 1))}
                disabled={page === 0 || isFetching}
              >
                <ChevronLeft className='mr-2 h-4 w-4' />
                Previous
              </Button>
              <Button
                onClick={() => setPage((currentPage) => currentPage + 1)}
                disabled={!hasMore || isFetching}
              >
                Next
                <ChevronRight className='ml-2 h-4 w-4' />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
