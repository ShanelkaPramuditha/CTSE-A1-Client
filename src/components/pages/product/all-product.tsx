import { Store, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useProducts } from '@/queries/product.queries';
import { ProductCard } from '@/components/pages/product/product-card';

export function AllProductsPage() {
  const { data: products, isLoading, isError, error } = useProducts();

  return (
    <div className='max-w-7xl mx-auto p-6 space-y-8'>
      <div className='flex flex-col gap-2'>
        <div className='flex items-center gap-3'>
          <div className='p-2.5 rounded-xl bg-primary/10 text-primary'>
            <Store className='h-7 w-7' />
          </div>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>Shop</h1>
            <p className='text-muted-foreground'>Browse the catalog.</p>
          </div>
        </div>
      </div>

      {isError ? (
        <Alert variant='destructive'>
          <AlertCircle className='h-4 w-4' />
          <AlertTitle>Could not load products</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : 'Something went wrong. Try again later.'}
          </AlertDescription>
        </Alert>
      ) : null}

      {isLoading ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className='space-y-3'>
              <Skeleton className='aspect-[4/3] w-full rounded-xl' />
              <Skeleton className='h-5 w-3/4' />
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-10 w-full rounded-md' />
            </div>
          ))}
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {products?.length ? (
            products.map((product) => <ProductCard key={product.id} product={product} />)
          ) : !isError ? (
            <p className='text-muted-foreground col-span-full text-center py-12'>No products yet.</p>
          ) : null}
        </div>
      )}
    </div>
  );
}
