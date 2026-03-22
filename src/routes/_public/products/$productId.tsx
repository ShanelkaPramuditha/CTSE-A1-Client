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
  Heart,
  Share2,
  CheckCircle,
  AlertCircle,
  Clock,
  Package,
  ShoppingCart,
  ImageOff,
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

const NO_IMAGE_PLACEHOLDER =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 24 24" fill="none" stroke="%23999" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"%3E%3Crect x="3" y="3" width="18" height="18" rx="2" ry="2"%3E%3C/rect%3E%3Ccircle cx="8.5" cy="8.5" r="1.5"%3E%3C/circle%3E%3Cpolyline points="21 15 16 10 5 21"%3E%3C/polyline%3E%3C/svg%3E';

function formatPrice(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export const Route = createFileRoute('/_public/products/$productId')({
  parseParams: (params) => productIdSchema.parse(params),
  component: ProductDetailPage,
});

function ProductImage({ src, alt, className }: { src?: string; alt: string; className?: string }) {
  const [imgError, setImgError] = useState(false);

  const imageSrc = !src || imgError ? NO_IMAGE_PLACEHOLDER : src;

  return <img src={imageSrc} alt={alt} className={className} onError={() => setImgError(true)} />;
}

function ProductDetailPage() {
  const { productId } = Route.useParams();
  const { data: product, isLoading, error } = useProduct(productId);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const addToCart = useAddCartItem();

  const availableStock = product?.availableStock ?? 0;
  const isLowStock = availableStock > 0 && availableStock <= 10;
  const isOutOfStock = availableStock === 0;
  const discount =
    product?.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  const handleDecrease = () => {
    setQuantity((currentQuantity) => Math.max(1, currentQuantity - 1));
  };

  const handleIncrease = () => {
    setQuantity((currentQuantity) => Math.min(availableStock || 1, currentQuantity + 1));
  };

  const getStockStatusColor = () => {
    if (isOutOfStock) return 'bg-red-100 text-red-700 border-red-200';
    if (isLowStock) return 'bg-orange-100 text-orange-700 border-orange-200';
    return 'bg-green-100 text-green-700 border-green-200';
  };

  const getStockIcon = () => {
    if (isOutOfStock) return <AlertCircle className='h-4 w-4' />;
    if (isLowStock) return <Clock className='h-4 w-4' />;
    return <CheckCircle className='h-4 w-4' />;
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950'>
      <div className='mx-auto max-w-7xl px-6 py-8 lg:px-8 lg:py-12'>
        {/* Navigation */}
        <Link
          to='/'
          className='group mb-8 inline-flex items-center gap-2 rounded-full border bg-white/80 px-4 py-2 text-sm font-medium text-muted-foreground shadow-sm backdrop-blur-sm transition-all hover:border-primary hover:text-primary dark:bg-slate-900/80'
        >
          <ArrowLeft className='h-4 w-4 transition-transform group-hover:-translate-x-1' />
          Back to Catalog
        </Link>

        {isLoading ? (
          <div className='flex min-h-[480px] flex-col items-center justify-center gap-4 rounded-3xl border bg-white/50 backdrop-blur-sm'>
            <Spinner className='h-12 w-12 text-primary' />
            <p className='text-sm text-muted-foreground'>Loading product details...</p>
          </div>
        ) : error ? (
          <div className='rounded-3xl border border-red-200 bg-red-50/80 p-8 text-center shadow-lg'>
            <Package className='mx-auto h-12 w-12 text-red-500' />
            <p className='mt-4 text-lg font-medium text-red-700'>Failed to load product details</p>
            <p className='mt-2 text-sm text-red-600'>
              The product may be missing or the API is unavailable.
            </p>
            <Button className='mt-6' variant='outline' onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        ) : product ? (
          <div className='grid grid-cols-1 gap-12 lg:grid-cols-2'>
            {/* Image Section - Single Image */}
            <div className='space-y-4'>
              <div className='group relative overflow-hidden rounded-3xl border bg-gradient-to-br from-slate-100 to-slate-200 shadow-xl'>
                <ProductImage
                  src={product.imageUrl}
                  alt={product.name}
                  className='aspect-square h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
                />
                {discount > 0 && (
                  <div className='absolute left-4 top-4 rounded-full bg-gradient-to-r from-red-500 to-red-600 px-3 py-1 text-sm font-bold text-white shadow-lg'>
                    -{discount}% OFF
                  </div>
                )}
                {!product.imageUrl && (
                  <div className='absolute inset-0 flex flex-col items-center justify-center bg-slate-100'>
                    <ImageOff className='h-16 w-16 text-slate-400' />
                    <p className='mt-2 text-sm text-slate-500'>No image available</p>
                  </div>
                )}
              </div>

              {/* Single image indicator */}
              <div className='flex justify-center gap-2'>
                <div className='h-1 w-8 rounded-full bg-primary'></div>
              </div>
              <p className='text-center text-xs text-muted-foreground'>Product image</p>
            </div>

            {/* Product Info Section */}
            <div className='flex flex-col space-y-6'>
              <div className='space-y-3'>
                <div className='flex flex-wrap items-center gap-2'>
                  <Badge variant='secondary' className='rounded-full px-3 py-1 text-xs font-medium'>
                    {product.category}
                  </Badge>
                  <Badge
                    className={`rounded-full px-3 py-1 text-xs font-medium ${getStockStatusColor()}`}
                  >
                    <span className='flex items-center gap-1'>
                      {getStockIcon()}
                      {isOutOfStock
                        ? ' Out of Stock'
                        : isLowStock
                          ? ` Only ${availableStock} left`
                          : `${availableStock} available`}
                    </span>
                  </Badge>
                  {product.totalOrders > 100 && (
                    <Badge className='rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-3 py-1 text-xs font-medium text-white'>
                      ⭐ Bestseller
                    </Badge>
                  )}
                </div>
                <h1 className='text-4xl font-bold tracking-tight text-foreground lg:text-5xl'>
                  {product.name}
                </h1>
                <div className='flex flex-wrap items-center gap-4 text-sm'>
                  <div className='flex items-center gap-1 rounded-full bg-yellow-50 px-3 py-1 text-yellow-700'>
                    <Star className='h-4 w-4 fill-yellow-500 text-yellow-500' />
                    <span className='font-medium'>{product.totalOrders}</span>
                    <span className='text-muted-foreground'>orders</span>
                  </div>
                  <div className='flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-primary'>
                    <TrendingUp className='h-4 w-4' />
                    <span className='font-medium'>{product.orderedQuantity}</span>
                    <span className='text-muted-foreground'>sold</span>
                  </div>
                  <div className='flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-muted-foreground'>
                    <Package className='h-4 w-4' />
                    <span className='text-xs'>SKU: {product._id.slice(-8)}</span>
                  </div>
                </div>
              </div>

              <div className='space-y-2'>
                {discount > 0 ? (
                  <div className='flex items-baseline gap-3'>
                    <p className='text-4xl font-bold text-primary'>{formatPrice(product.price)}</p>
                    <p className='text-xl text-muted-foreground line-through'>
                      {formatPrice(product.originalPrice)}
                    </p>
                    <Badge className='bg-red-500 text-white'>
                      Save {formatPrice(product.originalPrice - product.price)}
                    </Badge>
                  </div>
                ) : (
                  <p className='text-4xl font-bold text-primary'>{formatPrice(product.price)}</p>
                )}
              </div>

              <p className='text-muted-foreground leading-relaxed'>{product.description}</p>

              <Separator className='my-2' />

              {/* Product Stats */}
              <div className='grid grid-cols-2 gap-4'>
                <div className='rounded-2xl border bg-gradient-to-br from-blue-50 to-white p-4 shadow-sm'>
                  <p className='text-xs text-muted-foreground'>First Introduced</p>
                  <p className='mt-1 font-semibold text-foreground'>
                    {new Date(product.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div className='rounded-2xl border bg-gradient-to-br from-green-50 to-white p-4 shadow-sm'>
                  <p className='text-xs text-muted-foreground'>Last Updated</p>
                  <p className='mt-1 font-semibold text-foreground'>
                    {new Date(product.updatedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Features */}
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                <div className='flex items-start gap-3 rounded-2xl border bg-gradient-to-br from-primary/5 to-transparent p-4 transition-all hover:shadow-md'>
                  <ShieldCheck className='mt-0.5 h-5 w-5 text-primary' />
                  <div className='space-y-1'>
                    <p className='text-sm font-semibold'>Secure Checkout</p>
                    <p className='text-xs text-muted-foreground'>Stock validated during checkout</p>
                  </div>
                </div>
                <div className='flex items-start gap-3 rounded-2xl border bg-gradient-to-br from-primary/5 to-transparent p-4 transition-all hover:shadow-md'>
                  <Truck className='mt-0.5 h-5 w-5 text-primary' />
                  <div className='space-y-1'>
                    <p className='text-sm font-semibold'>Live Inventory</p>
                    <p className='text-xs text-muted-foreground'>Real-time stock updates</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Quantity & Actions */}
              <div className='space-y-6 pt-2'>
                <div className='flex flex-wrap items-center gap-6'>
                  <div className='flex items-center rounded-full border-2 bg-white p-1 shadow-sm'>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='h-10 w-10 rounded-full hover:bg-muted'
                      onClick={handleDecrease}
                      disabled={isOutOfStock}
                    >
                      <Minus className='h-4 w-4' />
                    </Button>
                    <span className='w-12 text-center text-lg font-semibold'>{quantity}</span>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='h-10 w-10 rounded-full hover:bg-muted'
                      onClick={handleIncrease}
                      disabled={isOutOfStock || quantity >= availableStock}
                    >
                      <Plus className='h-4 w-4' />
                    </Button>
                  </div>
                  {!isOutOfStock && (
                    <p className='text-sm text-muted-foreground'>
                      <span className='font-semibold text-primary'>{availableStock}</span> units
                      available
                    </p>
                  )}
                </div>

                <div className='flex flex-col gap-3 sm:flex-row'>
                  <Button
                    size='lg'
                    className='h-14 flex-1 rounded-2xl bg-gradient-to-r from-primary to-primary/80 text-lg font-semibold shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/40'
                    disabled={addToCart.isPending || isOutOfStock}
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
                            toast.success(`Added ${quantity} × ${product.name} to cart`);
                            setQuantity(1);
                          },
                          onError: (mutationError) => {
                            toast.error(
                              mutationError.message ||
                                'Failed to add to cart. Please log in first.',
                            );
                          },
                        },
                      );
                    }}
                  >
                    {addToCart.isPending ? (
                      <>
                        <Spinner className='mr-2 h-5 w-5' />
                        Adding...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className='mr-2 h-5 w-5' />
                        Add to Cart
                      </>
                    )}
                  </Button>
                  <Button
                    size='lg'
                    variant='outline'
                    className='h-14 rounded-2xl border-2 transition-all hover:scale-105'
                    onClick={() => setIsWishlisted(!isWishlisted)}
                  >
                    <Heart
                      className={`mr-2 h-5 w-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`}
                    />
                    {isWishlisted ? 'Wishlisted' : 'Wishlist'}
                  </Button>
                  <Button size='lg' variant='outline' className='h-14 rounded-2xl border-2 px-4'>
                    <Share2 className='h-5 w-5' />
                  </Button>
                </div>
              </div>

              {/* Additional Info */}
              <div className='grid grid-cols-2 gap-4 pt-2'>
                <div className='flex items-start gap-3 rounded-2xl border bg-gradient-to-br from-emerald-50 to-white p-4'>
                  <Truck className='h-5 w-5 text-emerald-600' />
                  <div className='space-y-1'>
                    <p className='text-sm font-semibold'>Fast Delivery</p>
                    <p className='text-xs text-muted-foreground'>Ships within 24-48 hours</p>
                  </div>
                </div>
                <div className='flex items-start gap-3 rounded-2xl border bg-gradient-to-br from-purple-50 to-white p-4'>
                  <RotateCcw className='h-5 w-5 text-purple-600' />
                  <div className='space-y-1'>
                    <p className='text-sm font-semibold'>30-Day Returns</p>
                    <p className='text-xs text-muted-foreground'>Hassle-free money back</p>
                  </div>
                </div>
              </div>

              {/* Stock Warning */}
              {isLowStock && !isOutOfStock && (
                <div className='rounded-2xl border border-orange-200 bg-orange-50 p-4'>
                  <div className='flex items-center gap-2 text-orange-700'>
                    <Clock className='h-5 w-5' />
                    <p className='text-sm font-medium'>
                      Hurry up! Only {availableStock} units left in stock
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className='rounded-3xl border bg-white/80 p-12 text-center shadow-lg backdrop-blur-sm'>
            <Package className='mx-auto h-16 w-16 text-muted-foreground' />
            <p className='mt-4 text-xl font-medium'>Product not found</p>
            <p className='mt-2 text-muted-foreground'>
              The catalog entry may have been removed or the ID is invalid.
            </p>
            <Button className='mt-6' asChild>
              <Link to='/'>Browse Products</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
