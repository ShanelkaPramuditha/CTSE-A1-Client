import { useMemo, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { 
  ChevronLeft, 
  ChevronRight, 
  Package, 
  ShoppingBag, 
  Star, 
  TrendingUp,
  ChevronsRight,
  Filter,
  Grid3x3,
  List,
  Sparkles,
  ImageOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { useProducts } from '@/queries/product.queries';

const PAGE_LIMIT = 20;
const NO_IMAGE_PLACEHOLDER = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 24 24" fill="none" stroke="%23999" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"%3E%3Crect x="3" y="3" width="18" height="18" rx="2" ry="2"%3E%3C/rect%3E%3Ccircle cx="8.5" cy="8.5" r="1.5"%3E%3C/circle%3E%3Cpolyline points="21 15 16 10 5 21"%3E%3C/polyline%3E%3C/svg%3E';

function formatPrice(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function ProductImage({ src, alt, className }: { src?: string; alt: string; className?: string }) {
  const [imgError, setImgError] = useState(false);
  
  const imageSrc = !src || imgError ? NO_IMAGE_PLACEHOLDER : src;
  
  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setImgError(true)}
    />
  );
}

export function AllProductsPage() {
  const [page, setPage] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
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
    const end = Math.min(skip + products.length, total);
    return `${start}-${end} of ${total}`;
  }, [products.length, skip, total]);

  const goToLastPage = () => {
    setPage(totalPages - 1);
  };

  const getStockStatus = (availableStock: number) => {
    if (availableStock === 0) return { label: 'Out of stock', color: 'bg-red-500/90 text-white' };
    if (availableStock < 10) return { label: `${availableStock} left`, color: 'bg-orange-500/90 text-white' };
    if (availableStock < 50) return { label: `${availableStock} in stock`, color: 'bg-green-500/90 text-white' };
    return { label: `${availableStock} in stock`, color: 'bg-green-600/90 text-white' };
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950'>
      <div className='mx-auto max-w-7xl space-y-8 p-6 lg:p-8'>
        {/* Header Section */}
        <div className='relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 text-white shadow-2xl'>
          <div className='absolute right-0 top-0 opacity-10'>
            <Package className='h-64 w-64' />
          </div>
          <div className='relative z-10 space-y-4'>
            <div className='inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-sm'>
              <Sparkles className='h-4 w-4' />
              Gateway-backed catalog
            </div>
            <h1 className='text-4xl font-bold tracking-tight lg:text-5xl'>
              Featured Products
            </h1>
            <p className='max-w-2xl text-slate-300'>
              Browse the live catalog from the API gateway. Discover our curated collection 
              of premium products with real-time stock information.
            </p>
          </div>
        </div>

        {/* Controls Bar */}
        <div className='flex flex-col gap-4 rounded-2xl border bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:bg-slate-900/80 sm:flex-row sm:items-center sm:justify-between'>
          <div className='flex items-center gap-3'>
            <div className='flex items-center gap-2 rounded-lg border bg-muted/50 p-1'>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size='sm'
                onClick={() => setViewMode('grid')}
                className='h-8 px-3'
              >
                <Grid3x3 className='h-4 w-4' />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size='sm'
                onClick={() => setViewMode('list')}
                className='h-8 px-3'
              >
                <List className='h-4 w-4' />
              </Button>
            </div>
            <div className='hidden h-6 w-px bg-border sm:block' />
            <div className='flex items-center gap-2 text-sm text-muted-foreground'>
              <Filter className='h-4 w-4' />
              <span>{total} total products</span>
            </div>
          </div>
          <div className='flex items-center gap-3 rounded-lg bg-primary/5 px-4 py-2'>
            <span className='text-sm text-muted-foreground'>Showing</span>
            <span className='font-semibold text-primary'>{rangeLabel}</span>
          </div>
        </div>

        {/* Content Section */}
        {isLoading ? (
          <div className='flex min-h-[400px] flex-col items-center justify-center gap-4 rounded-3xl border bg-white/50 backdrop-blur-sm'>
            <Spinner className='h-12 w-12 text-primary' />
            <p className='text-sm text-muted-foreground'>Loading amazing products...</p>
          </div>
        ) : error ? (
          <Card className='border-red-200 bg-red-50/80 shadow-lg'>
            <CardContent className='flex flex-col items-center gap-4 py-12 text-red-700'>
              <ShoppingBag className='h-12 w-12' />
              <p className='text-lg font-medium'>Failed to load products from the gateway.</p>
              <Button variant='outline' onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </CardContent>
          </Card>
        ) : products.length === 0 ? (
          <Card className='border-dashed'>
            <CardContent className='py-24 text-center'>
              <Package className='mx-auto h-12 w-12 text-muted-foreground' />
              <p className='mt-4 text-lg text-muted-foreground'>No products found in the catalog</p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className={
              viewMode === 'grid' 
                ? 'grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                : 'space-y-4'
            }>
              {products.map((product) => {
                const availableStock = product.availableStock ?? 0;
                const isBestseller = product.totalOrders > 100;
                const stockStatus = getStockStatus(availableStock);
                const discount = product.originalPrice && product.originalPrice > product.price 
                  ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                  : 0;

                if (viewMode === 'list') {
                  return (
                    <Link
                      key={product._id}
                      to='/products/$productId'
                      params={{ productId: product._id }}
                      className='group block'
                    >
                      <Card className='overflow-hidden transition-all duration-300 hover:shadow-xl'>
                        <div className='flex flex-col md:flex-row'>
                          <div className='relative h-48 w-full md:h-auto md:w-48'>
                            <ProductImage
                              src={product.imageUrl}
                              alt={product.name}
                              className='h-full w-full object-cover'
                            />
                            {discount > 0 && (
                              <Badge className='absolute left-3 top-3 bg-red-500 text-white'>
                                -{discount}%
                              </Badge>
                            )}
                          </div>
                          <div className='flex flex-1 flex-col justify-between p-6'>
                            <div>
                              <div className='mb-2 flex flex-wrap items-center gap-2'>
                                <Badge variant='secondary'>{product.category}</Badge>
                                {isBestseller && (
                                  <Badge className='bg-amber-500 text-amber-950'>
                                    ⭐ Bestseller
                                  </Badge>
                                )}
                              </div>
                              <h3 className='mb-2 text-xl font-semibold group-hover:text-primary'>
                                {product.name}
                              </h3>
                              <p className='mb-4 line-clamp-2 text-muted-foreground'>
                                {product.description}
                              </p>
                            </div>
                            <div className='flex items-center justify-between'>
                              <div>
                                <span className='text-2xl font-bold text-primary'>
                                  {formatPrice(product.price)}
                                </span>
                                {product.originalPrice && (
                                  <span className='ml-2 text-sm text-muted-foreground line-through'>
                                    {formatPrice(product.originalPrice)}
                                  </span>
                                )}
                              </div>
                              <Button>View Details</Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  );
                }

                return (
                  <Link
                    key={product._id}
                    to='/products/$productId'
                    params={{ productId: product._id }}
                    className='group block'
                  >
                    <Card className='h-full overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl'>
                      <div className='relative aspect-square overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200'>
                        <ProductImage
                          src={product.imageUrl}
                          alt={product.name}
                          className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-110'
                        />
                        <div className='absolute left-3 top-3 flex flex-wrap gap-2'>
                          {isBestseller && (
                            <Badge className='rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg'>
                              <Star className='mr-1 h-3 w-3 fill-current' />
                              Bestseller
                            </Badge>
                          )}
                          {discount > 0 && (
                            <Badge className='rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg'>
                              -{discount}% OFF
                            </Badge>
                          )}
                        </div>
                        <div className={`absolute bottom-3 right-3 rounded-full px-3 py-1 text-xs font-semibold shadow-lg ${stockStatus.color}`}>
                          {stockStatus.label}
                        </div>
                      </div>
                      <CardHeader className='space-y-2'>
                        <div className='flex items-start justify-between gap-3'>
                          <CardTitle className='line-clamp-1 text-lg group-hover:text-primary'>
                            {product.name}
                          </CardTitle>
                          <div className='shrink-0 text-right'>
                            <span className='block font-bold text-primary'>
                              {formatPrice(product.price)}
                            </span>
                            {product.originalPrice && (
                              <span className='text-xs text-muted-foreground line-through'>
                                {formatPrice(product.originalPrice)}
                              </span>
                            )}
                          </div>
                        </div>
                        <CardDescription className='line-clamp-2 min-h-10'>
                          {product.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className='mb-4 flex items-center justify-between text-sm'>
                          <div className='flex items-center gap-1 text-amber-600'>
                            <Star className='h-4 w-4 fill-current' />
                            <span className='font-medium'>{product.totalOrders}</span>
                            <span className='text-muted-foreground'>orders</span>
                          </div>
                          <div className='flex items-center gap-1 text-emerald-600'>
                            <TrendingUp className='h-4 w-4' />
                            <span className='font-medium'>{product.orderedQuantity}</span>
                            <span className='text-muted-foreground'>sold</span>
                          </div>
                        </div>
                        <Button className='w-full shadow-lg transition-all hover:shadow-xl' variant='default'>
                          View Details →
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>

            {/* Pagination Section */}
            <div className='rounded-2xl border bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:bg-slate-900/80'>
              <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                <div className='text-sm text-muted-foreground'>
                  Page {page + 1} of {Math.max(totalPages, 1)}
                  {isFetching && (
                    <span className='ml-2 inline-flex items-center gap-1'>
                      <Spinner className='h-3 w-3' />
                      Updating...
                    </span>
                  )}
                </div>
                <div className='flex flex-wrap items-center gap-3'>
                  <Button
                    variant='outline'
                    onClick={() => setPage(0)}
                    disabled={page === 0 || isFetching}
                    className='gap-1'
                  >
                    <ChevronsRight className='h-4 w-4 rotate-180' />
                    First
                  </Button>
                  <Button
                    variant='outline'
                    onClick={() => setPage((currentPage) => Math.max(0, currentPage - 1))}
                    disabled={page === 0 || isFetching}
                    className='gap-1'
                  >
                    <ChevronLeft className='h-4 w-4' />
                    Previous
                  </Button>
                  <div className='flex gap-2'>
                    {[...Array(Math.min(5, totalPages))].map((_, idx) => {
                      const pageNum = idx + Math.max(0, Math.min(page - 2, totalPages - 5));
                      if (pageNum >= totalPages) return null;
                      return (
                        <Button
                          key={pageNum}
                          variant={page === pageNum ? 'default' : 'outline'}
                          size='sm'
                          onClick={() => setPage(pageNum)}
                          disabled={isFetching}
                          className='h-9 w-9 p-0'
                        >
                          {pageNum + 1}
                        </Button>
                      );
                    })}
                  </div>
                  <Button
                    onClick={() => setPage((currentPage) => currentPage + 1)}
                    disabled={!hasMore || isFetching}
                    className='gap-1'
                  >
                    Next
                    <ChevronRight className='h-4 w-4' />
                  </Button>
                  <Button
                    variant='outline'
                    onClick={goToLastPage}
                    disabled={page === totalPages - 1 || totalPages === 0 || isFetching}
                    className='gap-1'
                  >
                    Last
                    <ChevronsRight className='h-4 w-4' />
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}