import { createFileRoute, Link } from '@tanstack/react-router';
import { z } from 'zod';
import {
  ArrowLeft,
  ShieldCheck,
  Truck,
  RotateCcw,
  Plus,
  Minus,
  Star,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import { useAddCartItem } from '@/queries/cart.queries';
import { useProduct } from '@/queries/product.queries';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';

// Validation for product ID
const productIdSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
});

const FALLBACK_IMAGE = 'https://essstr.blob.core.windows.net/essimg/350x/Small/Pic915025.jpg';

function formatPrice(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

export const Route = createFileRoute('/_public/products/$productId')({
  parseParams: (params) => productIdSchema.parse(params),
  component: ProductDetailPage,
});

function ProductDetailPage() {
  const { productId } = Route.useParams();
  const { data: product, isLoading, error } = useProduct(productId);
  const [quantity, setQuantity] = useState(1);
  const addToCart = useAddCartItem();

  const availableStock = product?.availableStock ?? 0;

  const handleDecrease = () => {
    setQuantity((currentQuantity) => Math.max(1, currentQuantity - 1));
  };

  const handleIncrease = () => {
    setQuantity((currentQuantity) => Math.min(availableStock || 1, currentQuantity + 1));
  };

  return (
    <div className='max-w-7xl mx-auto px-6 py-10 space-y-10'>
      {/* Navigation */}
      <Link
        to='/'
        className='inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors'
      >
        <ArrowLeft className='h-4 w-4' />
        Back to Catalog
      </Link>

      {isLoading ? (
        <div className='flex min-h-[480px] items-center justify-center rounded-3xl border bg-card/70'>
          <Spinner className='h-10 w-10 text-primary' />
        </div>
      ) : error ? (
        <div className='rounded-3xl border border-red-200 bg-red-50/70 p-6 text-red-700'>
          <p className='font-medium'>Failed to load product details from the gateway.</p>
          <p className='mt-2 text-sm'>The product may be missing or the API is unavailable.</p>
        </div>
      ) : product ? (
        <div className='grid grid-cols-1 gap-12 lg:grid-cols-2'>
          <div className='space-y-4'>
            <div className='overflow-hidden rounded-3xl border bg-muted'>
              <img
                src={product.imageUrl || FALLBACK_IMAGE}
                alt={product.name}
                className='aspect-square h-full w-full object-cover'
              />
            </div>
            <div className='grid grid-cols-4 gap-4'>
              {[
                product.imageUrl || FALLBACK_IMAGE,
                FALLBACK_IMAGE,
                FALLBACK_IMAGE,
                FALLBACK_IMAGE,
              ].map((imageSrc, index) => (
                <div
                  key={`${imageSrc}-${index}`}
                  className='aspect-square overflow-hidden rounded-xl border bg-muted'
                >
                  <img src={imageSrc} alt='' className='h-full w-full object-cover' />
                </div>
              ))}
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
                  className='rounded-full border-green-200 bg-green-50 text-green-700'
                >
                  {availableStock > 0 ? `${availableStock} available` : 'Out of stock'}
                </Badge>
                {product.totalOrders > 0 && (
                  <Badge
                    variant='outline'
                    className='rounded-full border-amber-200 bg-amber-50 text-amber-700'
                  >
                    Bestseller
                  </Badge>
                )}
              </div>
              <h1 className='text-4xl font-bold tracking-tight text-foreground'>{product.name}</h1>
              <div className='flex flex-wrap items-center gap-4 text-sm'>
                <div className='flex items-center gap-1 text-yellow-500'>
                  <Star className='h-4 w-4 fill-yellow-500' />
                  <span className='font-medium'>{product.totalOrders}</span>
                  <span className='text-muted-foreground'>orders</span>
                </div>
                <div className='flex items-center gap-1 text-primary'>
                  <TrendingUp className='h-4 w-4' />
                  <span className='font-medium'>{product.orderedQuantity}</span>
                  <span className='text-muted-foreground'>ordered</span>
                </div>
                <Separator orientation='vertical' className='h-4' />
                <span className='text-muted-foreground'>{product._id}</span>
              </div>
            </div>

            <p className='text-3xl font-bold'>{formatPrice(product.price)}</p>

            <p className='text-muted-foreground leading-relaxed'>{product.description}</p>

            <Separator />

            <div className='grid grid-cols-2 gap-4'>
              {[
                ['Created', new Date(product.createdAt).toLocaleDateString()],
                ['Updated', new Date(product.updatedAt).toLocaleDateString()],
                ['Raw stock', product.stock.toString()],
                ['Available', availableStock.toString()],
              ].map(([label, value]) => (
                <div key={label} className='rounded-2xl border bg-card/60 p-4 text-sm'>
                  <p className='text-muted-foreground'>{label}</p>
                  <p className='mt-1 font-medium'>{value}</p>
                </div>
              ))}
            </div>

            <Separator />

            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              <div className='flex items-start gap-3 rounded-2xl border bg-accent/20 p-4'>
                <ShieldCheck className='mt-0.5 h-5 w-5 text-primary' />
                <div className='space-y-1'>
                  <p className='text-sm font-semibold'>Secure checkout</p>
                  <p className='text-xs text-muted-foreground'>
                    Stock is validated during checkout.
                  </p>
                </div>
              </div>
              <div className='flex items-start gap-3 rounded-2xl border bg-accent/20 p-4'>
                <Truck className='mt-0.5 h-5 w-5 text-primary' />
                <div className='space-y-1'>
                  <p className='text-sm font-semibold'>Live inventory</p>
                  <p className='text-xs text-muted-foreground'>
                    Displayed from the API gateway response.
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div className='space-y-4 pt-4'>
              <div className='flex flex-wrap items-center gap-6'>
                <div className='flex items-center rounded-full border bg-accent/30 p-1'>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='h-8 w-8 rounded-full'
                    onClick={handleDecrease}
                  >
                    <Minus className='h-3 w-3' />
                  </Button>
                  <span className='w-10 text-center font-medium'>{quantity}</span>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='h-8 w-8 rounded-full'
                    onClick={handleIncrease}
                    disabled={availableStock === 0 || quantity >= availableStock}
                  >
                    <Plus className='h-3 w-3' />
                  </Button>
                </div>
                <p className='text-sm text-muted-foreground'>
                  {availableStock > 0
                    ? `Only ${availableStock} units left in stock`
                    : 'This product is currently out of stock'}
                </p>
              </div>

              <div className='flex gap-4'>
                <Button
                  size='lg'
                  className='h-14 flex-1 rounded-2xl text-lg shadow-xl shadow-primary/20 hover:shadow-primary/30'
                  disabled={addToCart.isPending || availableStock === 0}
                  onClick={() => {
                    addToCart.mutate(
                      {
                        productId: product._id,
                        productName: product.name,
                        price: product.price,
                        quantity,
                        image: product.imageUrl,
                      },
                      {
                        onSuccess: () => {
                          toast.success(`Added ${product.name} to cart`);
                          setQuantity(1);
                        },
                        onError: (mutationError) => {
                          toast.error(
                            mutationError.message || 'Failed to add to cart. Please log in first.',
                          );
                        },
                      },
                    );
                  }}
                >
                  {addToCart.isPending ? 'Adding...' : 'Add to Cart'}
                </Button>
                <Button size='lg' variant='outline' className='h-14 rounded-2xl'>
                  Wishlist
                </Button>
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4 pt-4'>
              <div className='flex items-start gap-3 rounded-2xl border bg-accent/20 p-4'>
                <Truck className='h-5 w-5 text-primary' />
                <div className='space-y-1'>
                  <p className='text-sm font-semibold'>Fast Delivery</p>
                  <p className='text-xs text-muted-foreground'>Ships within 24-48 hours</p>
                </div>
              </div>
              <div className='flex items-start gap-3 rounded-2xl border bg-accent/20 p-4'>
                <RotateCcw className='h-5 w-5 text-primary' />
                <div className='space-y-1'>
                  <p className='text-sm font-semibold'>30-Day Returns</p>
                  <p className='text-xs text-muted-foreground'>Hassle-free money back</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className='rounded-3xl border bg-card/70 p-6'>
          <p className='font-medium'>Product not found.</p>
          <p className='mt-2 text-sm text-muted-foreground'>
            The catalog entry may have been removed or the ID is invalid.
          </p>
        </div>
      )}
    </div>
  );
}
