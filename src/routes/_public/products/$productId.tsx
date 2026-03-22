import { createFileRoute, Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { ShoppingBag, ArrowLeft, Truck, RotateCcw, Plus, Minus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import { useAddCartItem } from '@/queries/cart.queries';
import { toast } from 'sonner';
import { productService } from '@/services/product.service';

// Validation for product ID
const productIdSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
});

export const Route = createFileRoute('/_public/products/$productId')({
  parseParams: (params) => productIdSchema.parse(params),
  component: ProductDetailPage,
});

function ProductDetailPage() {
  const { productId } = Route.useParams();
  const [quantity, setQuantity] = useState(1);
  const addToCart = useAddCartItem();
  const {
    data: product,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => productService.getProductById(productId),
  });

  const availableStock = product?.availableStock ?? product?.stock ?? 0;
  const orderedQuantity = product?.orderedQuantity ?? 0;

  if (isLoading) {
    return (
      <div className='max-w-7xl mx-auto px-6 py-10'>
        <div className='flex items-center gap-2 text-muted-foreground'>
          <Loader2 className='h-4 w-4 animate-spin' />
          Loading product...
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className='max-w-7xl mx-auto px-6 py-10'>
        <div className='rounded-md border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive'>
          {(error as Error)?.message || 'Failed to load product'}
        </div>
      </div>
    );
  }

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

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
        {/* Product Image Section */}
        <div className='space-y-4'>
          <div className='aspect-square rounded-3xl bg-accent/50 flex items-center justify-center border border-accent overflow-hidden'>
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className='h-full w-full object-cover'
                onError={(event) => {
                  event.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <ShoppingBag className='h-32 w-32 text-muted-foreground/20' />
            )}
          </div>
          <div className='grid grid-cols-4 gap-4'>
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className='aspect-square rounded-xl bg-accent/30 border border-accent/50 flex items-center justify-center cursor-pointer hover:bg-accent/50 transition-colors'
              >
                <ShoppingBag className='h-8 w-8 text-muted-foreground/20' />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info Section */}
        <div className='flex flex-col space-y-6'>
          <div className='space-y-2'>
            <div className='flex items-center gap-2'>
              <Badge variant='secondary' className='rounded-full'>
                {product.category}
              </Badge>
              <Badge
                variant='outline'
                className='rounded-full text-green-600 border-green-200 bg-green-50'
              >
                {availableStock > 0 ? 'In Stock' : 'Out of Stock'}
              </Badge>
            </div>
            <h1 className='text-4xl font-bold tracking-tight text-foreground'>{product.name}</h1>
          </div>

          <p className='text-3xl font-bold'>LKR {product.price}</p>

          <p className='text-muted-foreground leading-relaxed'>{product.description}</p>

          <div className='grid grid-cols-2 gap-4 rounded-2xl border bg-accent/20 p-4 text-sm'>
            <div>
              <p className='text-muted-foreground'>Available stock</p>
              <p className='text-lg font-semibold'>{availableStock}</p>
            </div>
            <div>
              <p className='text-muted-foreground'>Ordered quantity</p>
              <p className='text-lg font-semibold'>{orderedQuantity}</p>
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className='space-y-4 pt-4'>
            <div className='flex items-center gap-6'>
              <div className='flex items-center border rounded-full p-1 bg-accent/30'>
                <Button
                  variant='ghost'
                  size='icon'
                  className='rounded-full h-8 w-8'
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className='h-3 w-3' />
                </Button>
                <span className='w-10 text-center font-medium'>{quantity}</span>
                <Button
                  variant='ghost'
                  size='icon'
                  className='rounded-full h-8 w-8'
                  onClick={() => setQuantity(Math.min(Math.max(availableStock, 1), quantity + 1))}
                >
                  <Plus className='h-3 w-3' />
                </Button>
              </div>
              <p className='text-sm text-muted-foreground'>
                Only {availableStock} units left in stock
              </p>
            </div>

            <div className='flex gap-4'>
              <Button
                size='lg'
                className='flex-1 h-14 text-lg rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/30'
                disabled={addToCart.isPending || availableStock <= 0}
                onClick={() => {
                  addToCart.mutate(
                    {
                      productId: product._id,
                      productName: product.name,
                      price: product.price,
                      quantity,
                    },
                    {
                      onSuccess: () => {
                        toast.success(`Added ${product.name} to cart`);
                        setQuantity(1);
                      },
                      onError: (error) => {
                        toast.error(error.message || 'Failed to add to cart. Please log in first.');
                      },
                    },
                  );
                }}
              >
                {addToCart.isPending
                  ? 'Adding...'
                  : availableStock > 0
                    ? 'Add to Cart'
                    : 'Out of Stock'}
              </Button>
              <Button size='lg' variant='outline' className='h-14 rounded-2xl'>
                Wishlist
              </Button>
            </div>
          </div>

          {/* Shipping/Returns Info */}
          <div className='grid grid-cols-2 gap-4 pt-4'>
            <div className='flex items-start gap-3 p-4 rounded-2xl bg-accent/20 border border-accent/50'>
              <Truck className='h-5 w-5 text-primary' />
              <div className='space-y-1'>
                <p className='text-sm font-semibold'>Fast Delivery</p>
                <p className='text-xs text-muted-foreground'>Ships within 24-48 hours</p>
              </div>
            </div>
            <div className='flex items-start gap-3 p-4 rounded-2xl bg-accent/20 border border-accent/50'>
              <RotateCcw className='h-5 w-5 text-primary' />
              <div className='space-y-1'>
                <p className='text-sm font-semibold'>30-Day Returns</p>
                <p className='text-xs text-muted-foreground'>Hassle-free money back</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
