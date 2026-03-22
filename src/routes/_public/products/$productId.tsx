import { createFileRoute, Link } from '@tanstack/react-router';
import { z } from 'zod';
import {
  ArrowLeft,
  Truck,
  RotateCcw,
  Plus,
  Minus,
  AlertCircle,
  Package,
  ShoppingCart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';
import { toast } from 'sonner';
import { useProduct } from '@/queries/product.queries';
import { ProductImage } from '@/components/pages/product/product-image';

const productIdSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
});

const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export const Route = createFileRoute('/_public/products/$productId')({
  parseParams: (params) => productIdSchema.parse(params),
  component: ProductDetailPage,
});

function ProductDetailPage() {
  const { productId } = Route.useParams();
  const [quantity, setQuantity] = useState(1);
  const { data: product, isLoading, isError, error } = useProduct(productId);

  if (isLoading) {
    return (
      <div className='max-w-7xl mx-auto px-6 py-10 space-y-8'>
        <Skeleton className='h-5 w-40' />
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
          <Skeleton className='aspect-square rounded-3xl' />
          <div className='space-y-4'>
            <Skeleton className='h-10 w-3/4' />
            <Skeleton className='h-8 w-1/3' />
            <Skeleton className='h-24 w-full' />
            <Skeleton className='h-14 w-full rounded-2xl' />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className='max-w-7xl mx-auto px-6 py-10'>
        <Alert variant='destructive'>
          <AlertCircle className='h-4 w-4' />
          <AlertTitle>Product not found</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : 'This product may have been removed.'}
          </AlertDescription>
        </Alert>
        <Button variant='link' className='mt-4 px-0' asChild>
          <Link to='/products'>Back to shop</Link>
        </Button>
      </div>
    );
  }

  const stockAvailable = product.availableStock > 0;

  return (
    <div className='max-w-7xl mx-auto px-6 py-10 space-y-10'>
      <Link
        to='/products'
        className='inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors'
      >
        <ArrowLeft className='h-4 w-4' />
        Back to shop
      </Link>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
        <div className='space-y-4'>
          <div className='aspect-square rounded-3xl border border-border/60 overflow-hidden bg-muted/30'>
            <ProductImage
              src={product.imageUrl}
              alt={product.name}
              iconClassName='h-32 w-32'
              className='h-full w-full object-cover'
              loading='eager'
            />
          </div>
        </div>

        <div className='flex flex-col space-y-6'>
          <div className='space-y-2'>
            <div className='flex flex-wrap items-center gap-2'>
              <Badge variant='secondary' className='rounded-full'>
                {product.category}
              </Badge>
              <Badge
                variant='outline'
                className={`rounded-full ${
                  stockAvailable
                    ? 'text-green-700 border-green-200 bg-green-50 dark:text-green-400 dark:border-green-900 dark:bg-green-950/40'
                    : 'text-destructive border-destructive/30 bg-destructive/5'
                }`}
              >
                {stockAvailable ? `${product.availableStock} in stock` : 'Out of stock'}
              </Badge>
            </div>
            <h1 className='text-4xl font-bold tracking-tight text-foreground'>{product.name}</h1>
            <div className='flex items-center gap-4 text-sm text-muted-foreground'>
              <span className='inline-flex items-center gap-1'>
                <Package className='h-4 w-4' />
                SKU: {product.id}
              </span>
              {product.totalOrders > 0 && (
                <span className='inline-flex items-center gap-1'>
                  <ShoppingCart className='h-4 w-4' />
                  {product.totalOrders} orders · {product.orderedQuantity} sold
                </span>
              )}
            </div>
          </div>

          <p className='text-3xl font-bold tabular-nums'>{priceFormatter.format(product.price)}</p>

          <p className='text-muted-foreground leading-relaxed'>{product.description}</p>

          <Separator />

          <div className='space-y-4 pt-2'>
            <div className='flex items-center gap-6'>
              <div className='flex items-center border rounded-full p-1 bg-accent/30'>
                <Button
                  variant='ghost'
                  size='icon'
                  className='rounded-full h-8 w-8'
                  disabled={!stockAvailable}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className='h-3 w-3' />
                </Button>
                <span className='w-10 text-center font-medium'>{quantity}</span>
                <Button
                  variant='ghost'
                  size='icon'
                  className='rounded-full h-8 w-8'
                  disabled={!stockAvailable || quantity >= product.availableStock}
                  onClick={() => setQuantity(Math.min(product.availableStock, quantity + 1))}
                >
                  <Plus className='h-3 w-3' />
                </Button>
              </div>
              <p className='text-sm text-muted-foreground'>
                {stockAvailable
                  ? `Up to ${product.availableStock} units available`
                  : 'No units available'}
              </p>
            </div>

            <div className='flex flex-col sm:flex-row gap-4'>
              <Button
                size='lg'
                className='flex-1 h-14 text-lg rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/30'
                disabled={!stockAvailable}
                onClick={() => {
                  toast.success(
                    quantity > 1
                      ? `${product.name} added to cart (${quantity} items)`
                      : `${product.name} added to cart`,
                  );
                  setQuantity(1);
                }}
              >
                Add to cart
              </Button>
            </div>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4'>
            <div className='flex items-start gap-3 p-4 rounded-2xl bg-accent/20 border border-accent/50'>
              <Truck className='h-5 w-5 text-primary shrink-0' />
              <div className='space-y-1'>
                <p className='text-sm font-semibold'>Fast delivery</p>
                <p className='text-xs text-muted-foreground'>Ships within 24–48 hours</p>
              </div>
            </div>
            <div className='flex items-start gap-3 p-4 rounded-2xl bg-accent/20 border border-accent/50'>
              <RotateCcw className='h-5 w-5 text-primary shrink-0' />
              <div className='space-y-1'>
                <p className='text-sm font-semibold'>30-day returns</p>
                <p className='text-xs text-muted-foreground'>Hassle-free money back</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
